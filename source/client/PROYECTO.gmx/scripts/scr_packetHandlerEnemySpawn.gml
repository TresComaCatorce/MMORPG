/// scr_packetHandlerEnemySpawn( dataFromServer );

uId = buffer_read( argument0, buffer_u16 );
enemyId = buffer_read( argument0 , buffer_string );
coorX = buffer_read( argument0, buffer_u16 );
coorY = buffer_read( argument0, buffer_u16 );
enemyDirection = buffer_read( argument0, buffer_u16 );
maxHP = buffer_read( argument0, buffer_u16 );

show_debug_message("S_ENEMY_SPAWN | "+enemyId+" | "+string(coorX)+" | "+string(coorY)+" | "+string(enemyDirection)+" | "+string(maxHP));

switch(enemyId) {
    case "SPIDER":
        with( instance_create( coorX, coorY, obj_spider) ) {
            self.uId = uId;
            self.maxHP = maxHP;
        }
        break;
}
