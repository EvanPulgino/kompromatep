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
   * Card Ids
   */
  define('YELLOW_ACE', 0);
  define('YELLOW_TEN', 1);
  define('YELLOW_NINE', 2);
  define('YELLOW_EIGHT', 3);
  define('YELLOW_THREE', 4);
  define('BLUE_SEVEN', 5);
  define('BLUE_FOUR', 6);
  define('BALACLAVA', 7);
  define('LOCKER', 8);
  define('YELLOW_BACK', 9);
  define('YELLOW_SEVEN', 10);
  define('YELLOW_SIX', 11);
  define('YELLOW_FIVE', 12);
  define('YELLOW_FOUR', 13);
  define('YELLOW_TWO', 14);
  define('BLUE_SIX', 15);
  define('BLUE_THREE', 16);
  define('JETPACK', 17);
  define('INTERROGATION', 18);
  define('BLUE_BACK', 19);
  define('YELLOW_HALF', 20);
  define('BLUE_ACE', 21);
  define('BLUE_TEN', 22);
  define('BLUE_NINE', 23);
  define('BLUE_EIGHT', 24);
  define('BLUE_FIVE', 25);
  define('BLUE_TWO', 26);
  define('GPS_TRACKER', 27);
  define('PURSUIT', 28);
  define('MISSION_BACK', 29);
  define('BLUE_HALF', 30);
  define('CODE_ID', 31);
  define('DOCUMENT_ID', 32);
  define('COUNTERINTELLIGENCE_THREE', 33);
  define('COUNTERINTELLIGENCE_TWO', 34);
  define('COUNTERINTELLIGENCE_ONE', 35);
  define('NEWSPAPER', 36);
  define('CHLOROFORM', 37);
  define('SAFE_HOUSE', 38);
  define('STUN_GUN', 39);
  define('DRONE', 40);
  define('USB_STICK', 41);
  define('VESPER_MARTINI', 42);
  define('NIGHT_VISION', 43);
  define('HOTEL', 44);
  define('BARMAID', 45);
  define('AIRPORT', 46);
  define('INFORMANT', 47);

  /**
   * Card Types
   */
  define('BLUE', 'blue');
  define('CODE', 'code');
  define('COUNTERINTELLIGENCE', 'counterintel');
  define('DOCUMENT', 'document');
  define('ITEM', 'item');
  define('TARGET', 'target');
  define('YELLOW', 'yellow');

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
