/// scr_packetHandlerCloseGame( dataFromServer)

message = buffer_read(argument0, buffer_string);

scr_disconnectClient( message );
