/// scr_packetHandlerChatMsg( dataFromServer );

message_accepted = buffer_read( argument0 , buffer_bool );
message_text = buffer_read( argument0 , buffer_string );

show_debug_message( "chat status | " + string(message_accepted) + " | " + typeof(message_accepted) );
show_debug_message( "chat text | " + string(message_text) + " | " + typeof(message_text) );

if( is_int32(message_accepted) &&
    message_accepted == 1 &&
    is_string(message_text) &&
    string_length(message_text) > 0 )
{
    //Se utiliza la instancia del objeto "obj_Chat_Msg_Ingame" asociada al player.
    with( global.playerInstance.chatMsgsIngame )
    {
        if( !ds_exists(queueMessages, ds_type_queue) )
        {
            queueMessages = ds_queue_create();
        }
        
        ds_queue_enqueue( queueMessages, other.message_text );
        
        event_user(0);
    }
    
    //Se utiliza la instancia del objeto "obj_Chat_History".
    with( global.playerInstance.guiManagerInstance.chatHistory )
    {
        //messages
        ds_list_add( messages, global.playerInstance.name + ": " + other.message_text );
    }
}
