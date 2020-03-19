/*
    Proyecto: MMORPGServer
    Fecha: 09/06/2019
    Autor: Cristian Ferrero
*/

var fs = require('fs'); //File system library.

//Objeto global que contiene la informacion de los mapas.
let objMaps = {};

//Archivos de mapa
let maps_files = fs.readdirSync( config.common.data_paths.maps );

//Por cada uno de los inicializadores del directorio de los mapas.
maps_files.forEach( (mapFile) => {
    let map = require( config.common.data_paths.maps + mapFile);
    objMaps[map.room] = map;

    //Agrega un cliente al array de clientes del room actual.
    // @param client: Objeto cliente a agregar.
    objMaps[map.room].addClientToRoom = (client) => {
        client ? objMaps[map.room].clients.push(client) : console.log( "Error adding client to room.".red );
    }

    //Quita un cliente del array de clientes del room actual.
    objMaps[map.room].removeClientFromRoom = (client) => {
        if(client)
        {
            objMaps[map.room].clients = objMaps[map.room].clients.filter( (item) => { return item !== client });
        }
        else
        {
            console.log( "Error removing client from room.".red );
        }
    }
});

//En la variable 'maps' van a estar disponibles los atributos de los mapas

module.exports = maps = objMaps;
