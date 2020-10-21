///scr_packetHandlerLoginFailure( dataFromServer );

serverMessage = buffer_read(argument0, buffer_string);

if( !is_string(serverMessage) ) {
    serverMessage = 'Login server error.';
}
show_message( serverMessage );
