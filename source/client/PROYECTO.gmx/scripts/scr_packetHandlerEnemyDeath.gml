/// scr_packetHandlerEnemyDeath( dataFromServer );

var uIdToKill = buffer_read( argument0, buffer_string );
var i;

show_debug_message("Enemy DEATH: " + string(uIdToKill));

for( i = 0; i < instance_number(obj_entity); i += 1 ) {
    var enemyEntity = instance_find(obj_entity,i);
    if( enemyEntity.uId == uIdToKill) {
        instance_destroy(enemyEntity);   
    }
}
