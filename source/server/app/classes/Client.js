/*
    Project: MMORPGServer
    Date: 25/01/2019
    Author: Cristian Ferrero

    Description: Client objects represents all connected clients to the server, even the non-autenticated users.

*/

const now = require('performance-now');
const Account = require('./Account');

module.exports = Client = class Client {

	//#region CLASS FIELDS DECLARATION
	#remoteIpAddress;
	#remotePort;
	#remoteProtocol;
	#socket;
	#account;
	//#endregion



	//#region CONSTRUCTOR
	constructor( data ) {

		const { socket, remoteIpAddress, remotePort, remoteProtocol } = data;
		this.#setRemoteIpAddress( remoteIpAddress );
		this.#setRemotePort( remotePort );
		this.#setRemoteProtocol( remoteProtocol );
		this.#setSocket( socket );
		this.#handshakeServer();
	}
	//#endregion



	//#region GETTERS & SETTERS
	
	getRemoteIpAddress() {
		return this.#remoteIpAddress;
	}
	#setRemoteIpAddress( value ) {
		if( Utils.exist(value) ) {
			this.#remoteIpAddress = value;
		}
	}

	getRemotePort() {
		return this.#remotePort;
	}
	#setRemotePort( value ) {
		if( Utils.exist(value) ) {
			this.#remotePort = value;
		}
	}

	getRemoteProtocol() {
		return this.#remoteProtocol;
	}
	#setRemoteProtocol( value ) {
		if( Utils.exist(value) ) {
			this.#remoteProtocol = value;
		}
	}

	getSocket() {
		return this.#socket;
	}
	#setSocket( value ) {
		if( Utils.exist(value) ) {
			this.#socket = value;
		}
	}
	#clearSocket() {
		this.#socket = undefined;
	}

	getAccount() {
		return this.#account;
	}
	#setAccount( value ) {
		if( Utils.exist(value) && value instanceof Account ) {
			this.#account = value;
		}
	}
	#clearAccount() {
		this.#account = undefined;
	}

	//#endregion



	//#region METHODS

	// Indicate if client is logged in with account.
	// @return <bool>
	isLoggedIn() {
		return ( this.getAccount() != undefined );
	}

	//
	loginAccount( accountData ) {
		this.#setAccount( new Account( accountData, this ) );
	}

	loginFail(error) {
		this.broadcastSelf( [Constants.PACKETS.S_LOGIN, false] );
	}

	// Send handshake packet to client.
	#handshakeServer() {
		//TODO integrity check
		PacketManager.sendPacket( this.getSocket(), [
			Constants.PACKETS.S_HELLO,
			now().toString()
		]);
	}

	// Funcion que envia un mensaje para el propio cliente.
	broadcastSelf( data ) {
		return PacketManager.sendPacket( this.getSocket(), data );
	}
	
	// Callback que maneja los paquetes de datos recibidos.
    data(data) {
        PacketManager.parse( this, data );
    }

    // Callback ejecutado cuando se finaliza la conexion con el cliente.
    end() {
		this.getSocket().end();
		this.#closeConnection();
    }

    // Callback ejecutado al cerrar la conexion con el cliente.
    close( data ) {
		const connectionDataString = `from IP: ${this.getRemoteIpAddress()} | Port: ${this.getRemotePort()} | Protocol: ${this.getRemoteProtocol()}`.bold;
		const errorString = `Client closed with transmission error ${connectionDataString}`.bgYellow.black;
		const successString = `Client closed correctly ${connectionDataString}`;

		console.log( data ? errorString : successString );
    }

    // Callback de error en la conexion del cliente.
    error( error ) {
        console.log( 'Client error: '.red, error.toString() );
		this.getSocket().destroy(error);
		this.#closeConnection();
    }

    // Callback por timeout con el cliente.
    timeout() {
        console.log( 'Socket timed out.'.red );
		this.getSocket().end();
		this.#closeConnection();
    }

    //
    drain() {
        console.log('Write buffer is empty now.');
        this.getSocket().resume();
	}

	#closeConnection() {
		this.#closeCharacterOnlineConnection();
		this.getAccount().clearSocket();
		this.#clearAccount();
		this.#clearSocket();
	}

	#closeCharacterOnlineConnection() {
		if( this.getAccount().getCharacterOnline() ) {
			this.getAccount().getCharacterOnline().clearUpdateDaemon();
			this.getAccount().getCharacterOnline().exitRoom();
			this.getAccount().getCharacterOnline().clearSetSocket();
			this.getAccount().clearCharacterOnline();
		}
	}
	
	// Sends a disconnect package to the client.
	#closeGame( message ) {
		const disconnectMessage = message || 'You have been disconnected from the server.';
		this.broadcastSelf( [Constants.PACKETS.S_CLOSE_GAME, disconnectMessage] );
	}
	//#endregion

};