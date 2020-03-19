/*
    Proyecto: MMORPGServer
    Fecha: 24/01/2019
    Autor: Cristian Ferrero

    Definición del formato de los paquetes recibidos desde el cliente.
*/

//Include de BinaryParser.
var Parser = require('binary-parser').Parser;

var StringOptions = { length: 99, zeroTerminated: true };

module.exports = PacketModels =
{
    header: new Parser().skip(1)
        .string( "command", StringOptions),

    login: new Parser().skip(1)
        .string( "command", StringOptions )
        .string( "username", StringOptions )
        .string( "password", StringOptions ),

    register: new Parser().skip(1)
        .string( "command", StringOptions )
        .string( "username", StringOptions )
        .string( "password", StringOptions ),

    position_update: new Parser().skip(1)
        .string( "command", StringOptions )
        .int32le( "new_x", StringOptions )
        .int32le( "new_y", StringOptions )
        .int32le( "direction", StringOptions )
        .string( "state", StringOptions ),
		//.floatbe()
	
	chat_message: new Parser().skip(1)
		.string( "command", StringOptions)
		.string( "pj_name", StringOptions)
		.string( "message", StringOptions)
}
