<?php
 /**
  *------
  * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
  * KompromatEP implementation : © Evan Pulgino <evan.pulgino@gmail.com>
  * 
  * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
  * See http://en.boardgamearena.com/#!doc/Studio for more information.
  * -----
  * 
  * kompromatep.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );
require_once( 'modules/constants.inc.php' );
require_once( 'modules/KompromatCards.class.php' );

class KompromatEP extends Table
{
	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        
        self::initGameStateLabels( array(
            "mission_slot_to_resolve" => 10
        ) );

        $this->cards = new KompromatCards( $this );
	}
	
    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "kompromatep";
    }	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];
 
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( $values, ',' );
        self::DbQuery( $sql );
        self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();
        
        /************ Start the game initialization *****/

        // Init global values with their initial values
        self::setGameStateInitialValue( 'mission_slot_to_resolve', 1 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // Setup cards
        $this->cards->setupNewGame( $players, $options );
       
        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();

        // Put player's first card on deck
        $this->cards->drawPlayerCardFaceupOnDeck( self::getActivePlayerColor() );

        /************ End of the game initialization *****/
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas()
    {
        $result = array();

        // Get constants for use in JavaScript
        $result['constants'] = get_defined_constants(true)['user'];
    
        $current_player_id = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!
    
        // Get information about players
        $sql = "SELECT player_id id, player_notoriety notoriety, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );

        // Get information from material
        $result['card_type'] = $this->card_type;

        // Get counts of each deck
        $result['blue_deck_count'] = $this->cards->getDeckCount( 'blue' );
        $result['mission_deck_count'] = $this->cards->getDeckCount( 'mission' );
        $result['yellow_deck_count'] = $this->cards->getDeckCount( 'yellow' );

        // Get cards on deck
        $result['card_on_deck']['blue'] = $this->cards->getCardOnDeck( 'blue' );
        $result['card_on_deck']['yellow'] = $this->cards->getCardOnDeck( 'yellow' );

        $result['missions'] = $this->cards->getCardsInMissionSlots();
  
        return $result;
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /**
     * Get string value of active player color
     */
    function getActivePlayerColor()
    {
        $active_player_id = $this->getActivePlayerId();
        return self::getPlayerColor( $active_player_id );
    }

    /**
     * Get string value from hex color
     */
    function getColorStringFromHex( $hex_color )
    {
        if( $hex_color == '0077bf' )
        {
            return 'blue';
        }
        else
        {
            return 'yellow';
        }
    }

    /**
     * Get string value of player color
     */
    function getPlayerColor( $player_id )
    {
        $player = self::getPlayerInfo( $player_id );
        $hex_color = $player['color'];
        return self::getColorStringFromHex( $hex_color );
    }

    /**
     * Get player info from  DB
     */
    function getPlayerInfo( $player_id )
    {
        return self::getObjectFromDB( "SELECT player_id id, player_name name, player_color color, player_score score, player_notoriety notoriety FROM player WHERE player_id=$player_id" );
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /**
     * Discard 1 notoriety
     */
    function discardNotoriety()
    {
        // Handle discard notoriety
    }

    /**
     * Draw 1 card for current mission
     */
    function drawCard()
    {
        // Handle card draw
    }

    /**
     * Select mission to use drone on
     */
    function droneSelectMission( $mission_slot )
    {
        // Handle drone select mission
    }

    /**
     * Select destination mission for jetpack
     */
    function jetpackSelectDestination( $mission_slot )
    {
        // Handle jetpack destination
    }

    /**
     * Select source mission for jetpack
     */
    function jetpackSelectSource( $mission_slot )
    {
        // Handle jetpack source
    }

    /**
     * Keep notoriety
     */
    function keepNotoriety()
    {
        // Handle keep notoriety
    }

    /**
     * Select mission to use newspaper on
     */
    function newspaperSelectMission( $mission_slot )
    {
        // Handle newspaper mission select
    }

    /**
     * Select a mission to play face-up card
     */
    function selectMission( $card_id, $mission_slot )
    {
        // Handle select mission
    }

    /**
     * Skip using chloroform
     */
    function skipChloroform()
    {
        // Hanlde skip chloroform
    }

    /**
     * Stop drawing cards for current mission
     */
    function stopDrawing()
    {
        // Handle stop drawing cards
    }

    /**
     * Stop using items
     */
    function stopUsingItems()
    {
        // Handle stop using items.
    }

    /**
     * Select card to use stun gun on
     */
    function stunGunSelectCard( $card_id )
    {
        // Handle stun gun select card
    }

    /**
     * Use chloroform
     */
    function useChloroform()
    {
        // Handle using chloroform
    }

    /**
     * Use an item
     */
    function useItem( $card_id )
    {
        // Handle using an item
    }

    /**
     * Use vesper martini to adjust value of mission by 1
     */
    function vesperMartiniAdjustTotal( $mission_slot, $modifier )
    {
        // Hanlde vesper martini
    }
    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*
    
    Example for game state "MyGameState":
    
    function argMyGameState()
    {
        // Get some values from the current game situation in database...
    
        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    function stAwardMission()
    {
        // Handle award mission
    }

    function stFailedMission()
    {
        // Handle failed mission
    }

    function stFinalScoring()
    {
        // Handle final scoring
    }

    /*
        Init a multiplayer active state
    */
    function stMultiPlayerInit() {
        $this->gamestate->setAllPlayersMultiactive();
    }

    function stNextPlayer()
    {
        // Handle player change
    }

    function stNextRound()
    {
        // Handle end of round
    }

    /**
     * Initialize private state for player turn.
     */
    function stPlayerTurn()
    {
        $this->gamestate->setPlayersMultiactive([$this->getActivePlayerId()], "");
        $this->gamestate->initializePrivateState($this->getActivePlayerId());
    }

    function stRevealCards()
    {
        // Handle reveal cards
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }    
}
