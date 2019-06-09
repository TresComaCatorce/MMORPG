/*
    Proyecto: MMORPGServer
    Fecha: 25/01/2018
    Autor: Cristian Ferrero

    Descripcion:


*/

var zeroBuffer = new Buffer('00', 'hex');

module.exports = packet =
{
    //La variable 'params' es un array de objetos javascript que deben ser
    //convertidos en buffers, y asi poder enviarlo al cliente (GameMaker).
    build: function(params)
    {
        var packetParts = [];
        var packetSize = 0;

        params.forEach(function(param)
        {
            var buffer;

            if( typeof param === 'string' )
            {
                buffer = new Buffer( param, 'utf8');
                buffer = Buffer.concat( [buffer, zeroBuffer] , buffer.length + 1);

            }
            else if( typeof param === 'number' )
            {
                buffer = new Buffer( 2 );
                buffer.writeUInt16LE( param, 0 );//Original
            }
            else
            {
                console.log("WARNING: Unknown data type in packet builder.");
            }

            packetSize += buffer.length;
            packetParts.push( buffer );
        });

        var dataBuffer = Buffer.concat( packetParts, packetSize );

        var size = new Buffer( 1 );
        size.writeUInt8( dataBuffer.length + 1 , 0 );

        //Creacion del packete final. Ej: 4HOLA2ME5LLAMO
        var finalPacket = Buffer.concat( [size, dataBuffer], size.length + dataBuffer.length );

        return finalPacket;
    },

    //Parse de un paquete para ser manejado por el cliente.
    parse: function( cliente, data )
    {
        var idx = 0;
        while( idx < data.length )
        {
            var packetSize = data.readUInt8( idx );
            var extractedPacket = new Buffer( packetSize );
            data.copy( extractedPacket, 0, idx, idx+packetSize );

            this.interpret( cliente, extractedPacket );

            idx += packetSize;
        }
    },

    interpret: function( cliente, datapacket )
    {
        var header = PacketModels.header.parse(datapacket);
        console.log( "Action:", header.command.toUpperCase() );

        switch( header.command.toUpperCase() )
        {
            //--------------------------------
            // Caso de login de un usuario.
            //--------------------------------
            case "LOGIN":
            {
                var data = PacketModels.login.parse( datapacket );
                console.log( "User: " + data.username );

                User.login( data.username, data.password, function( result, user )
                {
                    console.log("Login result:", result);
                    if( result )
                    {
                        cliente.user = user;
                        cliente.enterroom( cliente.user.current_room );
                        cliente.socket.write( packet.build(["LOGIN", "TRUE", cliente.user.current_room, cliente.user.pos_x, cliente.user.pos_y, cliente.user.username]) );
                    }
                    else
                    {
                        cliente.socket.write( packet.build(["LOGIN", "FALSE"]) );
                    }
                });
                break;
            }
            //--------------------------------------
            // Caso de registro de usuario nuevo.
            //--------------------------------------
            case "REGISTER":
            {
                var data = PacketModels.register.parse(datapacket);
                User.register( data.username, data.password, function(result)
                {
                    if(result)
                    {
                        cliente.socket.write( packet.build( ["REGISTER", "TRUE"] ) );
                    }
                    else
                    {
                        cliente.socket.write( packet.build( ["REGISTER", "FALSE"] ) );
                    }
                });
                break;
            }

            //------------------------------------------------------
            // Caso de actualizacion en la posicion de un personaje.
            //------------------------------------------------------
            case "POS_UPDATE":
            {
                //Utilizo el "PacketModel" de update de posicion (definido en <00_packetmodels.js>).
                var data = PacketModels.position_update.parse(datapacket);

                //console.log('X: '+data.new_x); //Valor X de la posicion obtenido del cliente que actualizo.
                //console.log('Y: '+data.new_y); //Valor Y de la posicion obtenido del cliente que actualizo.

                //Se actualizan los valores de la posicion del objeto personaje
                //con los valores recibidos. X e Y.
                cliente.user.pos_x = data.new_x;
                cliente.user.pos_y = data.new_y;

                //Se guardan los datos en la base de datos.
                cliente.user.save();

                //Se le comunica al cliente que debe actualizar en su cliente
                //el dato actualizado por otro cliente.
                cliente.broadcastroom(packet.build(["POS_UPDATE", cliente.user.username, data.new_x, data.new_y, data.direction, data.animation]));

                console.log(data);

                break;
            }
        }
    }
}
