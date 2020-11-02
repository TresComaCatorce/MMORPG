/// scr_packetHandlerEnemySpawn( dataFromServer );

var uId = buffer_read( argument0, buffer_u16 );
var enemyId = buffer_read( argument0 , buffer_string );
var coorX = buffer_read( argument0, buffer_u16 );
var coorY = buffer_read( argument0, buffer_u16 );
var enemyDirection = buffer_read( argument0, buffer_u16 );
var maxHP = buffer_read( argument0, buffer_u16 );

switch(enemyId) {
    case "SPIDER":
        with( instance_create( coorX, coorY, obj_spider) ) {
            self.uId = uId;
            self.maxHP = maxHP;
        }
        break;
}
