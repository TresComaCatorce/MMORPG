//argument 0: socket.
//argument 1: buffer de datos a enviar.

//Inicializacion
var packetSize = buffer_tell(argument1);
var buffPacket = buffer_create( 1, buffer_grow, 1 );

//Guardo el tamaño y el paquete en el buffer.
buffer_write( buffPacket, buffer_u8, packetSize+1 );
buffer_copy( argument1, 0, packetSize, buffPacket, 1 );
buffer_seek( buffPacket, 0, packetSize+1 );

//Envio del paquete.
network_send_raw( argument0, buffPacket, buffer_tell(buffPacket) );

//Destruccion del buffer para que no ocupe memoria.
buffer_delete( argument1 );
buffer_delete( buffPacket );
