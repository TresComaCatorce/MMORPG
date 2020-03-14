/// scr_packetHandlerUpdate( dataFromServer );

username = buffer_read(argument0, buffer_string);
target_x = buffer_read(argument0, buffer_u16);
target_y = buffer_read(argument0, buffer_u16);
direccion = buffer_read(argument0, buffer_u16);
animacion = buffer_read(argument0, buffer_u16);

//string_format(depth,10,2)
//show_debug_message( "POS_UPDATE received " + typeof(username) + ", " + typeof(target_x) + ", " + typeof(target_y) + ", " + typeof(direccion) + ", " + typeof(animacion) );

foundPlayer = -1;


with(obj_Network_Player)
{
    if( name == other.username )
    {
        other.foundPlayer = id;
        break;
    }
}

//Si el jugador ya existe en el room
if( foundPlayer != -1 )
{
    with( foundPlayer )
    {
        new_x = other.target_x;
        new_y = other.target_y;
        dir = other.direccion;
        state = other.animacion;
    }
}
//Si el jugador NO existe en el room
else
{
    with( instance_create( target_x, target_y, obj_Network_Player) )
    {
        name = other.username;
        dir = other.direccion;
        state = other.animacion;
    }
}
