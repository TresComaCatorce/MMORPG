/// scr_disconnectClient( message )

var message = "You have been disconnected from the server.";

if( argument0 ) {
    message = argument0;
}

show_message(message);

scr_gameEnd();
