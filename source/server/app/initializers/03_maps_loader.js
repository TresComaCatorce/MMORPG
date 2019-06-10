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
maps_files.forEach(function(mapFile)
{
    console.log( ('- ' + mapFile).magenta );
    let map = require( config.common.data_paths.maps + mapFile);
    objMaps[map.room] = map;
});

//En la variable 'maps' van a estar disponibles los atributos de los mapas

module.exports = maps = objMaps;
