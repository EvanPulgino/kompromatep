<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * KompromatEP implementation : © Evan Pulgino <evan.pulgino@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * kompromatep.action.php
 *
 * KompromatEP main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/kompromatep/kompromatep/myAction.html", ...)
 *
 */
  
  
  class action_kompromatep extends APP_GameAction
  { 
    // Constructor: please do not modify
   	public function __default()
  	{
  	    if( self::isArg( 'notifwindow') )
  	    {
            $this->view = "common_notifwindow";
  	        $this->viewArgs['table'] = self::getArg( "table", AT_posint, true );
  	    }
  	    else
  	    {
            $this->view = "kompromatep_kompromatep";
            self::trace( "Complete reinitialization of board game" );
      }
  	} 
  	
  	/**
     * Discard 1 notoriety.
     */
    public function discardNotoriety()
    {
      self::setAjaxMode();

      $this->game->discardNotoriety();

      self::ajaxResponse();
    }

    /**
     * Draw 1 card for current mission.
     */
    public function drawCard()
    {
      self::setAjaxMode();

      $this->game->drawCard();

      self::ajaxResponse();
    }

    /**
     * Select mission to use drone on.
     */
    public function droneSelectMission()
    {
      self::setAjaxMode();

      $mission_slot = self::getArg( "missionSlot", AT_posint, true );

      $this->game->droneSelectMission( $mission_slot );

      self::ajaxResponse();
    }

    /**
     * Select destination mission to use jetpack on.
     */
    public function jetpackSelectDestination()
    {
      self::setAjaxMode();

      $mission_slot = self::getArg( "missionSlot", AT_posint, true );

      $this->game->jetpackSelectDestination( $mission_slot );

      self::ajaxResponse();
    }

    /**
     * Select source mission to use jetpack on.
     */
    public function jetpackSelectSource()
    {
      self::setAjaxMode();

      $mission_slot = self::getArg( "missionSlot", AT_posint, true );

      $this->game->jetpackSelectSource( $mission_slot );

      self::ajaxResponse();
    }

    /**
     * Keep notoriety.
     */
    public function keepNotoriety()
    {
      self::setAjaxMode();

      $this->game->keepNotoriety();

      self::ajaxResponse();
    }

    /**
     * Select mission to use newspaper on.
     */
    public function newspaperSelectMission()
    {
      self::setAjaxMode();

      $mission_slot = self::getArg( "missionSlot", AT_posint, true );

      $this->game->newspaperSelectMission( $mission_slot );

      self::ajaxResponse();
    }

    /**
     * Select Mission to play face-up card.
     */
    public function selectMission()
    {
      self::setAjaxMode();

      $card_id = self::getArg( "cardId", AT_posint, true );
      $mission_slot = self::getArg( "missionSlot", AT_posint, true );

      $this->game->selectMission( $card_id, $mission_slot );

      self::ajaxResponse();
    }

    /**
     * Skip using chloroform.
     */
    public function skipChloroform()
    {
      self::setAjaxMode();

      $this->game->skipChloroform();

      self::ajaxResponse();
    }

    /**
     * Stop drawing card for current mission.
     */
    public function stopDrawing()
    {
      self::setAjaxMode();

      $this->game->stopDrawing();

      self::ajaxResponse();
    }

    /**
     * Stop using items.
     */
    public function stopUsingItems()
    {
      self::setAjaxMode();

      $this->game->stopUsingItems();

      self::ajaxResponse();
    }

    /**
     * Select card to use stun gun on.
     */
    public function stunGunSelectCard()
    {
      self::setAjaxMode();

      $card_id = self::getArg( "cardId", AT_posint, true );

      $this->game->stunGunSelectCard( $card_id );

      self::ajaxResponse();
    }

    /**
     * Use chloroform.
     */
    public function useChloroform()
    {
      self::setAjaxMode();

      $this->game->useChloroform();

      self::ajaxResponse();
    }

    /**
     * Use item.
     */
    public function useItem()
    {
      self::setAjaxMode();

      $card_id = self::getArg( "cardId", AT_posint, true );

      $this->game->useItem( $card_id );

      self::ajaxResponse();
    }

    /**
     * Use vesper martini to adjust value of mission by 1
     */
    public function vesperMartiniAdjustTotal()
    {
      self::setAjaxMode();

      $mission_slot = self::getArg( "missionSlot", AT_posint, true );
      $modifier = self::getArg( "modifier", AT_int, true );

      $this->game->vesperMartiniAdjustTotal( $mission_slot, $modifier );

      self::ajaxResponse();
    }

  }
  

