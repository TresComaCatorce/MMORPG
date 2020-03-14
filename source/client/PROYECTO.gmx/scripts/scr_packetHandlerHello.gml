/// scr_packetHandlerHello( dataFromServer );

server_time = buffer_read( argument0 , buffer_string );
room_goto(rom_login);
show_debug_message( "Server welcomes you @ " + server_time );
