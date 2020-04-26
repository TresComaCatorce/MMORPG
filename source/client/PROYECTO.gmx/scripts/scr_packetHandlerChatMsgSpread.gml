/// scr_packetHandlerChatMsgSpread( dataFromServer );

character_name = buffer_read( argument0 , buffer_string );
message_text = buffer_read( argument0 , buffer_string );
message_type = buffer_read( argument0, buffer_u16 );


if( is_string(message_text) && string_length(message_text) > 0 ) {
    with(obj_Network_Player) {
        show_debug_message("CBF net player: " + name + " | other name: " + other.character_name );
        tempMessageText = other.message_text;
        if( name == other.character_name ) {
            with( self.chatMsgsIngame ) {
                /*
                if( !ds_exists(queueMessages, ds_type_queue) ) {
                    queueMessages = ds_queue_create();
                }
                */
                
                ds_queue_enqueue( queueMessages, other.tempMessageText );
                
                event_user(0);
            }
            break;
        }
    }
    
    
    //Se utiliza la instancia del objeto "obj_Chat_History".
    with( obj_player.guiManagerInstance.chatHistory )
    {
        //messages
        ds_list_add( messages, other.character_name + ": " + other.message_text );
    }
}
