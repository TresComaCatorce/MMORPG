/*
    Proyecto: MMORPGServer
    Fecha: 25/01/2019
    Autor: Cristian Ferrero

    Descripcion:


*/

//Imports de las librerias
let now = require('performance-now');
let _ = require('underscore');

module.exports = function() {
    let client = this;
    let socket;
    let id;

    //Inicializacion del cliente
    // @param "socket": Socket asignado al cliente, se utiliza para enviarle informacion al cliente.
    client.initiate = (socket) => {
        client.socket = socket;

        //Envio del packete de handshake al servidor. //TODO
        client.socket.write(packet.build(["S_HELLO", now().toString()]));
    }


    /*******************************/
    /**** FUNCIONES DEL CLIENTE ****/
    /*******************************/
    //Agrega el cliente al room recibido por parametro.
    client.enterRoom = (selected_room) => {
        maps[selected_room].addClientToRoom(client);
    }

    //Quita el cliente del room actual.
    client.exitRoom = () => {
        maps[client.user.current_room].removeClientFromRoom(client);
    }

    // Funcion que envia un update a todos los clientes
    // que se encuentran en el room.
    client.broadcastRoom = ( username, new_x, new_y, direction, state ) => {

        let packetData = packet.build(["S_UPDATE", username, new_x, new_y, direction, state]);

        //Se recorre el array que contiene todos los clientes en ese room.
        //Y se ejecuta la funcion por cada uno de ellos.
        maps[client.user.current_room].clients.forEach(function( otherClient )
        {
            //Si el usuario actual NO es el usuario del array.
            //(No le queremos mandar esta info al mismo cliente, el produjo el cambio,
            //por lo tanto no debe ser updateado del mismo)
            if( otherClient.user.username != client.user.username )
            {
                otherClient.socket.write( packetData ); //Se manda la info con el update.
            };
        })
    }
    /**** FIN FUNCIONES DEL CLIENTE ****/
    /***********************************/



    /****************************************/
    /**** FUNCIONES DE MANEJO DE SOCKETS ****/
    /****************************************/
    //Callback que maneja los paquetes de datos recibidos.
    client.data = (data) => {
        packet.parse( client, data );
    }

    //Callback ejecutado cuando se finaliza la conexion con el cliente.
    client.end = () => {
        client.exitRoom();
        client.socket.end();
    }

    //Callback ejecutado al cerrar la conexion con el cliente.
    client.close = (data) => {
        let logMsg = data ? "Client closed with transmission error".bgYellow.black : "Client closed correctly".bgWhite.black;
        client.exitRoom();
        console.log( logMsg );
    }

    //Callback de error en la conexion del cliente.
    client.error = (error) => {
        console.log( "Client error: ".red, error.toString() );
        client.exitRoom();
        client.socket.destroy(error);
    }

    //Callback por timeout con el cliente.
    client.timeout = () => {
        console.log( "Socket timed out.".red );
        client.exitRoom();
        client.socket.end();
    }

    //
    client.drain = () => {
        console.log('Write buffer is empty now.');
        socket.resume();
    }
    /**** FIN FUNCIONES DE MANEJO DE SOCKETS ****/
    /********************************************/
}
