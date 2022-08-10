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
    <div id="komp_player_area_{PLAYER_ID}" class="komp-column-slot" style="order: {ORDER}">
        <div id="komp_player_deck_{PLAYER_ID}" class="komp-player-deck"></div>
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
            <div id="komp_mission_deck" class="komp-column-slot">
            </div>
            <!-- BEGIN missionslot -->
            <div id="komp_mission_column_slot_{SLOT_NUMBER}" class="komp-column-slot">
                <div id="komp_counterintel_slot_{SLOT_NUMBER}" class="komp-mission-column-card komp-counterintel-slot"></div>
                <div id="komp_mission_slot_{SLOT_NUMBER}" class="komp_mission-column_card komp-mission-slot"></div>
            </div>
            <!-- END missionslot -->
        </div>
    </div>
</div>


<script type="text/javascript">

    var jstpl_card = '<div id="komp_card_${card_id}" class="komp-card ${card_class}"></div>';
    var jstpl_player_card_back = '<div id="komp_player_card_back_${num}_${player_id}" style="bottom: ${num}%" class="komp-card komp-card-${color}-back komp-stack"></div>';
    var jstpl_mission_card_back = '<div id="komp_mission_card_back_${num}" style="bottom: ${num}%" class="komp-card komp-card-mission-back komp-mission-slot komp-stack"></div>'

</script>  

{OVERALL_GAME_FOOTER}
