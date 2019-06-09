/*
    Proyecto: MMORPGServer
    Fecha: 24/01/2018
    Autor: Cristian Ferrero
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
        .int32le( "animation", StringOptions )
        //.floatbe()
}
