///scr_handlePacket( dataFromServer );

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
    //Conexion con el servidor.
    case "S_HELLO": {
        server_time = buffer_read( argument0 , buffer_string );
        room_goto(rom_login);
        show_debug_message( "Server welcomes you @ " + server_time );
        break;
    }
    
    //Intento de loggeo.
    case "S_LOGIN": {
        scr_packetHandlerLogin( argument0 );
        break;
    }
    
    //---------------------
    // Intento de registro.
    //---------------------
    case "S_REGISTER": {
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
    }
    
    //---------------------
    // Update de posicion.
    //---------------------
    case "S_UPDATE":
    {
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
    }
    
    //-----------------------------------
    //Respuesta a mensaje de chat enviado
    //-----------------------------------
    case "S_CHAT_MSG":
    {
        message_accepted = buffer_read( argument0 , buffer_string );
        message_text = buffer_read( argument0 , buffer_string );
        show_debug_message( "chat: @ " + message_accepted + message_text);
        
        if( message_accepted == "TRUE" )
        {
            //Se utiliza la instancia del objeto "obj_Chat_Msg_Ingame" asociada al player.
            with( global.playerInstance.chatMsgsIngame )
            {
                if( !ds_exists(queueMessages, ds_type_queue) )
                {
                    queueMessages = ds_queue_create();
                }
                
                ds_queue_enqueue( queueMessages, other.message_text );
                
                event_user(0);
            }
            
            //Se utiliza la instancia del objeto "obj_Chat_History".
            with( global.playerInstance.guiManagerInstance.chatHistory )
            {
                //messages
                ds_list_add( messages, global.playerInstance.name + ": " + other.message_text );
            }
        }
        
        break;
    }
    
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










