/// scr_packetHandlerChatMsg( dataFromServer );

message_accepted = buffer_read( argument0 , buffer_string );
message_text = buffer_read( argument0 , buffer_string );
show_debug_message( "chat: @ " + message_accepted + message_text);

if( message_accepted == "TRUE" )
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
