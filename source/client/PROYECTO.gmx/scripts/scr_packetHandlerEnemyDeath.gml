/// scr_packetHandlerEnemyDeath( dataFromServer );

var uIdToKill = buffer_read( argument0, buffer_u16 );
var i;

for( i = 0; i < instance_number(obj_spider); i += 1 ) {
    var spiderInstance = instance_find(obj_spider,i);
    if( spiderInstance.uId == uIdToKill) {
        instance_destroy(spiderInstance);   
    }
}
