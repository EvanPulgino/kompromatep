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
 * states.inc.php
 *
 * KompromatEP game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!
 
$machinestates = array(

    /**
     * INITIAL STATE
     * 
     * DO NOT MODIFY!
     */
    GAME_SETUP => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "" => PLAYER_TURN )
    ),

    /**
     * Use a multiple active player state for player turns to handle using item state changes
     */
    PLAYER_TURN => array(
        "name" => "playerTurn",
        "description" => clienttranslate('Waiting for other player to finish turn.'),
        "descriptionmyturn" => clienttranslate('${you} must do your turn.'),
        "type" => "multipleactiveplayer",
        "initialprivate" => PLAYER_TURN_FIRST_CARD,
        "action" => "stPlayerTurn",
        "transitions" => array( "nextPlayer" => NEXT_PLAYER )
    ),
    
    /**
     * Player decides which mission to play the first face up card to.
     */
    PLAYER_TURN_FIRST_CARD => array(
    	"name" => "playerTurnFirstCard",
    	"description" => clienttranslate('${actplayer} must start a mission with the ${card_name}'),
    	"descriptionmyturn" => clienttranslate('${you} must start a mission with the ${card_name}'),
    	"type" => "private",
        "args" => "argsPlayerTurnFirstCard",
    	"possibleactions" => array( SELECT_MISSION, USE_ITEM ),
    	"transitions" => array( 
            "playCards" => PLAYER_TURN_CONTINUE_MISSION,
            "nextPlayer" => NEXT_PLAYER,
            "useDrone" => USE_DRONE,
            "useJetpack" => USE_JETPACK,
            "useNewspaper" => USE_NEWSPAPER,
            "useStunGun" => USE_STUN_GUN,
            "useUsbStick" => USE_USB_STICK,
            "useVesperMartini" => USE_VESPER_MARTINI
        )
    ),

    /**
     * Player decides to keep drawing cards for mission or stop.
     */
    PLAYER_TURN_CONTINUE_MISSION => array(
        "name" => "playerTurnContinueMission",
        "description" => clienttranslate('${actplayer} may draw another card or pass.'),
        "descriptionmyturn" => clienttranslate('${you} may draw another card or pass.'),
        "type" => "private",
        "possibleactions" => array( DRAW_CARD, STOP_DRAWING, USE_ITEM ),
        "transitions" => array( 
            "playCards" => PLAYER_TURN_CONTINUE_MISSION,
            "nextPlayer" => NEXT_PLAYER,
            "useDrone" => USE_DRONE,
            "useJetpack" => USE_JETPACK,
            "useNewspaper" => USE_NEWSPAPER,
            "useStunGun" => USE_STUN_GUN,
            "useUsbStick" => USE_USB_STICK,
            "useVesperMartini" => USE_VESPER_MARTINI
        )
    ),

    /**
     * Make next player active for turn or move to reveal step.
     */
    NEXT_PLAYER => array(
        "name" => "nextPlayer",
        "type" => "game",
        "action" => "stGameNextPlayer",
        "updateGameProgression" => true,
        "transitions" => array( "nextTurn" => PLAYER_TURN_FIRST_CARD, "endTurns" => USE_ITEMS_PHASE )
    ),

    /**
     * Use items phase before or after revealing cards.
     */
    USE_ITEMS_PHASE => array(
        "name" => "useItemsPhase",
        "description" => clienttranslate('Waiting for other player to use items or pass.'),
        "descriptionmyturn" => clienttranslate('${you} may use items or pass.'),
        "type" => "multipleactiveplayer",
        "initialprivate" => USE_ITEMS,
        "transitions" => array( "revealCards" => REVEAL_CARDS, "failedMission" => FAILED_MISSION ),
        "action" => "stMultiPlayerInit"
    ),

    /**
     * Use items private state
     */
    USE_ITEMS => array(
        "name" => "useItem",
        "description" => clienttranslate('Waiting for other players to finish using items.'),
        "descriptionmyturn" => clienttranslate('${you} may use an item or pass.'),
        "type" => "private",
        "possibleactions" => array( USE_ITEM, STOP_USING_ITEMS ),
        "transitions" => array( 
            "useDrone" => USE_DRONE,
            "useJetpack" =>USE_JETPACK,
            "useNewspaper" => USE_NEWSPAPER,
            "useStunGun" => USE_STUN_GUN,
            "useUsbStick" => USE_USB_STICK,
            "useVesperMartini" => USE_VESPER_MARTINI
        )
    ),

    /**
     * Use Drone item
     */
    USE_DRONE => array(
        "name" => "useDrone",
        "descriptionmyturn" => clienttranslate('${you} must select a mission to reveal all opponent\'s cards.'),
        "type" => "private",
        "possibleactions" => array( DRONE_SELECT_MISSION ),
        "transitions" => array( "playCards" => PLAYER_TURN_CONTINUE_MISSION, "useItems" => USE_ITEMS )
    ),

    /**
     * Use Jetpack item (step 1)
     */
    USE_JETPACK => array(
        "name" => "useJetpack",
        "descriptionmyturn" => clienttranslate('${you} must select a mission to move cards from.'),
        "type" => "private",
        "possibleactions" => array( JETPACK_SELECT_SOURCE ),
        "transitions" => array( "selectDestination" => USE_JETPACK_DESTINATION )
    ),

    /**
     * Use Jetpack item (step 2)
     */
    USE_JETPACK_DESTINATION => array(
        "name" => "useJetpackDestination",
        "descriptionmyturn" => clienttranslate('${you} must select a mission to move selected cards to.'),
        "type" => "private",
        "possibleactions" => array( JETPACK_SELECT_DESTINATION ),
        "transitions" => array( "playCards" => PLAYER_TURN_CONTINUE_MISSION, "useItems" => USE_ITEMS )
    ),

    /**
     * Use Newspaper item
     */
    USE_NEWSPAPER => array(
        "name" => "useNewspaper",
        "descriptionmyturn" => clienttranslate('${you} must assign Newspaper to unrevealed mission of opponent.'),
        "type" => "private",
        "possibleactions" => array( NEWSPAPER_SELECT_MISSION ),
        "transitions" => array( "playCards" => PLAYER_TURN_CONTINUE_MISSION, "useItems" => USE_ITEMS )

    ),

    /**
     * Use Stun Gun item
     */
    USE_STUN_GUN => array(
        "name" => "useStunGun",
        "descriptionmyturn" => clienttranslate('${you} must select a face-down card to discard.'),
        "type" => "private",
        "possibleactions" => array( STUN_GUN_SELECT_CARD ),
        "transitions" => array( "playCards" => PLAYER_TURN_CONTINUE_MISSION, "useItems" => USE_ITEMS )
    ),

    /**
     * Use USB Stick item
     */
    USE_USB_STICK => array(
        "name" => "useUsbStick",
        "descriptionmyturn" => clienttranslate('${you} must select an item to re-use.'),
        "type" => "private",
        "possibleactions" => array( USE_ITEM ),
        "transitions" => array( "playCards" => PLAYER_TURN_CONTINUE_MISSION, "useItems" => USE_ITEMS )
    ),

    /**
     * Use Vesper Martini item
     */
    USE_VESPER_MARTINI => array(
        "name" => "useVesperMartini",
        "descriptionmyturn" => clienttranslate('${you} must adjust your total by +1 or -1.'),
        "type" => "private",
        "possibleactions" => array( VESPER_MARTINI_ADJUST_TOTAL ),
        "transitions" => array( "playCards" => PLAYER_TURN_CONTINUE_MISSION, "useItems" => USE_ITEMS )
    ),

    /**
     * Reveal cards on next mission to resolve.
     */
    REVEAL_CARDS => array(
        "name" => "revealCards",
        "type" => "game",
        "action" => "stRevealCards",
        "transitions" => array( "useItems" => USE_ITEMS_PHASE )
    ),

    /**
     * Players with failed missions gain notoriety
     */
    FAILED_MISSION => array(
        "name" => "failedMission",
        "type" => "game",
        "action" => "stFailedMission",
        "transitions" => array( "perfectMission" => PERFECT_MISSION )
    ),

    /**
     * Players with perfect missions can discard one notoriety.
     */
    PERFECT_MISSION => array(
        "name" => "perfectMission",
        "description" => clienttranslate('Waiting for other player to discard notoriety or pass.'),
        "descriptionmyturn" => clienttranslate('You may discard one notoriety or pass.'),
        "type" => "multipleactiveplayer",
        "possibleactions" => array( DISCARD_NOTORIETY, KEEP_NOTORIETY ),
        "transitions" => array( "checkChloroform" => CHECK_CHLOROFORM ),
        "action" => "stMultiPlayerInit"
    ),

    /**
     * If a player has chloroform they can decide to use it to ignore counter-intelligence.
     */
    CHECK_CHLOROFORM => array(
        "name" => "checkChloroform",
        "description" => clienttranslate('Waiting for other player to use Chloroform or not.'),
        "descriptionmyturn" => clienttranslate('${you} can use Choloroform to ignore Counter-Intelligence.'),
        "type" => "activeplayer",
        "possibleactions" => array( USE_CHLOROFORM, SKIP_CHLOROFORM ),
        "transitions" => array( "awardMission" => AWARD_MISSION )
    ),

    /**
     * Award mission to winning player.
     */
    AWARD_MISSION => array(
        "name" => "awardMission",
        "type" => "game",
        "action" => "stAwardMission",
        "transitions" => array( "revealCards" => REVEAL_CARDS, "nextRound" => NEXT_ROUND )
    ),

    /**
     * Advance to next round or final scoring.
     */
    NEXT_ROUND => array(
        "name" => "nextRound",
        "type" => "game",
        "action" => "stNextRound",
        "transitions" => array( "nextRound" => PLAYER_TURN_FIRST_CARD, "finalScoring" => FINAL_SCORING )
    ),

    /**
     * Perform final scoring.
     */
    FINAL_SCORING => array(
        "name" => "finalScoring",
        "type" => "game",
        "action" => "stFinalScoring",
        "transitions" => array( "gameEnd" => END_GAME )
    ),
   
    /**
     * FINAL STATE
     * 
     * DO NOT MODIFY!
     */
    END_GAME => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )

);



