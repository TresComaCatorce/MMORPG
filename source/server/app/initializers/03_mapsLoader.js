/*
    Project: MMORPGServer
    Date: 09/06/2019
    Author: Cristian Ferrero
*/

const fs = require('fs'); //File system library.
const World = require('../classes/World');

//Objeto global que contiene la informacion de los mapas.
let objMaps = {};
let worldInstance = new World();

//Archivos de mapa
let maps_files = fs.readdirSync( Config.common.data_paths.maps );

//Por cada uno de los inicializadores del directorio de los mapas.
maps_files.forEach( (mapFile) => {
    let map = require( Config.common.data_paths.maps + mapFile);
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

	// Quita a todos los clientes del room.
	objMaps[map.room].removeAllClientsFromRoom = () => {
		objMaps[map.room].clients.forEach( client => {
			objMaps[map.room].removeClientFromRoom(client);
		});
	}

	// objMaps.forEachRoom = ( callBack ) => {
	// 	for( room in objMaps ) {
	// 		if( room.startsWith('rm_') ) {
	// 			callBack(objMaps[room]);
	// 		}
	// 	}
	// }
	
	// Quita a todos clientes de todos los rooms.
	objMaps.closeAllConnections = () => {
		objMaps.forEachRoom( room => {
			room.removeClientFromRoom();
		});
	}
});

//En la variable 'maps' van a estar disponibles los atributos de los mapas

module.exports = maps = objMaps;
