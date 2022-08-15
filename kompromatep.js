/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * KompromatEP implementation : © Evan Pulgino <evan.pulgino@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * kompromatep.js
 *
 * KompromatEP user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/zone"
],
function (dojo, declare) {
    return declare("bgagame.kompromatep", ebg.core.gamegui, {
        constructor: function(){
            console.log('kompromatep constructor');

            // Card size
            this.cardWidth = 135;
            this.cardHeight = 205.2;

            // Deck counters
            this.blueDeckCounter = new ebg.counter();
            this.missionDeckCounter = new ebg.counter();
            this.yellowDeckCounter = new ebg.counter();

            // Mission total counters
            this.playerMissionTotal = {};
            this.playerMissionTotal['blue'] = {};
            this.playerMissionTotal['yellow'] = {};
            for( var missionSlot = 1; missionSlot <= 4; missionSlot++ )
            {
                this.playerMissionTotal['blue'][missionSlot] = 
                {
                    divIdBase: 'komp_blue_mission_' + missionSlot,
                    nonAceTotal: 0,
                    aces: 0
                };

                this.playerMissionTotal['yellow'][missionSlot] = 
                {
                    divIdBase: 'komp_yellow_mission_' + missionSlot,
                    nonAceTotal: 0,
                    aces: 0
                };
            }

            // Content from material
            this.cardTypes = null;

            // Counterintel slot zones
            this.counterintelSlots = {};
            this.counterintelSlots[1] = new ebg.zone();
            this.counterintelSlots[2] = new ebg.zone();
            this.counterintelSlots[3] = new ebg.zone();
            this.counterintelSlots[4] = new ebg.zone();
              
            // Mission slot zones
            this.missionSlots = {};
            this.missionSlots[1] = new ebg.zone();
            this.missionSlots[2] = new ebg.zone();
            this.missionSlots[3] = new ebg.zone();
            this.missionSlots[4] = new ebg.zone();

            // Player mission slots
            this.playerSlots = {};
            this.playerSlots['blue'] = {};
            this.playerSlots['yellow'] = {};
            for( var slotNumber = 1; slotNumber <= 4; slotNumber++ )
            {
                this.playerSlots['blue'][slotNumber] = {};
                this.playerSlots['yellow'][slotNumber] = {};
                for( var cardNumber = 1; cardNumber <= 9; cardNumber++)
                {
                    this.playerSlots['blue'][slotNumber][cardNumber] = new ebg.zone();
                    this.playerSlots['yellow'][slotNumber][cardNumber] = new ebg.zone();
                }
            }
        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log( "Starting game setup" );

            console.log(gamedatas);

            // Import constants from PHP
            this.defineGlobalConstants( gamedatas.constants );

            // Populate material variables
            this.cardTypes = gamedatas.card_type;

            // Setup deck counters
            this.blueDeckCounter.create( 'komp_blue_deck_counter' );
            this.missionDeckCounter.create( 'komp_mission_deck_counter' );
            this.yellowDeckCounter.create( 'komp_yellow_deck_counter' );

            this.blueDeckCounter.setValue( gamedatas.blue_deck_count );
            this.missionDeckCounter.setValue( gamedatas.mission_deck_count );
            this.yellowDeckCounter.setValue( gamedatas.yellow_deck_count );
            
            // Setting up player info
            for( var playerId in gamedatas.players )
            {
                var player = gamedatas.players[playerId];
                var playerColor = this.getPlayerColorAsString( player.color );
                
                // Create facedown player deck
                this.createFaceDownPlayerDeck( playerId, playerColor );

                // If a player has card on queue for mission start, flip it over
                if( gamedatas.card_on_deck[playerColor] )
                {
                    this.flipTopCard( gamedatas.card_on_deck[playerColor] );
                }
            }

            // Create facedown mission deck
            this.createFaceDownMissionDeck();
            
            // Set up counterintel and mission counters + player card zones
            for( var missionSlot = 1; missionSlot <= 4; missionSlot++ )
            {
                // Build counterinter slot. Invert width and height for horizontal card
                var counterintelSlotDivId = 'komp_counterintel_slot_' + missionSlot;
                this.counterintelSlots[missionSlot].create( this, counterintelSlotDivId, this.cardHeight, this.cardHeight );

                // Build mission slot
                var missionSlotDivId = 'komp_mission_slot_' + missionSlot;
                this.missionSlots[missionSlot].create( this, missionSlotDivId, this.cardWidth, this.cardHeight );

                // Build player card zones
                for( cardNumber = 1; cardNumber <= 9; cardNumber++ )
                {
                    var blueSlotDiv = 'komp_blue_card_mission_' + missionSlot + '_' + cardNumber;
                    this.playerSlots['blue'][missionSlot][cardNumber].create( this, blueSlotDiv, this.cardHeight, this.cardWidth );

                    var yellowSlotDiv = 'komp_yellow_card_mission_' + missionSlot + '_' + cardNumber;
                    this.playerSlots['yellow'][missionSlot][cardNumber].create( this, yellowSlotDiv, this.cardHeight, this.cardWidth );
                }
            }

            // Create and place mission cards in mission column
            for( var cardId in gamedatas.missions )
            {
                var card = gamedatas.missions[cardId];
                var cardType = this.cardTypes[card.type_arg];

                this.createMissionCardOnDeck( card, cardType );
                this.moveMissionCardToSlot( card );
            }

            // Create and place player cards assigned to missions
            for( var missionSlot = 1; missionSlot <= 4; missionSlot++ )
            {
                for( var playerId in gamedatas.players )
                {
                    var player = gamedatas.players[playerId];
                    var color = this.getPlayerColorAsString( player.color );

                    var playedCards = gamedatas['mission_' + missionSlot][color];

                    for( var cardId in playedCards )
                    {
                        var card = playedCards[cardId];
                        var cardType = this.cardTypes[card.type_arg];

                        // Create card on deck
                        this.createPlayerCardOnDeck( card, cardType );
                        // Place card on assigned mission
                        this.placePlayerCardOnMission( card, cardType, missionSlot, gamedatas.current_mission, gamedatas.mission_slot_to_resolve );
                    }
                }
            }
 
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();

            console.log( "Ending game setup" );
        },
       

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            
            // Clear temp styles and disconnect handlers
            this.removeAllTemporaryStyles();
            this.disconnectAll();

            switch( stateName )
            {
                case 'playerTurnFirstCard':
                    if( this.isCurrentPlayerActive() )
                    {
                        var playerColor = this.getPlayerColor( this.getCurrentPlayerId() );
                        for( let slotNumber = 1; slotNumber <= 4; slotNumber++ )
                        {
                            if( this.playerSlots[playerColor][slotNumber][1].getItemNumber() == 0 )
                            {
                                this.makeElementInteractive( 'komp_mission_slot_' + slotNumber );
                                this.connect( $('komp_mission_slot_' + slotNumber), 'onclick', 'onSelectMission' );
                            }
                        }
                    }
                    break;
                case 'playerTurnContinueMission':
                    if( this.isCurrentPlayerActive() )
                    {
                        var playerColor = this.getPlayerColor( this.getCurrentPlayerId() );
                        var currentMission = args.args.current_mission;
                        var missionTotal = this.playerMissionTotal[playerColor][currentMission];

                        var busted = false;

                        if( missionTotal.aces == 0 && missionTotal.nonAceTotal > 21 )
                        {
                            busted = true;
                        }

                        if( missionTotal.aces == 1 && (missionTotal.nonAceTotal + 1) > 21 )
                        {
                            busted = true;
                        }

                        if( missionTotal.aces == 2 && (missionTotal.nonAceTotal + 2) > 21 )
                        {
                            busted = true;
                        }

                        if( !busted && args.args[playerColor + '_deck_size'] > 0 ){
                            this.makeElementInteractive( 'komp_player_deck_' + playerColor );
                            this.connect( $('komp_player_deck_' + playerColor), 'onclick', 'onDrawCard' );
                        }
                    }
                    break;
                case 'dummmy':
                    break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
                case 'dummmy':
                    break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
                    case 'playerTurnContinueMission':
                        if( this.isCurrentPlayerActive() )
                        {
                            this.addActionButton( 'stop_drawing_button', _('Stop Drawing'), 'onStopDrawing' );
                            dojo.addClass( 'stop_drawing_button', 'komp-button' );
                            dojo.addClass( 'stop_drawing_button', 'komp-important' );
                        }
                        break;
                    case 'useItems':
                        if( this.isCurrentPlayerActive() )
                        {
                            this.addActionButton( 'stop_using_items_button', _('Pass'), 'onStopUsingItems' );
                            dojo.addClass( 'stop_using_items_button', 'komp-button' );
                            dojo.addClass( 'stop_using_items_button', 'komp-important' );
                        }
                        break;
                    case 'chooseAces':
                        if( this.isCurrentPlayerActive() )
                        {
                            var missionSlotToResolve = args.mission_slot_to_resolve;
                            var playerColor = this.getPlayerColor( this.getCurrentPlayerId() );
                            var missionCounter = this.playerMissionTotal[playerColor][missionSlotToResolve];

                            if( missionCounter.aces == 0 )
                            {
                                this.addActionButton( 'choose_aces_button', missionCounter.nonAceTotal, 'onChooseAces' );
                                dojo.addClass( 'choose_aces_button', 'komp-button' );
                                if( missionCounter.nonAceTotal > 21 )
                                {
                                    dojo.addClass( 'choose_aces_button', 'komp-important' );
                                }
                            }

                            if( missionCounter.aces == 1 )
                            {
                                var oneTotal = missionCounter.nonAceTotal + 1
                                this.addActionButton( 'choose_aces_button_1', oneTotal, 'onChooseAces' );
                                dojo.addClass( 'choose_aces_button_1', 'komp-button' );
                                if( oneTotal > 21 )
                                {
                                    dojo.addClass( 'choose_aces_button_1', 'komp-important' );
                                }

                                var elevenTotal = missionCounter.nonAceTotal + 11
                                this.addActionButton( 'choose_aces_button_11', elevenTotal, 'onChooseAces' );
                                dojo.addClass( 'choose_aces_button_11', 'komp-button' );
                                if( elevenTotal > 21 )
                                {
                                    dojo.addClass( 'choose_aces_button_11', 'komp-important' );
                                }
                            }

                            if( missionCounter.aces == 2 )
                            {
                                var oneOneTotal = missionCounter.nonAceTotal + 2
                                this.addActionButton( 'choose_aces_button_1_1', oneOneTotal, 'onChooseAces' );
                                dojo.addClass( 'choose_aces_button_1_1', 'komp-button' );
                                if( oneOneTotal > 21 )
                                {
                                    dojo.addClass( 'choose_aces_button_1_1', 'komp-important' );
                                }

                                var oneElevenTotal = missionCounter.nonAceTotal + 12
                                this.addActionButton( 'choose_aces_button_1_11', oneElevenTotal, 'onChooseAces' );
                                dojo.addClass( 'choose_aces_button_1_11', 'komp-button' );
                                if( oneElevenTotal > 21 )
                                {
                                    dojo.addClass( 'choose_aces_button_1_11', 'komp-important' );
                                }

                                var elevenElevenTotal = missionCounter.nonAceTotal + 22
                                this.addActionButton( 'choose_aces_button_11_11', elevenElevenTotal, 'onChooseAces' );
                                dojo.addClass( 'choose_aces_button_11_11', 'komp-button' );
                                if( elevenElevenTotal > 21 )
                                {
                                    dojo.addClass( 'choose_aces_button_11_11', 'komp-important' );
                                }
                            }
                            
                        }
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods - GENERAL
        
        /**
         * Give JavaScript access to constants used in PHP.
         * 
         * @param userConstants a list of constants defined in 'constants.inc.php'
         */
        defineGlobalConstants: function( userConstants )
        {
            for ( var constant in userConstants )
            {
                if ( !globalThis[constant] )
                {
                    globalThis[constant] = userConstants[constant];
                }
            }
        },

        /**
         * Get URL for an action.
         * 
         * @param actionName The name of the action.
         * @returns The ajax URL of the action.
         */
        getActionUrl: function( actionName )
        {
            return '/' + this.game_name + '/' + this.game_name + '/' + actionName + '.html';
        },

        /**
         * Get player color from playerId
         * @param playerId 
         * @returns  Player color in string form
         */
        getPlayerColor: function( playerId )
        {
            return dojo.byId('komp_player_area_' + playerId).attributes.color.value;
        },

        /**
         * Converts player hex color into string for CSS use.
         * 
         * @param hexColor Player color in hex form
         * @returns Player color in string form
         */
        getPlayerColorAsString: function( hexColor )
        {
            if( hexColor == '0077bf' )
            {
                return 'blue';
            }
            else
            {
                return 'yellow';
            }
        },

        /**
         * Add CSS styling to make an element interactive.
         * 
         * @param {*} elementId 
         */
        makeElementInteractive: function( elementId )
        {
            dojo.addClass( elementId, [ 'komp-clickable', 'komp-highlight' ] );
        },
 
         /**
          * Remove all styles potentially added for temporary states.
          */
        removeAllTemporaryStyles: function() 
        {
            dojo.query('.komp-clickable').removeClass('komp-clickable');
            dojo.query('.komp-highlight').removeClass('komp-highlight');
        },

        /**
         * Trigger a player action.
         * 
         * @param actionName The name of the action to trigger.
         * @param args Args required by the action.
         */
        triggerPlayerAction: function( actionName, args )
        {
            // Check if action is possible in current state
            if ( !this.checkAction( actionName ) )
            {
                console.log( actionName + ' action is not possible at the moment.')
                return;
            }
 
            // Add lock = true to args
            if ( !args ) 
            {
                args = [];
            }
            args.lock = true;
 
            console.log( 'Triggering ' + actionName + ' action with args: ' + JSON.stringify(args) );
 
            this.ajaxcall( this.getActionUrl( actionName ), args, this, function( result )
                {
                    console.log( 'Successful call to: ' + actionName );
                }, function( error )
                {
                    if( error )
                    {
                        console.log( 'Error calling: ' + actionName );
                    }
                }
            );
        },

        ///////////////////////////////////////////////////
        //// Utility methods - CARDS

        /**
         * Creates a deck of facedown cards to simulate the mission draw pile.
         */
        createFaceDownMissionDeck: function()
        {
            for( var i = 0; i <= 5; i++ )
            {
                dojo.place(
                    this.format_block(
                        'jstpl_mission_card_back',
                        {
                            num: i
                        }
                    ),
                    'komp_mission_deck'
                );
            }
        },

        /**
         * Creates a deck of facedown cards to simulate a players draw pile.
         * 
         * @param playerId 
         * @param playerColor 
         * @param cardNumber 
         */
        createFaceDownPlayerDeck: function( playerId, playerColor )
        {
            for( var i = 0; i <= 4; i++ )
            {
                dojo.place(
                    this.format_block(
                        'jstpl_player_card_back',
                        {
                            player_id: playerId,
                            color: playerColor,
                            num: i
                        }
                    ),
                    'komp_player_deck_' + playerColor
                );
            }
        },

        /**
         * Create a mission card on top of the mission deck.
         * 
         * @param card dbRecord of card
         * @param cardType cardType from material
         */
        createMissionCardOnDeck: function( card, cardType )
        {
            dojo.place(
                this.format_block(
                    'jstpl_card',
                    {
                        card_id: card.id,
                        card_class: cardType.class,
                        slot: card.location_arg
                    }
                ),
                'komp_mission_deck'
            );
        },

        /**
         * Create a player card on top of the player's deck.
         * 
         * @param card dbRecord of card
         * @param cardType cardType from material
         */
        createPlayerCardOnDeck: function( card, cardType )
        {
            dojo.place(
                this.format_block(
                    'jstpl_card',
                    {
                        card_id: card.id,
                        card_class: cardType.class,
                        slot: card.type + '_' + card.location_arg
                    }
                ),
                'komp_player_deck_' + card.type
            );
        },

        /**
         * Flip the top card of a player's deck faceup.
         * 
         * @param card dbRecord of card 
         */
        flipTopCard: function( card )
        {
            var cardType = this.cardTypes[card.type_arg];

            // Create card on deck
            dojo.place(
                this.format_block(
                    'jstpl_card',
                    {
                        card_id: card.id,
                        card_class: cardType.class,
                        slot: 'ondeck'
                    }
                ),
                'komp_player_deck_' + card.type
            );
            dojo.addClass( 'komp_card_' + card.id, 'komp-card-on-deck')
        },

        /**
         * Move a mission card to its appropriate slot.
         * 
         * @param card dbRecord of card
         */
        moveMissionCardToSlot: function( card )
        {
            if( card.type == COUNTERINTELLIGENCE )
            {
                // Place in counterintel zone
                this.counterintelSlots[card.location_arg].placeInZone( 'komp_card_' + card.id );
                dojo.addClass( 'komp_card_' + card.id, 'komp-rotate-right' );
            }
            else
            {
                // Place in mission zone
                this.missionSlots[card.location_arg].placeInZone( 'komp_card_' + card.id );
            }
        },

        /**
         * Place a player card on a mission.
         * 
         * @param card dbRecord of Card
         * @param cardType cardType from material
         * @param missionSlot missionSlot of chosen mission
         * @param currentMissiot slot of mission active player is adding cards to
         * @param
         */
        placePlayerCardOnMission: function( card, cardType, missionSlot, currentMission, missionSlotToResolve )
        {
            var currentPlayerColor = this.getPlayerColor( this.getCurrentPlayerId() );

            var rotation = 'komp-rotate-';
            if( card.type == 'blue' )
            {
                rotation += 'right';
            }
            else
            {
                rotation += 'left';
            }

            var currentlyResolvingMission = missionSlotToResolve > 0 && missionSlotToResolve == missionSlot;

            if( (currentPlayerColor != card.type && card.location_arg > 1 && !currentlyResolvingMission) || (card.location_arg > 1 && missionSlot != currentMission && !currentlyResolvingMission) )
            {
                dojo.removeClass( 'komp_card_' + card.id, cardType.class );
                dojo.addClass( 'komp_card_' + card.id, 'komp-card-' + card.type + '-back');
            }
            
            // Add to mission total
            this.addValueToMissionTotal( card.type, missionSlot, cardType.value );

            // If mission is active for player or being resolved hide totals counters unhide counterts
            if( (missionSlotToResolve > 0 && missionSlot == missionSlotToResolve) || (currentPlayerColor == card.type && missionSlot == currentMission) )
            {
                dojo.removeClass( 'komp_' + card.type + '_mission_' + missionSlot + '_totals', 'komp-hidden' );
            }

            // Move card to mission slot
            dojo.removeClass( 'komp_card_' + card.id, 'komp-card-on-deck' );
            dojo.setAttr( 'komp_card_' + card.id, 'slot', card.type + '_' + card.id );
            dojo.addClass( 'komp_card_' + card.id, rotation );
            this.playerSlots[card.type][missionSlot][card.location_arg].placeInZone( 'komp_card_' + card.id );
        },

        ///////////////////////////////////////////////////
        //// Utility methods - COUNTERS

        /**
         * Add value of a card to mission total counter(s).
         * 
         * @param color color of card being added
         * @param missionSlot card is being added to
         * @param value of card
         */
        addValueToMissionTotal: function( color, missionSlot, value )
        {
            var counter = this.playerMissionTotal[color][missionSlot];
            var counterDiv = counter.divIdBase + '_total';

            // If ace, tick ace ounter
            if( value == 'ACE' )
            {
                counter.aces++;
            }
            // Else add value to nonAceTotal
            else
            {
                counter.nonAceTotal += value;
            }

            // Handle if there are aces
            if( counter.aces == 1 )
            {
                this.addValueToMissionTotalsIfOneAce( color, missionSlot );
            } 
            else if ( counter.aces == 2 )
            {
                this.addValueToMissionTotalsIfTwoAces( color, missionSlot );
            }
            else 
            {
                // Remove hidden class from counter and set value
                dojo.removeClass( counterDiv, 'komp-hidden' );
                dojo.byId( counterDiv ).textContent = counter.nonAceTotal;

                // If total is a bust add style
                if( counter.nonAceTotal > 21 )
                {
                    dojo.addClass( counterDiv, 'komp-mission-bust' );
                }
            }
            
        },

        /**
         * If the mission cards have one ace create and populate total counters for each possible value.
         * 
         * @param color of card being aded
         * @param missionSlot card is being added to
         */
        addValueToMissionTotalsIfOneAce: function( color, missionSlot )
        {
            var counter = this.playerMissionTotal[color][missionSlot];

            // Hide counter for no ace total
            dojo.addClass( counter.divIdBase + '_total', 'komp-hidden' );

            // Unhide and set value for counter using ace as '1'
            var aceOneDiv = counter.divIdBase + '_ace_1_total';
            var aceOneTotal = counter.nonAceTotal + 1;
            dojo.removeClass( aceOneDiv, 'komp-hidden' );
            dojo.byId( aceOneDiv ).textContent = aceOneTotal;
            if( aceOneTotal > 21 )
            {
                dojo.addClass( aceOneDiv, 'komp-mission-bust' );
            }

            // Unhide and set value for counter using ace as '11'
            var aceElevenDiv = counter.divIdBase + '_ace_11_total';
            var aceElevenTotal = counter.nonAceTotal + 11;
            dojo.removeClass( aceElevenDiv, 'komp-hidden' );
            dojo.byId( aceElevenDiv ).textContent = aceElevenTotal;
            if( aceElevenTotal > 21 )
            {
                dojo.addClass( aceElevenDiv, 'komp-mission-bust' );
            }
        },

        /**
         * If the mission cards have two aces create and populate total counters for each possible value.
         * 
         * @param color of card being aded
         * @param missionSlot card is being added to
         */
        addValueToMissionTotalsIfTwoAces: function( color, missionSlot )
        {
            var counter = this.playerMissionTotal[color][missionSlot];

            // Hide counters for one ace totals
            dojo.addClass( counter.divIdBase + '_ace_1_total', 'komp-hidden' );
            dojo.addClass( counter.divIdBase + '_ace_11_total', 'komp-hidden' );

            // Unhide and set value for using both aces as '1'
            var aceOneOneDiv = counter.divIdBase + '_ace_1_ace_1_total';
            var aceOneOneTotal = counter.nonAceTotal + 2;
            dojo.removeClass( aceOneOneDiv, 'komp-hidden' );
            dojo.byId( aceOneOneDiv ).textContent = aceOneOneTotal;
            if( aceOneOneTotal > 21 )
            {
                dojo.addClass( aceOneOneDiv, 'komp-mission-bust' );
            }

            // Unhide and set value for using an ace as '1' and an ace as '11'
            var aceOneElevenDiv = counter.divIdBase + '_ace_1_ace_11_total';
            var aceOneElevenTotal = counter.nonAceTotal + 12;
            dojo.removeClass( aceOneElevenDiv, 'komp-hidden' );
            dojo.byId( aceOneElevenDiv ).textContent = aceOneElevenTotal;
            if( aceOneElevenTotal > 21 )
            {
                dojo.addClass( aceOneElevenDiv, 'komp-mission-bust' );
            }

            // Unhide and set value for using both aces as '11'
            var aceElevenElevenDiv = counter.divIdBase + '_ace_11_ace_11_total';
            var aceElevenElevenTotal = counter.nonAceTotal + 22;
            dojo.removeClass( aceElevenElevenDiv, 'komp-hidden' );
            dojo.byId( aceElevenElevenDiv ).textContent = aceElevenElevenTotal;
            if( aceElevenElevenTotal > 21 )
            {
                dojo.addClass( aceElevenElevenDiv, 'komp-mission-bust' );
            }
        },

        ///////////////////////////////////////////////////
        //// Player's action

        onChooseAces: function( event )
        {
            console.log(event);

            var missionTotal = event.target.textContent;
            console.log(missionTotal);
        },
        
        /**
         * Discard one notoriety
         * 
         * @param event an onDiscardNotoriety event 
         */
        onDiscardNotoriety: function( event )
        {
            console.log( 'Calling onDiscardNotoriety with event: ' + event );

            // dojo.stopEvent( event );

            this.triggerPlayerAction( DISCARD_NOTORIETY );
        },

        /**
         * Draw one card for current mission
         * 
         * @param event an onDrawCard event 
         */
        onDrawCard: function( event ) 
        {
            console.log( 'Calling onDrawCard with event: ' + event );

            dojo.stopEvent( event );

            this.triggerPlayerAction( DRAW_CARD );
        },

        /**
         * Select mission to use drone on
         * 
         * @param event an onDroneSelectMission event 
         */
        onDroneSelectMission: function( event )
        {
            console.log( 'Calling onDroneSelectMission with event: ' + event );

            // dojo.stopEvent( event );

            var missionSlot = 1; // Get from event later

            this.triggerPlayerAction( DRONE_SELECT_MISSION, {missionSlot: missionSlot} );
        },

        /**
         * Select destination mission to use jetpack on
         * 
         * @param event an onJetpackSelectDestination event 
         */
        onJetpackSelectDestination: function( event )
        {
            console.log( 'Calling onJetpackSelectDestination with event: ' + event );

            // dojo.stopEvent( event );

            var missionSlot = 1; // Get from event later

            this.triggerPlayerAction( JETPACK_SELECT_DESTINATION, {missionSlot: missionSlot} );
        },

        /**
         * Select source mission to use jetpack on
         * 
         * @param event an onJetpackSelectSource event 
         */
        onJetpackSelectDestination: function( event )
        {
            console.log( 'Calling onJetpackSelectSource with event: ' + event );
 
            // dojo.stopEvent( event );
 
            var missionSlot = 1; // Get from event later
 
            this.triggerPlayerAction( JETPACK_SELECT_SOURCE, {missionSlot: missionSlot} );
        },

        /**
         * Keep notoriety
         * 
         * @param event an onKeepNotoriety event 
         */
        onKeepNotoriety: function( event )
        {
            console.log( 'Calling onKeepNotoriety with event: ' + event );
 
            // dojo.stopEvent( event );
 
            this.triggerPlayerAction( KEEP_NOTORIETY );
        },

        /**
         * Select mission to use newspaper on
         * 
         * @param event an onNewspaperSelectMission event 
         */
        onNewspaperSelectMission: function( event )
        {
            console.log( 'Calling onNewspaperSelectMission with event: ' + event );
 
            dojo.stopEvent( event );
 
            var missionSlot = 1; // Get from event later
 
            this.triggerPlayerAction( NEWSPAPER_SELECT_MISSION, {missionSlot: missionSlot} );
        },

        /**
         * Select a mission to play face-up card
         * 
         * @param event an onSelectMission event 
         */
        onSelectMission: function( event )
        {
            console.log( 'Calling onSelectMission with event: ' + event );

            dojo.stopEvent( event );

            var card = dojo.query("[slot=ondeck]")[0];

            var cardId = card.id.replace('komp_card_', '');
            var missionSlot = event.target.slot;

            this.triggerPlayerAction( SELECT_MISSION, {cardId: cardId, missionSlot: missionSlot} );
        },

        /**
         * Skip using chloroform
         * 
         * @param event an onSkipChloroform event 
         */
        onSkipChloroform: function( event ) 
        {
            console.log( 'Calling onSkipChloroform with event: ' + event );
 
            // dojo.stopEvent( event );
 
            this.triggerPlayerAction( SKIP_CHLOROFORM );
        },

        /**
         * Stop drawing cards for current mission
         * 
         * @param event an onStopDrawing event 
         */
        onStopDrawing: function( event )
        {
            console.log( 'Calling onStopDrawing with event: ' + event );

            dojo.stopEvent( event );
 
            this.triggerPlayerAction( STOP_DRAWING );
        },

         /**
         * Stop using items
         * 
         * @param event an onStopUsingItems event 
         */
        onStopUsingItems: function( event )
        {
            console.log( 'Calling onStopUsingItems with event: ' + event );

            dojo.stopEvent( event );

            var playerId = this.getCurrentPlayerId();
  
            this.triggerPlayerAction( STOP_USING_ITEMS, {playerId: playerId} );
        },

        /**
         * Select card to use stun gun on
         * 
         * @param event an onStunGunSelectCard event 
         */
        onStunGunSelectCard: function( event )
        {
            console.log( 'Calling onStunGunSelectCard with event: ' + event );
  
            // dojo.stopEvent( event );
  
            var cardId = 1; // Get from event later
  
            this.triggerPlayerAction( STUN_GUN_SELECT_CARD, {cardId: cardId} );
        },

        /**
         * Use chloroform
         * 
         * @param event an onUseChloroform event 
         */
        onUseChloroform: function( event ) 
        {
            console.log( 'Calling onUseChloroform with event: ' + event );
  
            // dojo.stopEvent( event );
  
            this.triggerPlayerAction( USE_CHLOROFORM );
        },

        /**
         * Use an item
         * 
         * @param event an onUseItem event 
         */
        onUseItem: function( event )
        {
            console.log( 'Calling onUseItem with event: ' + event );

            // dojo.stopEvent( event );

            var cardId = 1; // Get from event later

            this.triggerPlayerAction( USE_ITEM, {cardId: cardId} );
        },

        /**
         * Use vesper martini to adjust value of mission by 1
         * 
         * @param event an onVesperMartiniAdjustTotal event 
         */
        onVesperMartiniAdjustTotalseItem: function( event )
        {
            console.log( 'Calling onVesperMartiniAdjustTotal with event: ' + event );
 
            // dojo.stopEvent( event );
 
            var missionSlot = 1; // Get from event later
            var modifier = 1; // Get from event later
 
            this.triggerPlayerAction( VESPER_MARTINI_ADJUST_TOTAL, {missionSlot: missionSlot, modifier: modifier} );
         },
        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your kompromatep.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );

            dojo.subscribe( 'drawCard', this, 'notif_drawCard' );
            dojo.subscribe( 'drawFaceupCard', this, 'notif_drawFaceupCard' );
            dojo.subscribe( 'revealMissionCards', this, 'notif_revealMissionCards' );
            dojo.subscribe( 'startMission', this, 'notif_startMission' );
            dojo.subscribe( 'stopDrawingCards', this, 'notif_stopDrawingCards' );
        },

        notif_drawCard: function( notif )
        {
            var card = notif.args.card;
            var cardType = notif.args.card_type;
            var missionSlot = notif.args.mission_slot;

            this.flipTopCard( card );
            this.placePlayerCardOnMission( card, cardType, missionSlot, missionSlot );

            if( card.type == 'blue' )
            {
                this.blueDeckCounter.incValue(-1);
            } else {
                this.yellowDeckCounter.incValue(-1);
            }
        },
        
        notif_drawFaceupCard: function( notif )
        {
            var card = notif.args.card;
            this.flipTopCard( card )

            if( card.type == 'blue' )
            {
                this.blueDeckCounter.incValue(-1);
            } else {
                this.yellowDeckCounter.incValue(-1);
            }
        },

        notif_revealMissionCards: function( notif )
        {
            var missionSlot = notif.args.mission_slot;
            var blueCards = notif.args.blue_cards;
            var yellowCards = notif.args.yellow_cards;

            for( cardId in blueCards )
            {
                var card = blueCards[cardId];
                var cardType = this.cardTypes[card.type_arg];
                var cardDiv = 'komp_card_' + cardId;
                dojo.removeClass( cardDiv, 'komp-card-blue-back' );
                dojo.addClass( cardDiv, cardType.class );
            }
            dojo.removeClass( 'komp_blue_mission_' + missionSlot + '_totals', 'komp-hidden' );

            for( cardId in yellowCards )
            {
                var card = yellowCards[cardId];
                var cardType = this.cardTypes[card.type_arg];
                var cardDiv = 'komp_card_' + cardId;
                dojo.removeClass( cardDiv, 'komp-card-yellow-back' );
                dojo.addClass( cardDiv, cardType.class );
            }
            dojo.removeClass( 'komp_yellow_mission_' + missionSlot + '_totals', 'komp-hidden' );
        },

        notif_startMission: function( notif )
        {
            var card = notif.args.card;
            var cardType = notif.args.card_type;
            var missionSlot = notif.args.mission_slot;

            this.placePlayerCardOnMission( card, cardType, missionSlot, missionSlot );
        },

        notif_stopDrawingCards: function( notif )
        {
            var currentMission = notif.args.current_mission;
            var color = notif.args.player_color;
            var cards = notif.args.cards;

            for( cardId in cards )
            {
                var card = cards[cardId];

                // If card isn't in first slot, flip it face down
                if( card.location_arg > 1 )
                {
                    var cardType = this.cardTypes[card.type_arg];
                    var cardDiv = 'komp_card_' + cardId;
                    dojo.removeClass( cardDiv, cardType.class );
                    dojo.addClass( cardDiv, 'komp-card-' + card.type + '-back' );
                }
            }

            console.log('komp_' + color + '_mission_' + currentMission + '_totals');
            // Hide div that countains total counters
            dojo.addClass( 'komp_' + color + '_mission_' + currentMission + '_totals', 'komp-hidden' );
        }
   });             
});
