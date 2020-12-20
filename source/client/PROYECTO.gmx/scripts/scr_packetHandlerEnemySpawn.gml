/// scr_packetHandlerEnemySpawn( dataFromServer );

var uId = buffer_read( argument0, buffer_string );
var enemyId = buffer_read( argument0 , buffer_string );
var coorX = buffer_read( argument0, buffer_u16 );
var coorY = buffer_read( argument0, buffer_u16 );
var enemyDirection = buffer_read( argument0, buffer_u16 );
var maxHP = buffer_read( argument0, buffer_u16 );

show_debug_message("ENEMY_SPAWNED : " + string(enemyId) + " | X: " + string(coorX) + " Y: " + string(coorY) + " | uId: " + string(uId));

with( instance_create( coorX, coorY, obj_enemy) ) {
    self.uId = uId;
    self.maxHP = maxHP;
}
