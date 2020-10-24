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
        scr_packetHandlerHello( argument0 );
        break;
    }
    
    case "S_CLOSE_GAME": {
        scr_packetHandlerCloseGame( argument0 );
        break;
    }
    
    case "S_CON_CHECK": {
        scr_packetHandlerConCheck( argument0 );
        break;
    }
    
    // Login exitoso
    case "S_LOGIN_SUCCESS": {
        scr_packetHandlerLoginSuccess( argument0 );
        break;
    }
    
    case "S_LOGIN_FAILURE": {
        scr_packetHandlerLoginFailure( argument0 );
        break;
    }
    
    // Intento de registro.
    case "S_REGISTER": {
        scr_packetHandlerRegister( argument0 );
        break;
    }
    
    // Update de posicion.
    case "S_UPDATE": {
        scr_packetHandlerUpdate( argument0 );
        break;
    }
    
    case "S_UPDATE_SPREAD": {
        scr_packetHandlerUpdateSpread( argument0 );
        break;
    }
    
    case "S_CHAT_MSG": {
        scr_packetHandlerChatMsg( argument0 );
        break;
    }
    
    case "S_CHAT_MSG_SPREAD": {
        scr_packetHandlerChatMsgSpread( argument0 );
        break;
    }
    
    case "S_CHARACTER_CONNECT": {
        scr_packetHandlerCharacterConnect( argument0 );
        break;
    }
    
    case "S_ENEMY_SPAWN": {
        scr_packetHandlerEnemySpawn( argument0 );
        break;
    }
}










