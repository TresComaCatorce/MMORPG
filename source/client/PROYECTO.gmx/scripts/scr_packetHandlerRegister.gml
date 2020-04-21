/// scr_packetHandlerRegister( dataFromServer );

status = buffer_read(argument0, buffer_bool);
if( isBoolTrue(status) )
{
    show_message("Register Success.");
}
else
{
    show_message("Register Failed: Username already taken.");
}
