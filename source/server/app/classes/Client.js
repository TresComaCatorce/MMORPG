/*
    Project: MMORPGServer
    Date: 25/01/2019
    Author: Cristian Ferrero

    Description: Client objects represents all connected clients to the server, even the non-autenticated users.

*/

const now = require('performance-now');
const Account = require('./Account');

module.exports = Client = class Client {

	constructor( data ) {

		const { socket, remoteIpAddress, remotePort, remoteProtocol } = data;

		this.remoteIpAddress = remoteIpAddress;
		this.remotePort = remotePort;
		this.remoteProtocol = remoteProtocol;
		this.socket = socket;
		this.account = undefined;
		this.handshakeServer();
	}

	// Indicate if client is logged in with account.
	// @return <bool>
	isLoggedIn() {
		return this.account != undefined;
	}

	//
	loginAccount( accountData ) {
		this.account = new Account( accountData, this );
	}

	loginFail(error) {
		this.broadcastSelf( [Constants.PACKETS.S_LOGIN, false] );
	}

	// Send handshake packet to client.
	handshakeServer() {
		//TODO integrity check
		PacketManager.sendPacket( this.socket, [
			Constants.PACKETS.S_HELLO,
			now().toString()
		]);
	}

	// Funcion que envia un mensaje para el propio cliente.
	broadcastSelf( data ) {
		return PacketManager.sendPacket( this.socket, data );
	}
	
	// Callback que maneja los paquetes de datos recibidos.
    data(data) {
        PacketManager.parse( this, data );
    }

    // Callback ejecutado cuando se finaliza la conexion con el cliente.
    end() {
		this.socket.end();
		this.closeConnection();
    }

    // Callback ejecutado al cerrar la conexion con el cliente.
    close( data ) {
		const connectionDataString = `from IP: ${this.remoteIpAddress} | Port: ${this.remotePort} | Protocol: ${this.remoteProtocol}`.bold;
		const errorString = `Client closed with transmission error ${connectionDataString}`.bgYellow.black;
		const successString = `Client closed correctly ${connectionDataString}`;

		console.log( data ? errorString : successString );
    }

    // Callback de error en la conexion del cliente.
    error( error ) {
        console.log( 'Client error: '.red, error.toString() );
		this.socket.destroy(error);
		this.closeConnection();
    }

    // Callback por timeout con el cliente.
    timeout() {
        console.log( 'Socket timed out.'.red );
		this.socket.end();
		this.closeConnection();
    }

    //
    drain() {
        console.log('Write buffer is empty now.');
        this.socket.resume();
	}

	closeConnection() {
		this.closeCharacterOnlineConnection();
		this.account.socket = undefined;
		this.account = undefined;
		this.socket = undefined;
	}

	closeCharacterOnlineConnection() {
		if( this.account.characterOnline ) {
			this.account.characterOnline.clearUpdateDaemon();
			this.account.characterOnline.exitRoom();
			this.account.characterOnline.socket = undefined;
			this.account.characterOnline = undefined
		}
	}
	
	// Sends a disconnect package to the client.
	closeGame( message ) {
		const disconnectMessage = message || 'You have been disconnected from the server.';
		this.broadcastSelf( [Constants.PACKETS.S_CLOSE_GAME, disconnectMessage] );
	}
};