/// scr_packetHandlerChatMsg( dataFromServer );

message_accepted = buffer_read( argument0 , buffer_bool );
message_text = buffer_read( argument0 , buffer_string );
message_type = buffer_read( argument0, buffer_u16 );

if( isBoolTrue(message_accepted) &&
    is_string(message_text) &&
    string_length(message_text) > 0 )
{
    //Se utiliza la instancia del objeto "obj_Chat_Msg_Ingame" asociada al player.
    with( obj_player.chatMsgsIngame ) {
        /*
        if( !ds_exists(queueMessages, ds_type_queue) ) {
            queueMessages = ds_queue_create();
        }
        */
        
        ds_queue_enqueue( queueMessages, other.message_text );
        
        event_user(0);
    }    
    
    //Se utiliza la instancia del objeto "obj_Chat_History".
    with( obj_player.guiManagerInstance.chatHistory )
    {
        //messages
        ds_list_add( messages, obj_player.name + ": " + other.message_text );
    }
}
