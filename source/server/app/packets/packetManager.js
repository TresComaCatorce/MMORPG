/*
    Project: MMORPGServer
    Date: 09/06/2019
    Author: Cristian Ferrero

    Description: Administrador de paquetes hexadecimales recibidos/enviados al servidor.

    @function "build":
    @function "parse":
    @function "interpret":
*/
const fs = require('fs');
const zeroBuffer = new Buffer.from('00', 'hex');

module.exports = PacketManager = class PacketManager {

	constructor() {
		this.init()
	}

	// Init the packet manager.
	// Load all the handlers of incoming packages.
	init() {
		const handlersFiles = fs.readdirSync(`${__dirname}/incoming`);
		handlersFiles.forEach(handlerFile => {
			require(`${__dirname}/incoming/${handlerFile}`);
		});
	}

	// Send a packet to the client.
	// @param <Socket> 'socket': Socket instance.
	// @param <[]> 'data': All data to send.
	sendPacket( socket, data ) {
		console.log("CBF sendpacket: ", data);
		return socket.write( this.build(data) );
	}

	// Build a buffer from a differents type of data.
	// @param <[]> 'params': Array de valores a convertir.
	// @return <Buffer>: Buffer construido a partir de 'params'.
	build( params ) {
		const packetParts = [];
		let packetSize = 0;

		params.forEach(function (param) {
			var buffer;

			switch (typeof param) {
				case 'string': {
					buffer = new Buffer.from(param, 'utf8');
					buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
					break;
				}
				case 'number': {
					buffer = new Buffer.alloc(2);
					buffer.writeUInt16LE(param, 0);//Original
					break;
				}
				case 'boolean': {
					buffer = new Buffer.alloc(1);
					buffer.writeIntLE(param, 0, 1);
					break;
				}
				default: {
					console.warn( `WARNING: Unknown data type in packet builder. \nPacket: ${params[0]} \nType: ${typeof param} \nValue: ${param}`);
					break;
				}
			}

			packetSize += buffer.length;
			packetParts.push(buffer);
		});

		const dataBuffer = Buffer.concat(packetParts, packetSize);

		const size = new Buffer.alloc(1);
		size.writeUInt8(dataBuffer.length + 1, 0);

		//Creacion del packete final. Ej: 4HOLA2ME5LLAMO
		const finalPacket = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);

		return finalPacket;
	}



	// Parsea a Buffer de datos un paquete recibido desde el cliente.
	// Luego lo envía a la funcion "interpret" para que interprete el paquete recibido.
	//
	// @param <Client> 'client': Cliente que envia el paquete.
	// @param <DataStream> 'data': Datos "raw" recibidos desde el cliente.
	//
	parse( client, data ) {
		let idx = 0;
		while (idx < data.length) {
			const packetSize = data.readUInt8(idx);
			const extractedPacket = new Buffer.alloc(packetSize);
			data.copy(extractedPacket, 0, idx, idx + packetSize);

			this.interpret(client, extractedPacket);

			idx += packetSize;
		}
	}



	// Interpreta los paquetes recibidos desde el cliente.
	// Desde aquí se llama al handler correspondiente ubicado en la carpeta "handlers".
	//
	// @param <Client> 'cliente': Cliente que envia el paquete.
	// @param <Buffer> 'datapacket': Buffer de datos recibidos desde el cliente.
	//
	interpret(cliente, datapacket) {
		var header = PacketModels.header.parse(datapacket);
		var command = header.command.toUpperCase();

		global[`packet_${command}`].process(cliente, datapacket);
	}
}
