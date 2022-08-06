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
    "ebg/counter"
],
function (dojo, declare) {
    return declare("bgagame.kompromatep", ebg.core.gamegui, {
        constructor: function(){
            console.log('kompromatep constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

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

            // Import constants from PHP
            this.defineGlobalConstants( gamedatas.constants );
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed
            }
            
            // TODO: Set up your game interface here, according to "gamedatas"
            
 
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
                        for( let slotNumber = 1; slotNumber <= 4; slotNumber++ )
                        {
                            this.makeElementInteractive( 'komp_mission_slot_' + slotNumber );
                            dojo.query( '#komp_mission_slot_' + slotNumber ).connect( 'onclick', this, 'onSelectMission' );
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
            dojo.query('.komp-clickable').removeClass('komp-clicable');
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
 
            // dojo.stopEvent( event );
 
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

            var cardId = 1; // Get from event later
            var missionSlot = event.target.id.split("_")[3];

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
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
