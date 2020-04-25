/// scr_packetHandlerChatMsg( dataFromServer );

message_accepted = buffer_read( argument0 , buffer_bool );
player_name = buffer_read( argument0, buffer_string );
message_text = buffer_read( argument0 , buffer_string );
message_type = buffer_read( argument0, buffer_u16 );

//show_debug_message( "chat status | " + string(message_accepted) + " | " + typeof(message_accepted) );
//show_debug_message( "chat text | " + string(message_text) + " | " + typeof(message_text) );

if( isBoolTrue(message_accepted) &&
    is_string(message_text) &&
    string_length(message_text) > 0 )
{
    //Se utiliza la instancia del objeto "obj_Chat_Msg_Ingame" asociada al player.
    if( player_name == obj_player.name ) {
        with( obj_player.chatMsgsIngame ) {
            if( !ds_exists(queueMessages, ds_type_queue) ) {
                queueMessages = ds_queue_create();
            }
            
            ds_queue_enqueue( queueMessages, other.message_text );
            
            event_user(0);
        }
    }
    else {
        with(obj_Network_Player)
        {
            tempMessageText = other.message_text;
            if( name == other.player_name )
            {
                with( self.chatMsgsIngame ) {
                    if( !ds_exists(queueMessages, ds_type_queue) )
                    {
                        queueMessages = ds_queue_create();
                    }
                    
                    ds_queue_enqueue( queueMessages, other.tempMessageText );
                    
                    event_user(0);
                }
                break;
            }
        }
    }
    
    
    //Se utiliza la instancia del objeto "obj_Chat_History".
    with( obj_player.guiManagerInstance.chatHistory )
    {
        //messages
        ds_list_add( messages, other.player_name + ": " + other.message_text );
    }
}
