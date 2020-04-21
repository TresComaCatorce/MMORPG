/*
    Project: MMORPGServer
    Date: 24/01/2019
    Author: Cristian Ferrero

    Definición del formato de los paquetes recibidos desde el cliente.
*/

//Include de BinaryParser.
var Parser = require('binary-parser').Parser;

var StringOptions = { length: 99, zeroTerminated: true };

module.exports = PacketModels =
{
	connection_check: new Parser().skip(1)
		.string( 'command', StringOptions )
		.string( 'key', StringOptions ),

    header: new Parser().skip(1)
        .string( 'command', StringOptions ),

    login: new Parser().skip(1)
        .string( 'command', StringOptions )
        .string( 'input', StringOptions )
        .string( 'password', StringOptions ),

    register: new Parser().skip(1)
		.string( 'command', StringOptions )
		.string( 'email', StringOptions )
        .string( 'username', StringOptions )
        .string( 'password', StringOptions ),

    position_update: new Parser().skip(1)
        .string( 'command', StringOptions )
        .int32le( 'new_x', StringOptions )
        .int32le( 'new_y', StringOptions )
        .int32le( 'direction', StringOptions )
        .string( 'state', StringOptions ),
		//.floatbe()
	
	chat_message: new Parser().skip(1)
		.string( 'command', StringOptions )
		.string( 'pj_name', StringOptions )
		.string( 'message', StringOptions )
		.int32le( 'type', StringOptions ),

	character_connect: new Parser().skip(1)
		.string( 'command', StringOptions )
		.string( 'character_name', StringOptions )
	
}
