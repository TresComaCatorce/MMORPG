/*
    Proyecto: MMORPGServer
    Fecha: 25/01/2018
    Autor: Cristian Ferrero

    Descripcion:


*/

//Imports de las librerias
let now = require('performance-now');
let _ = require('underscore');

console.log("CBF Client: ", config);

module.exports = function()
{
    let client = this;
    //Estos objetos seran agregados en tiempo de ejecucion de la siguiente manera:
    //this.socket = {...}
    //this.user = {...}

    /**************************************************/
    /**** FUNCIONES DE INICIALIZACION DEL SERVIDOR ****/
    /**************************************************/
    //Handshake con el cliente.
    //Se le envia data al cliente (GameMaker).
    this.initiate = function()
    {
        //Envio del packete de handshake al servidor.
        client.socket.write(packet.build(["HELLO", now().toString()]));

        console.log("Client initialized.");
    }
    /******************************************************/
    /**** FIN FUNCIONES DE INICIALIZACION DEL SERVIDOR ****/
    /******************************************************/



    /*******************************/
    /**** FUNCIONES DEL CLIENTE ****/
    /*******************************/
    this.enterroom = function(selected_room)
    {
        maps[selected_room].clients.forEach( function(otherClient)
        {
            otherClient.socket.write(packet.build(["ENTER", client.user.username, client.user.pos_x, client.user.pos_y]))
        })

        maps[selected_room].clients.push(client);
    }

    // Funcion que envia un update a todos los clientes
    // que se encuentran en el room.
    this.broadcastroom = function( packetData )
    {
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
    //Funcion de "Data handler", comunicacion cliente-servidor.
    this.data = function(data)
    {
        packet.parse( client, data );
    }

    //Funcion que se ejecuta cuando se desconecta un cliente.
    this.end = function()
    {
        console.log( "Client closed:", this.toString() )
    }

    //Funcion de error del cliente.
    this.error = function(err)
    {
        console.log( "Client error:", err.toString() );
    }
    /**** FIN FUNCIONES DE MANEJO DE SOCKETS ****/
    /********************************************/
}
