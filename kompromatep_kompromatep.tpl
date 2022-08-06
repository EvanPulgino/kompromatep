{OVERALL_GAME_HEADER}

<!-- 
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- KompromatEP implementation : © Evan Pulgino <evan.pulgino@gmail.com>
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------

    kompromatep_kompromatep.tpl
-->


<div id="komp_layout">
    <!-- BEGIN playerarea -->
    <div id="komp_player_area_{PLAYER_ID}" class="komp-player-area" style="background-color: #{PLAYER_COLOR}95; order: {ORDER}">
        <div id="komp_player_deck_{PLAYER_ID}">{PLAYER_NAME}'s Deck</div>
    </div>
    <!-- END playerarea -->

    <div id="komp_mission_area">
        <!-- BEGIN playermission -->
        <div id="komp_player_mission_column_{PLAYER_ID}" class="komp-mission-column" style="order: {ORDER}">
            <div id="komp_player_mission_empty_cell_{PLAYER_ID}" class="komp-mission-column-element"></div>
            <!-- BEGIN playermissionslot -->
            <div id="komp_player_mission_slot_{SLOT_NUMBER}_{PLAYER_ID}" class="komp-mission-column-element">{PLAYER_NAME} SLOT #{SLOT_NUMBER}</div>
            <!-- END playermissionslot -->
        </div>
        <!-- END playermission -->

        <div id="komp_mission_column" class="komp-mission-column">
            <div id="komp_mission_deck" class="komp-mission-column-element">Mission Deck</div>
            <!-- BEGIN missionslot -->
            <div id="komp_mission_slot_{SLOT_NUMBER}" class="komp-mission-column-element">Mission #{SLOT_NUMBER}</div>
            <!-- END missionslot -->
        </div>
        
    </div>
</div>


<script type="text/javascript">

// Javascript HTML templates

/*
// Example:
var jstpl_some_game_item='<div class="my_game_item" id="my_game_item_${MY_ITEM_ID}"></div>';

*/

</script>  

{OVERALL_GAME_FOOTER}
