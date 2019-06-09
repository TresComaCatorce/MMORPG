/*
    Proyecto: MMORPGServer
    Fecha: 24/01/2018
    Autor: Cristian Ferrero
*/

//Variable donde se van a almacenar los argumentos que reciba el programa.
var args = require('minimist')(process.argv.slice(2));

/*  Import de la libreria JS "Extend": Permite copiar todos los valores de un objeto JS
    dentro de otro objeto JS, extendiendo el primer objeto.
    https://www.npmjs.com/package/extend */
var extend = require('extend');

//Si no se recibe un parametro el valor de la variable 'environment' es 'test'.
//Para darle un valor al argumento 'environment' se debe ejecutar: node server.js --env="production"
var environment = args.env || "test";

//Ver el valor de 'environment' al ejecutar el programa.
//console.log(environment);

//Traigo la configuracion general del servidor a la variable 'common_conf'
var common_conf =
    {
        name: "",
        version: "0.0.1",
        environment: environment,
        max_player: 100,
        data_paths:
        {
            items: __dirname + "\\game_data\\" + "items\\",
            maps: __dirname + "\\game_data\\" + "maps\\"
        },
        starting_zone: "rm_lorencia"
    };

//Configuraciones especificas para cada ambiente.
var conf =
    {
        production :
        {
            ip: args.ip || "127.0.0.1",
            port: args.port || 8081,
            database: "mongodb://127.0.0.1/Ragnum_PROD"
        },

        test :
        {
            ip: args.ip || "127.0.0.1",
            port: args.port || 8082,
            database: "mongodb://127.0.0.1/Ragnum_TEST"
        },
    };

//Se "fusionan" los objetos "conf.production" y "conf.test" con "common_conf".
extend(false, conf.production, common_conf);
extend(false, conf.test, common_conf);

//En la variable 'config' van a estar disponibles los atributos especificos del ambiente (variable 'conf').
module.exports = config = conf[environment];
