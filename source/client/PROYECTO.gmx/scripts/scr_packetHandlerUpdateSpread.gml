/// scr_packetHandlerUpdateSpread( dataFromServer );

character_name = buffer_read( argument0, buffer_string );
target_x = buffer_read( argument0, buffer_u16 );
target_y = buffer_read( argument0, buffer_u16 );
direccion = buffer_read( argument0, buffer_u16 );
animacion = buffer_read( argument0, buffer_u16 );

foundPlayer = -1;

with( obj_networkCharacter ) {
    if( name == other.character_name ) {
        other.foundPlayer = id;
        break;
    }
}

//Si el jugador ya existe en el room
if( foundPlayer != -1 ) {
    with( foundPlayer ) {
        new_x = other.target_x;
        new_y = other.target_y;
        dir = other.direccion;
        state = other.animacion;
    }
}
//Si el jugador NO existe en el room
else {
    with( instance_create( target_x, target_y, obj_networkCharacter) ) {
        name = other.character_name;
        dir = other.direccion;
        state = other.animacion;
    }
}
