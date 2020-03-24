/*
    Proyecto: MMORPGServer
    Fecha: 25/01/2019
    Autor: Cristian Ferrero

    Descripcion:


*/

const now = require('performance-now');

module.exports = Client = class Client {

	constructor( _socket ) {
		this.socket = _socket;
		this.id = undefined;
		this.user = undefined;
		this.handshakeServer();
	}


	//Envio del packete de handshake al servidor.
	handshakeServer() {
		//TODO integrity check
		packetManager.sendPacket( this, [
			'S_HELLO',
			now().toString()
		]);
	}


	// Agrega el cliente al room recibido por parametro.
    enterRoom( selected_room ) {
        maps[selected_room].addClientToRoom(this);
	}
	

	// Quita el cliente del room actual.
	exitRoom() {
		if( this.user ) {
        	maps[this.user.current_room].removeClientFromRoom(this);
		}
	}


	// Funcion que envia un mensaje para el propio cliente.
	broadcastSelf( data ) {
		return packetManager.sendPacket( this, data );
	}


	// Funcion que envia un update a todos los clientes
    // que se encuentran en el room.
	broadcastRoom( data ) {
        //Se recorre el array que contiene todos los clientes en ese room.
        //Y se ejecuta la funcion por cada uno de ellos.
        maps[this.user.current_room].clients.forEach( ( otherClient ) => {
            //Si el usuario actual NO es el usuario del array.
            //(No le queremos mandar esta info al mismo cliente)
            if( otherClient.user.username != this.user.username )
            {
				otherClient.broadcastSelf( data );
            };
        })
	}


	// Funcion que envia un update a todos los clientes
	// que se encuentran "cerca" del jugador.
	broadcastNearby() {

	}


	//Callback que maneja los paquetes de datos recibidos.
    data(data) {
        packetManager.parse( this, data );
    }

    //Callback ejecutado cuando se finaliza la conexion con el cliente.
    end() {
        this.exitRoom();
        this.socket.end();
    }

    //Callback ejecutado al cerrar la conexion con el cliente.
    close( data ) {
        let logMsg = data ? "Client closed with transmission error".bgYellow.black : "Client closed correctly";
        this.exitRoom();
        console.log( logMsg );
    }

    //Callback de error en la conexion del cliente.
    error( error ) {
        console.log( "Client error: ".red, error.toString() );
        this.exitRoom();
        this.socket.destroy(error);
    }

    //Callback por timeout con el cliente.
    timeout() {
        console.log( "Socket timed out.".red );
        this.exitRoom();
        this.socket.end();
    }

    //
    drain() {
        console.log('Write buffer is empty now.');
        socket.resume();
    }
};