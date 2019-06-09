/*
    Proyecto: MMORPGServer
    Fecha: 24/01/2018
    Autor: Cristian Ferrero

    Descripcion:


*/

//Imports de las librerias. ----->

var colors = require('colors'); //Console messages in colors.
require(__dirname + '/resources/config.js');
var fs = require('fs'); //File system library.
var net = require('net'); //Network library.
require('./packet.js'); //Convertidor: JS Object -> Buffer

//Fin imports librerias. ----->


//Carga de los inicializadores.
var init_files = fs.readdirSync( __dirname + "/initializers" );
console.log('\nLoading initializers...'.bold.cyan);
init_files.forEach(function(initFile, index) //Por cada uno de los inicializadores del directorio 'initializers'.
{
    console.log( ('- ' + initFile).magenta );
    require( __dirname + '/initializers/' + initFile);
});


//Carga de los modelos.
var model_files = fs.readdirSync( __dirname + "/models" );
console.log('Loading models...'.bold.cyan);
model_files.forEach(function(modelFile) //Por cada uno de los modelos del directorio 'models'.
{
    console.log( ('- ' + modelFile).magenta );
    require( __dirname + '/models/' + modelFile);
});


//Carga de los mapas.
maps = {}; //Objeto global que contiene la informacion de los mapas.
var maps_files = fs.readdirSync( config.data_paths.maps );
console.log('Loading maps...'.bold.cyan);
//Por cada uno de los inicializadores del directorio 'initializers'.
maps_files.forEach(function(mapFile)
{
    console.log( ('- ' + mapFile).magenta );
    var map = require( config.data_paths.maps + mapFile);
    maps[map.room] = map;
});

//Mensaje de inicializacion completa
console.log('Server initialize was complete.'.bold.cyan);


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

}).listen(config.port);

console.log('Server running on port: '.bold.cyan + config.port + '\nEnvironment: '.bold.cyan + config.environment );
//Mensaje de server running.
