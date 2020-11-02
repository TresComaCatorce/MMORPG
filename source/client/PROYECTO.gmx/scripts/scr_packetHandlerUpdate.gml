/// scr_packetHandlerUpdate( dataFromServer )

packetName = "C_UPDATE";
characterDataToSend = ds_list_create();

with( obj_Player ) {
    ds_list_add(    other.characterDataToSend,
                    self.x,
                    self.y,
                    self.dir,
                    self.state);
}

scr_sendPacket( packetName, characterDataToSend );
