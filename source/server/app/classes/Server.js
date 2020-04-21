/*
    Project: MMORPGServer
    Date: 31/03/2020
    Author: Cristian Ferrero

    Description: Server object.

*/

const fs = require('fs');
const colors = require ('colors');
const net = require('net');

const Client = require('./Client');
const WorldClass = require('../classes/World');

module.exports = Server = class Server {

	constructor() {
		this.netServer = undefined;
		this.loadInitializers();
		this.loadModels();

		this.createNetServer();
		this.attachEventsToNetServer();
		this.connectedClients = [];
	}

	loadInitializers() {
		const name = 'initializers'
		const path = `${appRoot}/${name}/`;
		this.loadFromFiles( path, name);
	}

	loadModels() {
		const name = 'models'
		const path = `${appRoot}/${name}/`;
		this.loadFromFiles( path, name);
	}

	loadFromFiles(path, name) {
		const files = fs.readdirSync( path );

		console.log( `\nLoading ${name}...`.bold.cyan);

		files.forEach( file => {
			console.log( (`- ${file}`).magenta );
			require( `${path}${file}`);
		});
	}

	createNetServer() {
		this.netServer = net.createServer();
	}

	attachEventsToNetServer() {
		this.netServer.on( 'connection', this.handleServerConnection );

		this.netServer.on( 'listening', this.handleServerListening );

		this.netServer.on( 'close', this.handleServerClose );

		this.netServer.listen(Config.common.port);
	}

	handleServerConnection(socket) {
		//Informacion de la conexion
		const remoteIpAddress = socket.remoteAddress;
		const remotePort = socket.remotePort.toString();
		const remoteProtocol = socket.remoteFamily;

		console.log( ('Client connected from ip: ' + remoteIpAddress.bold + ' | port: ' + remotePort.bold + ' | protocol: ' + remoteProtocol.bold) );

		// One instance of 'Client' for each person connected to the server.
		const thisClient = new Client({
			socket,
			remoteIpAddress,
			remotePort,
			remoteProtocol
		});

		//--------------------------------------------------------------------------
		// Handler functions
		//--------------------------------------------------------------------------
		// Handle data from remote client.
		socket.on( 'data', thisClient.data.bind(thisClient) );

		// Handle end of connection with the remote client.
		socket.on( 'end', thisClient.end.bind(thisClient) );

		// Handle close of connection with the remote client.
		socket.on( 'close', thisClient.close.bind(thisClient) );

		//
		socket.on( 'drain', thisClient.drain.bind(thisClient) );

		// Handle timeout in connection with the remote client.
		socket.on( 'timeout', thisClient.timeout.bind(thisClient) );

		// Handle error in connection with the remote client.
		socket.on( 'error', thisClient.error.bind(thisClient) );
	}

	handleServerListening() {
		console.log('\nServer running on port: '.bold.green + Config.common.port.bold + '\nEnvironment: '.bold.green + Config.common.environment_description.bold );

	}

	handleServerClose() {
		World.removeAllCharacters();
		clearInterval(persistenceInterval);
		gamedb.close();
		console.log('Server closed.'.bold.red)
	}
};