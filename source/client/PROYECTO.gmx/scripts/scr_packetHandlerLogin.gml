///scr_packetHandlerLogin( dataFromServer );

status = buffer_read(argument0, buffer_bool);

//Si el loggeo fue exitoso.
if( is_int32(status) &&
    status == 1 )
{
    //Lectura de datos que devuelve el servidor
    clientId = buffer_read(argument0, buffer_string); //ID Unico del cliente
    target_room = buffer_read(argument0, buffer_string); //Room donde se va a introducir el personaje.
    target_x = buffer_read(argument0, buffer_u16); //Posicion X del personaje en el mapa.
    target_y = buffer_read(argument0, buffer_u16); //Posicion Y del personaje en el mapa.
    name = buffer_read(argument0, buffer_string); //Nombre del personaje.
    
    //Se mueve al room correspondiente.
    room_togo = asset_get_index(target_room);
    room_goto(room_togo);
    
    //Se crea una instancia del "obj_Player" en el room.
    //TODO Agregar los atributos provenientes del servidor.
    global.playerInstance = instance_create( target_x, target_y, obj_Player );
    with( global.playerInstance )
    {
        clientId = other.clientId;
        name = other.name;
    }
}
//Si el loggeo fue erroneo.
else
{
    show_message("Login Failed: Username or password incorrect.");
}
