/*
    Proyecto: MMORPGServer
    Fecha: 09/06/2019
    Autor: Cristian Ferrero

    Descripcion: Administrador de paquetes hexadecimales recibidos/enviados al servidor.

    @function "build":
    @function "parse":
    @function "interpret":
*/

var zeroBuffer = new Buffer.from('00', 'hex');

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
                buffer = new Buffer.from( param, 'utf8');
                buffer = Buffer.concat( [buffer, zeroBuffer] , buffer.length + 1);
            }
            else if( typeof param === 'number' )
            {
                buffer = new Buffer.alloc( 2 );
                buffer.writeUInt16LE( param, 0 );//Original
            }
            else
            {
                console.log("WARNING: Unknown data type in packet builder.", params[0], typeof param, param);
            }

            packetSize += buffer.length;
            packetParts.push( buffer );
        });

        var dataBuffer = Buffer.concat( packetParts, packetSize );

        var size = new Buffer.alloc( 1 );
        size.writeUInt8( dataBuffer.length + 1 , 0 );

        //Creacion del packete final. Ej: 4HOLA2ME5LLAMO
        var finalPacket = Buffer.concat( [size, dataBuffer], size.length + dataBuffer.length );

        return finalPacket;
    },

    // Parse de un paquete recibido desde el cliente.
    parse: function( cliente, data )
    {
        let idx = 0;
        while( idx < data.length )
        {
            let packetSize = data.readUInt8( idx );
            let extractedPacket = new Buffer.alloc( packetSize );
            data.copy( extractedPacket, 0, idx, idx+packetSize );

            this.interpret( cliente, extractedPacket );

            idx += packetSize;
        }
    },

    // Interprete de los paquetes recibidos desde el cliente.
    interpret: function( cliente, datapacket )
    {
        var header = PacketModels.header.parse(datapacket);

        //console.log( "Action:", header.command.toUpperCase() );

        switch( header.command.toUpperCase() )
        {
            //--------------------------------
            // Paquete de login recibido
            //--------------------------------
            case "C_LOGIN":
            {
                //Se leen los datos enviados.
                var data = PacketModels.login.parse( datapacket );

                //Se busca el usuario en la DB.
                User.login( data.username, data.password, function( result, user )
                {
                    let is_kernel_buffer_full;

                    //Si los datos de login son correctos.
                    if( result )
                    {
                        //Se guarda el objecto user en el cliente (se utiliza para persistir los datos).
                        cliente.user = user;

                        //Se guarda el ID del user en la DB dentro del cliente.
                        cliente.id = user._id.toString();

                        //Ingresa al room correspondiente.
                        cliente.enterRoom( cliente.user.current_room );

                        //Informa el ingreso a los demas clientes.
                        cliente.broadcastRoom( cliente.user.username, cliente.user.pos_x, cliente.user.pos_y, 0, 0 ) //direccion y status = 0

                        is_kernel_buffer_full = cliente.socket.write( packet.build(["S_LOGIN", "TRUE", cliente.id, cliente.user.current_room, cliente.user.pos_x, cliente.user.pos_y, cliente.user.username]) );
                    }
                    else //Si los datos de login son incorrectos.
                    {
                        is_kernel_buffer_full = cliente.socket.write( packet.build(["S_LOGIN", "FALSE"]) );
                    }

                    if(!is_kernel_buffer_full)
                    {
                        socket.pause();
                    }
                });
                break;
            }
            //--------------------------------------
            // Caso de registro de usuario nuevo.
            //--------------------------------------
            case "C_REGISTER":
            {
                var data = PacketModels.register.parse(datapacket);
                User.register( data.username, data.password, function(result)
                {
                    if(result)
                    {
                        cliente.socket.write( packet.build( ["S_REGISTER", "TRUE"] ) );
                    }
                    else
                    {
                        cliente.socket.write( packet.build( ["S_REGISTER", "FALSE"] ) );
                    }
                });
                break;
            }

            //------------------------------------------------------
            // Caso de actualizacion en la posicion de un personaje.
            //------------------------------------------------------
            case "C_UPDATE":
            {
                //Utilizo el "PacketModel" de update de posicion (definido en <01_packetmodels.js>).
                var data = PacketModels.position_update.parse(datapacket);

                //TODO Checkear que las nuevas coordenadas no sean incoherentes.

                //Se actualizan los valores de la posicion del objeto personaje
                //con los valores recibidos. X e Y.
                cliente.user.pos_x = data.new_x;
                cliente.user.pos_y = data.new_y;

                //Se guardan los datos en la base de datos.
                cliente.user.save();

                //Se le comunica al cliente que debe actualizar en su cliente
                //el dato actualizado por otro cliente.
                cliente.broadcastRoom( cliente.user.username, data.new_x, data.new_y, data.direction, data.state );

                break;
			}
			
			//------------------------------------------------------
            // Caso de actualizacion en la posicion de un personaje.
            //------------------------------------------------------
            case "C_CHAT_MSG":
            {
                //Utilizo el "PacketModel" de update de posicion (definido en <01_packetmodels.js>).
				var data = PacketModels.chat_message.parse(datapacket);
				
				//Se envia la respuesta al cliente
				var packetToSend = packet.build( ["S_CHAT_MSG", "TRUE", data.message] );
				cliente.broadcastSelf(packetToSend);

                break;
			}
        }
    }
}
