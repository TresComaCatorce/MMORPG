/*
    Proyecto: MMORPGServer
    Fecha: 24/01/2018
    Autor: Cristian Ferrero

    Descripcion:


*/

//Imports de las librerias. ----->
var colors = require('colors'); //Console messages in colors.
var fs = require('fs'); //File system library.
var net = require('net'); //Network library.
require('./packet.js'); //Convertidor: JS Object -> Buffer
//Fin imports librerias. ----->

//Se guarda una referencia global al path de la aplicacion.
global.appRoot = __dirname;

//------------------------------------------------------------------------------
//Carga de los inicializadores.
//------------------------------------------------------------------------------
var init_files = fs.readdirSync( __dirname + "/initializers" );
console.log('\nLoading initializers...'.bold.cyan);
init_files.forEach(function(initFile, index) //Por cada uno de los inicializadores del directorio 'initializers'.
{
    console.log( ('- ' + initFile).magenta );
    require( __dirname + '/initializers/' + initFile);
});
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
//Carga de los modelos.
//------------------------------------------------------------------------------
var model_files = fs.readdirSync( __dirname + "/models" );
console.log('Loading models...'.bold.cyan);
model_files.forEach(function(modelFile) //Por cada uno de los modelos del directorio 'models'.
{
    console.log( ('- ' + modelFile).magenta );
    require( __dirname + '/models/' + modelFile);
});
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
//Carga de los mapas.
//------------------------------------------------------------------------------
// let maps = {}; //Objeto global que contiene la informacion de los mapas.
// console.log("CBF maps: ", config.common.data_paths, config.common.data_paths.maps);
// let maps_files = fs.readdirSync( config.common.data_paths.maps );
// console.log('Loading maps...'.bold.cyan);
// //Por cada uno de los inicializadores del directorio de los mapas.
// maps_files.forEach(function(mapFile)
// {
//     console.log( ('- ' + mapFile).magenta );
//     let map = require( config.common.data_paths.maps + mapFile);
//     maps[map.room] = map;
// });
//------------------------------------------------------------------------------



//Mensaje de inicializacion completa
console.log('Server initialize was complete.'.bold.green);


//Creacion del servidor para escuchar por internet.
net.createServer(function(socket)
{
    //Require del archivo 'client.js', objeto 'client' por asi decirlo.
    var c_inst = new require('./client.js');
    //Nueva instancia de 'client.js', una para cada conexion al servidor.
    var thisClient = new c_inst();
    //Se le asigna a la instancia del cliente su socket especifico.
    thisClient.socket = socket;
    thisClient.initiate(); //Ejecuta la funcion 'initiate' de 'client.js'

    //Handler functions
    //Son referencias a las funciones del cliente, para que cada instancia del cliente las maneje.
    socket.on( 'data', thisClient.data );
    socket.on( 'end', thisClient.end );
    socket.on( 'error', thisClient.error );

}).listen(config.common.port);

console.log('Server running on port: '.bold.green + config.common.port.bold + '\nEnvironment: '.bold.green + config.common.environment_description.bold );
