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
  * KompromatCards.class.php
  *
  * Helper module for cards
  *
  */

class KompromatCards extends APP_GameClass
{
    public $game;

    public function __construct($game)
    {
        $this->game = $game;

        $this->cards = $this->game->getNew( 'module.common.deck' );
        $this->cards->init( 'card' );
    }

    /**
     * Set up cards for a new game
     */
    public function setupNewGame( $players, $options )
    {
        // Create blue, yellow, and mission decks
        $blue_deck = [];
        $yellow_deck = [];
        $mission_deck = [];
        foreach( $this->game->card_type as $card_type_id => $card_type )
        {
            if( $card_type['type'] == BLUE )
            {
                $blue_deck[] = array( 'type' => $card_type['type'], 'type_arg' => $card_type_id, 'nbr' => $card_type['count'] );
            }
            elseif( $card_type['type'] == YELLOW )
            {
                $yellow_deck[] = array( 'type' => $card_type['type'], 'type_arg' => $card_type_id, 'nbr' => $card_type['count'] );
            }
            else
            {
                $mission_deck[] = array( 'type' => $card_type['type'], 'type_arg' => $card_type_id, 'nbr' => $card_type['count'] );
            }
        }

        // Create cards
        $this->cards->createCards( $blue_deck, 'blue_deck');
        $this->cards->createCards( $yellow_deck, 'yellow_deck');
        $this->cards->createCards( $mission_deck, 'mission_deck');
        
        // Shuffle decks
        $this->cards->shuffle( 'blue_deck' );
        $this->cards->shuffle( 'yellow_deck' );
        $this->cards->shuffle( 'mission_deck' );

        // Reveal missions
        self::revealNewMissions();
    }

    /**
     * Fill mission slots with new cards
     */
    public function revealNewMissions()
    {
        $slots_with_counterintelligence = [];
        for( $slot = 1; $slot <= 4; $slot++ )
        {
            // Draw card for mission slot
            $drawn_card = $this->cards->pickCardForLocation( 'mission_deck', 'mission_slot', $slot );

            // If card is counterintel flag slot for new mission
            if( $drawn_card['type'] == COUNTERINTELLIGENCE )
            {
                $slots_with_counterintelligence[] = $slot;
            }
        }

        // Draw a mission card for counterintel cards
        foreach( $slots_with_counterintelligence as $slot )
        {
            self::drawNextNonCounterintelCardIntoSlot( $slot );
        }

        // Return cards in holding area to deck and reshuffle
        $this->cards->moveAllCardsInLocation( 'holding_area', 'mission_deck' );
        $this->cards->shuffle( 'mission_deck' );
    }

    public function getCardsInMissionSlots()
    {
        return $this->cards->getCardsInLocation( 'mission_slot' );
    }

    public function getMissionDeckCount()
    {
        return $this->cards->countCardInLocation( 'mission_deck' );
    }

    /**
     * Draw the next card that is not a counterintelligence card
     */
    private function drawNextNonCounterintelCardIntoSlot( $slot )
    {
        // Draw card into temp holding area
        $drawn_card = $this->cards->pickCardForLocation( 'mission_deck', 'holding_area' );

        // If card is not counterintel move it to the slot. Else draw again
        if ( $drawn_card['type'] != COUNTERINTELLIGENCE )
        {
            $card_id = $drawn_card['id'];
            $this->cards->moveCard( $card_id, 'mission_slot', $slot );
        }
        else
        {
            self::drawNextNonCounterintelCardIntoSlot( $slot );
        }

    }
}