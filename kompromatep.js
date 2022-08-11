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
    "dojo","dojo/_base/declare",
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

            // Player slot zones
            this.playerSlots = {};
            this.playerSlots['blue'] = {};
            this.playerSlots['blue'][1] = new ebg.zone();
            this.playerSlots['blue'][2] = new ebg.zone();
            this.playerSlots['blue'][3] = new ebg.zone();
            this.playerSlots['blue'][4] = new ebg.zone();
            this.playerSlots['yellow'] = {};
            this.playerSlots['yellow'][1] = new ebg.zone();
            this.playerSlots['yellow'][2] = new ebg.zone();
            this.playerSlots['yellow'][3] = new ebg.zone();
            this.playerSlots['yellow'][4] = new ebg.zone();
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
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                var playerColor = this.getPlayerColorAsString( player.color );
                
                // Create facedown deck
                for( var i = 0; i <= 4; i++ )
                {
                    dojo.place(
                        this.format_block(
                            'jstpl_player_card_back',
                            {
                                player_id: player_id,
                                color: playerColor,
                                num: i
                            }
                        ),
                        'komp_player_deck_' + playerColor
                    );
                }

                if( gamedatas.card_on_deck[playerColor] )
                {
                    var card = gamedatas.card_on_deck[playerColor];
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
                        'komp_player_deck_' + playerColor
                    );
                    dojo.addClass( 'komp_card_' + card.id, 'komp-card-on-deck')
                }
            }

            // Add more facedown cards to simulate deck size
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

            
            // Set up counterintel and mission slots
            for( var i = 1; i <= 4; i++ )
            {
                // Build counterinter slot. Invert width and height gor horizontal card
                var counterintelSlotDivId = 'komp_counterintel_slot_' + i;
                this.counterintelSlots[i].create( this, counterintelSlotDivId, this.cardHeight, this.cardHeight );

                // Build mission slot
                var missionSlotDivId = 'komp_mission_slot_' + i;
                this.missionSlots[i].create( this, missionSlotDivId, this.cardWidth, this.cardHeight );

                // Build player mission slots
                var blueMissionDivId = 'komp_blue_player_mission_slot_' + i;
                this.playerSlots['blue'][i].create( this, blueMissionDivId, this.cardHeight, this.cardWidth );
                var yellowMissionDivId = 'komp_yellow_player_mission_slot_' + i;
                this.playerSlots['yellow'][i].create( this, yellowMissionDivId, this.cardHeight, this.cardWidth );
            }

            for( var card_id in gamedatas.missions )
            {

                var card = gamedatas.missions[card_id];
                var cardType = this.cardTypes[card.type_arg];

                // Create card on deck
                dojo.place(
                    this.format_block(
                        'jstpl_card',
                        {
                            card_id: card_id,
                            card_class: cardType.class,
                            slot: card.location_arg
                        }
                    ),
                    'komp_mission_deck'
                );

                if( card.type == COUNTERINTELLIGENCE )
                {
                    // Place in counterintel zone
                    this.counterintelSlots[card.location_arg].placeInZone( 'komp_card_' + card.id );
                    dojo.addClass( 'komp_card_' + card.id, 'komp-rotate-right' );
                }
                else
                {
                    // Place in mission zone
                    this.missionSlots[card.location_arg].placeInZone( 'komp_card_' + card_id );
                }
            }

            for( var card_id in gamedatas.player_missions )
            {
                var card = gamedatas.player_missions[card_id];
                var cardType = this.cardTypes[card.type_arg];

                // Create card on deck
                dojo.place(
                    this.format_block(
                        'jstpl_card',
                        {
                            card_id: card_id,
                            card_class: cardType.class,
                            slot: card.type + '_' + card.location_arg
                        }
                    ),
                    'komp_player_deck_' + card.type
                );
                this.playerSlots[card.type][card.location_arg].placeInZone( 'komp_card_' + card_id );
                dojo.addClass( 'komp_card_' + card.id, 'komp-rotate-right' );
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
                        var playerColor = this.getPlayerColor( this.getCurrentPlayerId );
                        for( let slotNumber = 1; slotNumber <= 4; slotNumber++ )
                        {
                            if( this.playerSlots[playerColor][slotNumber].getItemNumber() == 0 )
                            {
                                this.makeElementInteractive( 'komp_mission_slot_' + slotNumber );
                                this.connect( $('komp_mission_slot_' + slotNumber), 'onclick', 'onSelectMission' );
                            }
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

            // Clear temp styles and disconnect handlers
            this.removeAllTemporaryStyles();
            this.disconnectAll();
            
            switch( stateName )
            {
                // case 'playerTurnFirstCard':
                //     for( let slotNumber = 1; slotNumber <= 4; slotNumber++ )
                //     {
                //         dojo.query( '#komp_mission_slot_' + slotNumber ).disconnect
                //     }
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
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
/*               
                 Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
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

        getPlayerColor: function( playerId )
        {
            return dojo.byId('komp_player_area_' + this.getCurrentPlayerId()).attributes.color.value;
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
        //// Player's action
        
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

            // dojo.stopEvent( event );

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
  
            this.triggerPlayerAction( STOP_USING_ITEMS );
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

            dojo.subscribe( 'startMission', this, 'notif_startMission' );
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods

        notif_startMission: function( notif )
        {
            var playerColor = notif.args.color;
            var cardId = notif.args.card_id;
            var missionSlot = notif.args.mission_slot;

            var rotation = 'komp-rotate-';
            if( playerColor == 'blue' )
            {
                rotation += 'right';
            }
            else
            {
                rotation += 'left';
            }

            dojo.removeClass( 'komp_card_' + cardId, 'komp-card-on-deck' );
            dojo.addClass( 'komp_card_' + cardId, rotation );
            dojo.setAttr( 'komp_card_' + cardId, 'slot', playerColor + '_' + cardId );
            this.playerSlots[playerColor][missionSlot].placeInZone( 'komp_card_' + cardId );
        },
   });             
});
