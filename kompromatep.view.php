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
 * kompromatep.view.php
 *
 * This is your "view" file.
 *
 * The method "build_page" below is called each time the game interface is displayed to a player, ie:
 * _ when the game starts
 * _ when a player refreshes the game page (F5)
 *
 * "build_page" method allows you to dynamically modify the HTML generated for the game interface. In
 * particular, you can set here the values of variables elements defined in kompromatep_kompromatep.tpl (elements
 * like {MY_VARIABLE_ELEMENT}), and insert HTML block elements (also defined in your HTML template file)
 *
 * Note: if the HTML of your game interface is always the same, you don't have to place anything here.
 *
 */
  
  require_once( APP_BASE_PATH."view/common/game.view.php" );
  
  class view_kompromatep_kompromatep extends game_view
  {
    function getGameName() {
        return "kompromatep";
    }    
  	function build_page( $viewArgs )
  	{		
        // Template name
        $template = self::getGameName().'_'.self::getGameName();

  	    // Get players & players number
        $players = $this->game->loadPlayersBasicInfos();
        $players_nbr = count( $players );

        $order = 1;

        $this->page->begin_block( $template, 'playerarea' );

        $this->page->begin_block( $template, 'playermissionslot' );
        $this->page->begin_block( $template, 'playermission' );

        foreach( $players as $player )
        {
          $this->page->reset_subblocks('playermissionslot');

          $this->page->insert_block( "playerarea", array(
            'PLAYER_ID' => $player['player_id'],
            'PLAYER_NAME' => $player['player_name'],
            'PLAYER_COLOR' => $player['player_color'],
            'ORDER' => $order
          ) );

          for( $slot_number = 1; $slot_number <= 4; $slot_number++ )
          {
            $this->page->insert_block( "playermissionslot", array(
              'PLAYER_ID' => $player['player_id'],
              'PLAYER_NAME' => $player['player_name'],
              'PLAYER_COLOR' => $player['player_color'],
              'SLOT_NUMBER' => $slot_number
            ) );
          }

          $this->page->insert_block( "playermission", array(
            'PLAYER_ID' => $player['player_id'],
            'PLAYER_NAME' => $player['player_name'],
            'PLAYER_COLOR' => $player['player_color'],
            'ORDER' => $order
          ) );

          if( $order == 1 ) {
            $order = 3;
          }
        }

        $this->page->begin_block( $template, 'missionslot' );

        for( $slot_number = 1; $slot_number <= 4; $slot_number++ )
        {
          $this->page->insert_block( "missionslot", array( 'SLOT_NUMBER' => $slot_number ) );
        }



        /*
        
        // Examples: set the value of some element defined in your tpl file like this: {MY_VARIABLE_ELEMENT}

        // Display a specific number / string
        $this->tpl['MY_VARIABLE_ELEMENT'] = $number_to_display;

        // Display a string to be translated in all languages: 
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::_("A string to be translated");

        // Display some HTML content of your own:
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::raw( $some_html_code );
        
        */
        
        /*
        
        // Example: display a specific HTML block for each player in this game.
        // (note: the block is defined in your .tpl file like this:
        //      <!-- BEGIN myblock --> 
        //          ... my HTML code ...
        //      <!-- END myblock --> 
        

        $this->page->begin_block( "kompromatep_kompromatep", "myblock" );
        foreach( $players as $player )
        {
            $this->page->insert_block( "myblock", array( 
                                                    "PLAYER_NAME" => $player['player_name'],
                                                    "SOME_VARIABLE" => $some_value
                                                    ...
                                                     ) );
        }
        
        */



        /*********** Do not change anything below this line  ************/
  	}
  }
  

