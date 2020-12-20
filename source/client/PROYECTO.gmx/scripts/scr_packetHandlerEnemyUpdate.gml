/// scr_packetHandlerEnemyUpdate( dataFromServer );

var uuId = buffer_read(argument0, buffer_string);
var enemyId = buffer_read(argument0, buffer_string);
var posX = buffer_read(argument0, buffer_u16);
var posY = buffer_read(argument0, buffer_u16);
var direccion = buffer_read(argument0, buffer_u16);
var state = buffer_read(argument0, buffer_string);
var currentHP = buffer_read(argument0, buffer_u16);
var maxHP = buffer_read(argument0, buffer_u16);
var i;

//show_debug_message("S_ENEMY_UPDATE: " + string(uuId) + " enemyId: " + string(enemyId) + " x: " + string(posX) + " Y: " + string(posY) + " Direccion: " + string(direccion) + " State: " + string(state) + " CurrentHP: " + string(currentHP) + " MaxHP: " + string(maxHP) + " instance_number(obj_entity): " + string(instance_number(obj_entity)) );
                    
for( i = 0; i < instance_number(obj_entity); i += 1 ) {
    var enemyInstance = instance_find(obj_entity,i);
    if( enemyInstance.uId == uuId) {
        //show_debug_message("Existe enemigo");
        //Acá hay que actualizar la instancia o si no existe crearla.
    }
    else {
        //show_debug_message("No existe enemigo");
        
    }
}
