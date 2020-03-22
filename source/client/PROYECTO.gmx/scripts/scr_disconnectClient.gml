/// scr_disconnectClient( message )

var message = "Has sido desconectado del servidor.";

if( argument0 ) {
    message = argument0;
}

show_message(message);

game_end();
