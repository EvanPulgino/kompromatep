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
  * constants.inc.php
  *
  * Constants definition
  *
  */

  /**
   * Actions
   */
  define('DISCARD_NOTORIETY', 'discardNotoriety');
  define('DRAW_CARD', 'drawCard');
  define('DRONE_SELECT_MISSION', 'droneSelectMission');
  define('JETPACK_SELECT_DESTINATION', 'jetpackSelectDestination');
  define('JETPACK_SELECT_SOURCE', 'jetpackSelectSource');
  define('KEEP_NOTORIETY', 'keepNotoriety');
  define('NEWSPAPER_SELECT_MISSION', 'newspaperSelectMission');
  define('SELECT_MISSION', 'selectMission');
  define('SKIP_CHLOROFORM', 'skipChloroform');
  define('STOP_DRAWING', 'stopDrawing');
  define('STOP_USING_ITEMS', 'stopUsingItems');
  define('STUN_GUN_SELECT_CARD', 'stunGunSelectCard');
  define('USE_CHLOROFORM', 'useChloroform');
  define('USE_ITEM', 'useItem');
  define('VESPER_MARTINI_ADJUST_TOTAL', 'vesperMartiniAdjustTotal');

  /**
   * States
   */
  define('AWARD_MISSION', 44);
  define('CHECK_CHLOROFORM', 43);
  define('END_GAME', 99);
  define('FAILED_MISSION', 41);
  define('FINAL_SCORING', 50);
  define('GAME_SETUP', 1);
  define('NEXT_PLAYER', 20);
  define('NEXT_ROUND', 50);
  define('PERFECT_MISSION', 42);
  define('PLAYER_TURN', 10);
  define('PLAYER_TURN_FIRST_CARD', 11);
  define('PLAYER_TURN_CONTINUE_MISSION', 12);
  define('REVEAL_CARDS', 40);
  define('USE_DRONE', 60);
  define('USE_ITEMS', 31);
  define('USE_ITEMS_PHASE', 30);
  define('USE_JETPACK', 61);
  define('USE_JETPACK_DESTINATION', 62);
  define('USE_NEWSPAPER', 63);
  define('USE_STUN_GUN', 64);
  define('USE_USB_STICK', 65);
  define('USE_VESPER_MARTINI', 66);
