/// scr_packetHandlerRegister( dataFromServer );

status = buffer_read(argument0, buffer_bool);
if( is_int32(status) &&
    status == 1 )
{
    show_message("Register Success.");
}
else
{
    show_message("Register Failed: Username already taken.");
}
