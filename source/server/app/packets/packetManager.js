/*
    Project: MMORPGServer
    Date: 09/06/2019
    Author: Cristian Ferrero

    Description: Administrador de paquetes hexadecimales recibidos/enviados al servidor.

    @function 'build':
    @function 'parse':
    @function 'interpret':
*/
const fs = require('fs');
const zeroBuffer = new Buffer.from('00', 'hex');

module.exports = PacketManager = class PacketManager {

	constructor() {
		this.init()
	}

	// Init the packet manager.
	init() {
		this.#loadIncomingPacketsHandlers();
		this.#loadOutgoingPacketsHandlers();
	}
	
	// Load all the handlers of incoming packets.
	#loadIncomingPacketsHandlers() {
		const handlersFiles = fs.readdirSync(`${__dirname}/incoming`);
		handlersFiles.forEach(handlerFile => {
			require(`${__dirname}/incoming/${handlerFile}`);
		});
	}

	// Load all the handlers of outgoing packets.
	#loadOutgoingPacketsHandlers() {
		const handlersFiles = fs.readdirSync(`${__dirname}/outgoing`);
		handlersFiles.forEach(handlerFile => {
			require(`${__dirname}/outgoing/${handlerFile}`);
		});
	}

	// Send a packet to the client.
	// @param <Socket> 'socket': Socket instance.
	// @param <Array> 'packetData': All data to send.
	sendPacket( socket, packetData ) {
		try {
			const dataToSend = this.#validateOutgoingPacketvalidate(packetData);
			return socket.write( this.build(dataToSend) );
		}
		catch( error ) {
			console.log(error.message.bold.red);
		}
	}

	#validateOutgoingPacketvalidate( packetData ) {

		// pd = packet data
		// ph = packet handler ( from <PACKET_NAME.json> file)
		// Validate packet name
		const runPacketNameValidation = ( pd ) => {
			if( pd[0] != Constants.PACKETS[pd[0]] ) {
				throw( new Error(` ${pd[0]}.js | Error processing packet name.`) );
			}
		};
		// Validate packet length
		const runPacketLengthValidation = ( pd, ph ) => {
			const { checkPacketLength=true } = ph;
			const hasDataTypesToValidate = Utils.isNotEmptyArray(ph.packetDataTypes);
			if( checkPacketLength && hasDataTypesToValidate && (pd.length != ph.packetDataTypes.length) ) {
				throw( new Error(` ${pd[0]}.js | Invalid packet length.`) );
			}
		};
		// Validate packet data type
		const runDataTypeValidation = ( pd, ph ) => {
			const { checkDataTypes=true } = ph;
			const hasDataTypesToValidate = Utils.isNotEmptyArray(ph.packetDataTypes);

			if( checkDataTypes && hasDataTypesToValidate ) {
				for( let i=0 ; i<pd.length ; i++ ) {
					const item = pd[i];
					const itemTypeof = (typeof item);
					if( itemTypeof.toLowerCase() != ph.packetDataTypes[i].name.toLowerCase() ) {
						throw( new Error(` ${pd[0]}.js | Invalid data type '${itemTypeof}' at index: ${i}`) );
					}
				}
			}
		};
		

		if( Utils.isNotEmptyArray(packetData) ) {
			const packetName = packetData[0];
			const packetHandler = global[`packet_${packetName}`];

			( packetName!='S_UPDATE' && packetName!='S_UPDATE_SPREAD' && packetName!='S_CON_CHECK' && packetName!='S_ENEMY_UPDATE' )
			?
				console.log('CBF sendpacket: ', packetData)
			: undefined;

			if( Utils.exist(packetHandler) ) {
				if( !packetHandler.checkDataTypes || Utils.Utils.isNotEmptyArray(packetHandler.packetDataTypes) ) {

					runPacketNameValidation( packetData );
					runPacketLengthValidation( packetData, packetHandler );
					runDataTypeValidation( packetData, packetHandler );

					if( Utils.exist(packetHandler.validate) ) {
						if( (typeof packetHandler.validate == 'function') ) {
							packetHandler.validate( packetData );
						}
						else {
							throw( new Error(` PacketManager.js | Packet handler ${packetName}.js 'validate' attribute must be a function.`) );
						}
					}
				}
				else {
					throw( new Error(` PacketManager.js | Packet handler ${packetName}.js 'packetDataTypes' attribute must be an non-empty array.`) );
				}
			}
			else {
				throw( new Error( ` PacketManager.js | Outgoing packet '${packetName}' not register as 'outgoing' packet.`) );
			}
		}
		else {
			throw( new Error(` PacketManager.js | validateOutgoingPacketvalidate() | Non-valid packet data to send. 'data': ${data}`) );
		}


		return packetData;
	}

	// Build a buffer from a differents type of data.
	// @param <Array> 'params': Array de valores a convertir.
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
	// Luego lo envía a la funcion 'interpret' para que interprete el paquete recibido.
	//
	// @param <Client> 'client': Cliente que envia el paquete.
	// @param <DataStream> 'data': Datos 'raw' recibidos desde el cliente.
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
	// Desde aquí se llama al handler correspondiente ubicado en la carpeta 'handlers'.
	//
	// @param <Client> 'cliente': Cliente que envia el paquete.
	// @param <Buffer> 'datapacket': Buffer de datos recibidos desde el cliente.
	//
	interpret(cliente, datapacket) {
		const header = PacketModels.header.parse(datapacket);
		const command = header.command.toUpperCase();

		const packetHandler = global[`packet_${command}`];

		if( Utils.exist(packetHandler) && packetHandler.hasOwnProperty('process') ) {
			packetHandler.process(cliente, datapacket);
		}
		else {
			throw( new Error( `PacketManager.js | Incoming packet '${command}' not register as 'incoming' packet.`) );
		}
	}
}
