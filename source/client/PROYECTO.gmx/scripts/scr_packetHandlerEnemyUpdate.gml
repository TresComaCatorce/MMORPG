/// scr_packetHandlerEnemyUpdate( dataFromServer );

var uId = buffer_read(argument0, buffer_string);
var enemyId = buffer_read(argument0, buffer_string);
var coorX = buffer_read(argument0, buffer_u16);
var coorY = buffer_read(argument0, buffer_u16);
var direccion = buffer_read(argument0, buffer_u16);
var state = buffer_read(argument0, buffer_string);
var currentHP = buffer_read(argument0, buffer_u16);
var maxHP = buffer_read(argument0, buffer_u16);
var i;

//show_debug_message("S_ENEMY_UPDATE: " + string(uId) + " enemyId: " + string(enemyId) + " x: " + string(coorX) + " Y: " + string(coorY) + " Direccion: " + string(direccion) + " State: " + string(state) + " CurrentHP: " + string(currentHP) + " MaxHP: " + string(maxHP) + " instance_number(obj_entity): " + string(instance_number(obj_entity)) );
    
var enemyInstance = noone;
                
for( i = 0; i < instance_number(obj_entity); i += 1 ) {
    enemyInstance = instance_find(obj_entity,i);
    if( enemyInstance.uId == uId) {
        break;
    }
}

if( enemyInstance.uId == uId) {
    //show_debug_message("Existe enemigo | Se BUSCA: " + string(uId));
    enemyInstance.x = coorX;
    enemyInstance.y = coorY;
    enemyInstance.direction = direccion;
    enemyInstance.currentHP = currentHP;
    enemyInstance.maxHP = maxHP;
}
else {
    show_debug_message("No existe enemigo | Se CREA: " + string(uId));
    var enemyInstance = instance_create( coorX, coorY, obj_enemy);
    enemyInstance.uId = uId;
    enemyInstance.maxHP = maxHP;
}
