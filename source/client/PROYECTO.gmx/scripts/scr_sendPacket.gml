/// scr_sendPacket( packetName, attributes );

var action = argument0;
var attributes = argument1;

//Se crea el buffer a enviar
var packetToSend = buffer_create( 1, buffer_grow, 1 );

//Se escribe el header (accion para identificar en el servidor) en el buffer a enviar.
//Un string indicando la accion informada.
buffer_write( packetToSend, buffer_string, action );

//Se recorre la lista de atributos a enviar
for( var i=0 ; i<ds_list_size(attributes); i++ ) {
    var att = ds_list_find_value( attributes, i );
    
    if( is_string(att) ) {
        show_debug_message( "String Att: " + att )
        buffer_write( packetToSend, buffer_string, att );
    }
    else if( is_real(att) ) {
        show_debug_message( "Real Att: " + string(att) )
        buffer_write( packetToSend, buffer_s32, att);
    }
}

//Se escribe el socket creado en el "Network.socket" para que lo maneje y envie al servidor.
scr_networkWrite( Network.socket, packetToSend );
