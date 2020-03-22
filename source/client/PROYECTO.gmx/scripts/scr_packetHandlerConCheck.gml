/// scr_packetHandlerConCheck( dataFromServer)
show_debug_message("Received 'S_CON_CHECK'");
keyValue = buffer_read(argument0, buffer_string);

Network.lostPackages = 0;
