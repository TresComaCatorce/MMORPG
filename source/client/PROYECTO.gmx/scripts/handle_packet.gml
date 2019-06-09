//---------------------------------------------------------------
// Aqui se manejan los paquetes que se reciben desde el servidor.
//---------------------------------------------------------------
// @param "argument0": Datos recibidos desde el servidor.
//---------------------------------------------------------------

//Se lee el buffer de datos.
var command = buffer_read( argument0 , buffer_string );

//Se muestra el evento recibido por consola.
//show_debug_message("Networking event: " + string(command));

//Se evalua y se decide que hacer con el paquete recibido.
switch(command)
{
    //-------------------------
    //Conexion con el servidor.
    //-------------------------
    case "HELLO":
        server_time = buffer_read( argument0 , buffer_string );
        room_goto(rom_login);
        show_debug_message( "Server welcomes you @ " + server_time );
        break;
    //-------------------
    //Intento de loggeo.
    //-------------------
    case "LOGIN":
        status = buffer_read(argument0, buffer_string);
        //Si el loggeo fue exitoso.
        if( status == "TRUE" )
        {
            //Room donde se va a introducir el personaje.
            target_room = buffer_read(argument0, buffer_string);
            
            //Posicion X e Y del personaje en el mapa.
            target_x = buffer_read(argument0, buffer_u16);
            target_y = buffer_read(argument0, buffer_u16);
            name = buffer_read(argument0, buffer_string);
            
            //Se mueve al room correspondiente.
            room_togo = asset_get_index(target_room);
            room_goto(room_togo);
            
            //Se crea una instancia del jugador en el room
            //Proximamente con los atributos provenientes del servidor.
            with( instance_create( target_x, target_y, obj_Player) )
            {
                //show_message( x);
                name = other.name;
            }
        }
        //Si el loggeo fue erroneo.
        else
        {
            show_message("Login Failed: Username or password incorrect.");
        }
        break;
    
    //---------------------
    // Intento de registro.
    //---------------------
    case "REGISTER":
        status = buffer_read(argument0, buffer_string);
        if( status == "TRUE" )
        {
            show_message("Register Success.");
        }
        else
        {
            show_message("Register Failed: Username already taken.");
        }
        break;
        
    //---------------------
    // Update de posicion.
    //---------------------
    case "POS_UPDATE":
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
        break;
    
    /*case "CREATE_ENEMY":
        type = buffer_read(argument0, buffer_string);
        target_room = buffer_read(argument0, buffer_string);
        target_x = buffer_read(argument0, buffer_u16);
        target_y = buffer_read(argument0, buffer_u16);
        direccion = buffer_read(argument0, buffer_u16);
        
        //Se mueve al room correspondiente.
        
        with( instance_create( target_x, target_y, obj_spider) )
        {
            name = other.name;
        }
        
        break;*/
}










