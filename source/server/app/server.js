/*
    Project: MMORPGServer
    Date: 24/01/2019
    Author: Cristian Ferrero

    Description:


*/

//Imports de las librerias. ----->
module.exports = fs = require('fs'); //File system library.
var colors = require('colors'); //Console messages in colors.
var net = require('net'); //Network library.
require('./classes/Client');
//Fin imports librerias. ----->

//Se guarda una referencia global al path de la aplicacion.
global.appRoot = __dirname;

//------------------------------------------------------------------------------
//Carga de los inicializadores.
//------------------------------------------------------------------------------
var init_files = fs.readdirSync( `${__dirname}/initializers` );
console.log( '\nLoading initializers...'.bold.cyan);
init_files.forEach(function(initFile, index) //Por cada uno de los inicializadores del directorio 'initializers'.
{
    console.log( (`- ${initFile}`).magenta );
    require( `${__dirname}/initializers/${initFile}` );
});
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
//Carga de los modelos.
//------------------------------------------------------------------------------
var model_files = fs.readdirSync( __dirname + "/models" );
console.log( '\nLoading models...'.bold.cyan);
model_files.forEach(function(modelFile) //Por cada uno de los modelos del directorio 'models'.
{
    console.log( ('- ' + modelFile).magenta );
    require( __dirname + '/models/' + modelFile);
});
//------------------------------------------------------------------------------


//Mensaje de inicializacion completa
console.log( '\nServer initialize was complete.'.bold.green );


//Creacion del servidor para escuchar por internet.
let server = net.createServer();

// server.getConnections(function(error, count) {
//     console.log('Number of concurrent connections to the server : ' + count);
// });

//Configuracion del servidor
server.on( 'connection', (socket) => {

    //Informacion de la conexion
    let rport = socket.remotePort.toString();
    let raddr = socket.remoteAddress;
    let rfamily = socket.remoteFamily;

    console.log( ('Client connected from ip: ' + raddr.bold + ' | port: ' + rport.bold + ' | protocol: ' + rfamily.bold) );

    //Nueva instancia de 'client.js', una para cada conexion al servidor.
    //let c_inst = new require('./client.js');
    let thisClient = new Client( socket );

    //--------------------------------------------------------------------------
    //Handler functions
    //--------------------------------------------------------------------------
    //Manejo de datos enviados desde el cliente delegado al objeto cliente.
    socket.on( 'data', thisClient.data.bind(thisClient) );

    //Manejo de la finalizacion de la conexion delegada al objeto cliente.
    socket.on( 'end', thisClient.end.bind(thisClient) );

    //Manejo del cierre de la conexion delegada al objeto cliente.
    socket.on( 'close', thisClient.close.bind(thisClient) );

    //
    socket.on( 'drain', thisClient.drain.bind(thisClient) );

    //Manejo del timeout en la conexion.
    socket.on( 'timeout', thisClient.timeout.bind(thisClient) );

    //Manejo de error en la conexion
    socket.on( 'error', thisClient.error.bind(thisClient) );


    //Inicializacion del cliente
    //thisClient.initiate(socket);
});

server.on( 'listening', () => {
    console.log('Server running on port: '.bold.green + Config.common.port.bold + '\nEnvironment: '.bold.green + Config.common.environment_description.bold );
});

server.on( 'close', () => {
	maps.closeAllConnections();
	clearInterval(persistenceInterval);
	gamedb.close();
	console.log('Server closed.'.bold.red)
});

server.listen(Config.common.port);
