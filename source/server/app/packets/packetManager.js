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

module.exports = packetManager =
{
	// Inicializa el packet manager.
	// Carga todos los handlers de los paquetes de entrada
	//
	init: function() {	
		const handlersFiles = fs.readdirSync( `${__dirname}/incoming` );
		handlersFiles.forEach( handlerFile => {
			require( `${__dirname}/incoming/${handlerFile}`);
		});
	},



	sendPacket: ( cliente, data ) => {
		return cliente.socket.write( packetManager.build(data) );
	},



	// Construye un buffer a partir de diferentes datos.
	//
	// @param <[Object]> 'params': Array de valores a convertir.
	//
	// @return <Buffer>: Buffer construido a partir de 'params'.
	//
    build: (params) => {
		var packetParts = [];
		var packetSize = 0;
		
        params.forEach(function(param)
        {
            var buffer;

			switch( typeof param ) {
				case 'string': {
					buffer = new Buffer.from( param, 'utf8');
					buffer = Buffer.concat( [buffer, zeroBuffer] , buffer.length + 1);
					break;
				}
				case 'number': {
					buffer = new Buffer.alloc( 2 );
					buffer.writeUInt16LE( param, 0 );//Original
					break;
				}
				case 'boolean': {
					buffer = new Buffer.alloc( 1 );
					buffer.writeIntLE( param, 0, 1 );
					break;
				}
				default: {
					console.warn("WARNING: Unknown data type in packet builder.", params[0], typeof param, param);
					break;
				}
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
	


	// Parsea a Buffer de datos un paquete recibido desde el cliente.
	// Luego lo envía a la funcion "interpret" para que interprete el paquete recibido.
	//
	// @param <Client> 'cliente': Cliente que envia el paquete.
	// @param <DataStream> 'data': Datos "raw" recibidos desde el cliente.
	//
    parse: function( cliente, data ) {
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


	
	// Interpreta los paquetes recibidos desde el cliente.
	// Desde aquí se llama al handler correspondiente ubicado en la carpeta "handlers".
	//
	// @param <Client> 'cliente': Cliente que envia el paquete.
	// @param <Buffer> 'datapacket': Buffer de datos recibidos desde el cliente.
	//
    interpret: function( cliente, datapacket ) {
		var header = PacketModels.header.parse(datapacket);
		var command =  header.command.toUpperCase();

		global[`packet_${command}`].process( cliente, datapacket );
    }
}
