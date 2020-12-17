/// scr_packetHandlerChatMsg( dataFromServer );

message_accepted = buffer_read( argument0 , buffer_bool );
message_text = buffer_read( argument0 , buffer_string );
message_type = buffer_read( argument0, buffer_u16 );

if( isBoolTrue(message_accepted) &&
    is_string(message_text) &&
    string_length(message_text) > 0 )
{
    //Se utiliza la instancia del objeto "obj_Chat_Msg_Ingame" asociada al player.
    ds_queue_enqueue( global.playerOnline.chatMsgsIngame.queueMessages, other.message_text );
    with( global.playerOnline.chatMsgsIngame ) {
        event_user(0);
    }
    
    //Se utiliza la instancia del objeto "obj_Chat_History".
    ds_list_add(
        global.playerOnline.guiManagerInstance.chatHistory.messages,
        global.playerOnline.name + ": " + other.message_text
    );
}
