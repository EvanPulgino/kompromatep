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
 * material.inc.php
 *
 * KompromatEP game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

require_once( 'modules/constants.inc.php' );

$this->card_type = array(
  BLUE_ACE => array(
    'name' => '1/11',
    'type' => BLUE,
    'value' => 'ACE',
    'count' => 2,
    'class' => 'komp-card-blue-ace',
  ),
  BLUE_TWO => array(
    'name' => '2',
    'type' => BLUE,
    'value' => 2,
    'count' => 1,
    'class' => 'komp-card-blue-two'
  ),
  BLUE_THREE => array(
    'name' => '3',
    'type' => BLUE,
    'value' => 3,
    'count' => 1,
    'class' => 'komp-card-blue-three'
  ),
  BLUE_FOUR => array(
    'name' => '4',
    'type' => BLUE,
    'value' => 4,
    'count' => 1,
    'class' => 'komp-card-blue-four'
  ),
  BLUE_FIVE => array(
    'name' => '5',
    'type' => BLUE,
    'value' => 5,
    'count' => 1,
    'class' => 'komp-card-blue-five'
  ),
  BLUE_SIX => array(
    'name' => '6',
    'type' => BLUE,
    'value' => 6,
    'count' => 1,
    'class' => 'komp-card-blue-six'
  ),
  BLUE_SEVEN => array(
    'name' => '7',
    'type' => BLUE,
    'value' => 7,
    'count' => 3,
    'class' => 'komp-card-blue-seven'
  ),
  BLUE_EIGHT => array(
    'name' => '8',
    'type' => BLUE,
    'value' => 8,
    'count' => 1,
    'class' => 'komp-card-blue-eight'
  ),
  BLUE_NINE => array(
    'name' => '9',
    'type' => BLUE,
    'value' => 9,
    'count' => 1,
    'class' => 'komp-card-blue-nine'
  ),
  BLUE_TEN => array(
    'name' => '10',
    'type' => BLUE,
    'value' => 10,
    'count' => 1,
    'class' => 'komp-card-blue-ten'
  ),
  BLUE_HALF => array(
    'name' => '0.5',
    'type' => BLUE,
    'value' => .5,
    'count' => 1,
    'class' => 'komp-card-blue-half'
  ),
  YELLOW_ACE => array(
    'name' => '1/11',
    'type' => YELLOW,
    'value' => 'ACE',
    'count' => 2,
    'class' => 'komp-card-yellow-ace',
  ),
  YELLOW_TWO => array(
    'name' => '2',
    'type' => YELLOW,
    'value' => 2,
    'count' => 1,
    'class' => 'komp-card-yellow-two'
  ),
  YELLOW_THREE => array(
    'name' => '3',
    'type' => YELLOW,
    'value' => 3,
    'count' => 1,
    'class' => 'komp-card-yellow-three'
  ),
  YELLOW_FOUR => array(
    'name' => '4',
    'type' => YELLOW,
    'value' => 4,
    'count' => 1,
    'class' => 'komp-card-yellow-four'
  ),
  YELLOW_FIVE => array(
    'name' => '5',
    'type' => YELLOW,
    'value' => 5,
    'count' => 1,
    'class' => 'komp-card-yellow-five'
  ),
  YELLOW_SIX => array(
    'name' => '6',
    'type' => YELLOW,
    'value' => 6,
    'count' => 1,
    'class' => 'komp-card-yellow-six'
  ),
  YELLOW_SEVEN => array(
    'name' => '7',
    'type' => YELLOW,
    'value' => 7,
    'count' => 3,
    'class' => 'komp-card-yellow-seven'
  ),
  YELLOW_EIGHT => array(
    'name' => '8',
    'type' => YELLOW,
    'value' => 8,
    'count' => 1,
    'class' => 'komp-card-yellow-eight'
  ),
  YELLOW_NINE => array(
    'name' => '9',
    'type' => YELLOW,
    'value' => 9,
    'count' => 1,
    'class' => 'komp-card-yellow-nine'
  ),
  YELLOW_TEN => array(
    'name' => '10',
    'type' => YELLOW,
    'value' => 10,
    'count' => 1,
    'class' => 'komp-card-yellow-ten'
  ),
  YELLOW_HALF => array(
    'name' => '0.5',
    'type' => YELLOW,
    'value' => .5,
    'count' => 1,
    'class' => 'komp-card-yellow-half'
  ),
  BALACLAVA => array(
    'name' => 'balaclava',
    'type' => ITEM,
    'count' => 1,
    'class' => 'komp-card-balaclava'
  ),
  CHLOROFORM => array(
    'name' => 'chloroform',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-chloroform'
  ),
  DRONE => array(
    'name' => 'drone',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-drone'
  ),
  GPS_TRACKER => array(
    'name' => 'gps tracker',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-gps-tracker'
  ),
  JETPACK => array(
    'name' => 'jetpack',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-jetpack'
  ),
  NEWSPAPER => array(
    'name' => 'newspaper',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-newspaper'
  ),
  NIGHT_VISION => array(
    'name' => 'night vision',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-night-vision'
  ),
  STUN_GUN => array(
    'name' => 'stun gun',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-stun-gun'
  ),
  USB_STICK => array(
    'name' => 'usb stick',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-usb-stick'
  ),
  VESPER_MARTINI => array(
    'name' => 'vesper martini',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-vesper-martini'
  ),
  JETPACK => array(
    'name' => 'jetpack',
    'type' => ITEM,
    'value' => 1,
    'count' => 1,
    'class' => 'komp-card-jetpack'
  ),
  CODE_ID => array(
    'name' => 'code',
    'type' => CODE,
    'count' => 3,
    'class' => 'komp-card-code'
  ),
  DOCUMENT_ID => array(
    'name' => 'document',
    'type' => DOCUMENT,
    'count' => 3,
    'class' => 'komp-card-document'
  ),
  COUNTERINTELLIGENCE_ONE => array(
    'name' => 'counterintelligence',
    'type' => COUNTERINTELLIGENCE,
    'value' => 1,
    'count' => 2,
    'class' => 'komp-card-counterintelligence-one'
  ),
  COUNTERINTELLIGENCE_TWO => array(
    'name' => 'counterintelligence',
    'type' => COUNTERINTELLIGENCE,
    'value' => 2,
    'count' => 2,
    'class' => 'komp-card-counterintelligence-two'
  ),
  COUNTERINTELLIGENCE_THREE => array(
    'name' => 'counterintelligence',
    'type' => COUNTERINTELLIGENCE,
    'value' => 3,
    'count' => 1,
    'class' => 'komp-card-counterintelligence-three'
  ),
  AIRPORT => array(
    'name' => 'the airport',
    'type' => TARGET,
    'value' => 3,
    'count' => 1,
    'class' => 'komp-card-airport'
  ),
  BARMAID => array(
    'name' => 'the barmaid',
    'type' => TARGET,
    'value' => 2,
    'count' => 1,
    'class' => 'komp-card-barmaid'
  ),
  HOTEL => array(
    'name' => 'the hotel',
    'type' => TARGET,
    'value' => 2,
    'count' => 1,
    'class' => 'komp-card-hotel'
  ),
  INFORMANT => array(
    'name' => 'the informant',
    'type' => TARGET,
    'value' => 5,
    'count' => 1,
    'class' => 'komp-card-informant'
  ),
  INTERROGATION => array(
    'name' => 'the interrogation',
    'type' => TARGET,
    'value' => 3,
    'count' => 1,
    'class' => 'komp-card-interrogation'
  ),
  LOCKER => array(
    'name' => 'the locker',
    'type' => TARGET,
    'value' => 3,
    'count' => 1,
    'class' => 'komp-card-locker'
  ),
  PURSUIT => array(
    'name' => 'the pursuit',
    'type' => TARGET,
    'value' => 4,
    'count' => 1,
    'class' => 'komp-card-pursuit'
  ),
  SAFE_HOUSE => array(
    'name' => 'the safe house',
    'type' => TARGET,
    'value' => 4,
    'count' => 1,
    'class' => 'komp-card-safe-house'
  ),
);
