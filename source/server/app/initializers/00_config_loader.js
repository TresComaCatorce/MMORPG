/*
    Proyecto: MMORPGServer
    Fecha: 24/01/2019
    Autor: Cristian Ferrero
*/

const fs = require('fs'); //Manejo de file system.
const args = require('minimist')(process.argv.slice(2)); //Manejo de parámetros por comando.
const extend = require('extend'); //Libreria extend.

//Si no se recibe un parametro el valor de la variable 'environment' es 'test'.
//Para darle un valor al argumento 'environment' se debe ejecutar: node server.js --env="production"
const environment = args.env || "test";

//Variable "config" general que se va a exportar.
//Contiene todas las configuraciones.
let conf = {"environment": environment};


//Se lee el archivo "common.json".
let rawdata = fs.readFileSync( appRoot + '\\config\\common.json');
let json_common = JSON.parse(rawdata);
let common =
{
    name: json_common[environment].name,
    version: json_common[environment].version,
    environment_description: json_common[environment].environment_description,
    max_player: parseInt(json_common[environment].max_player),
    data_paths:
    {
        items: appRoot + "\\resources\\game_data\\" + json_common[environment].data_paths.items + "\\",
        maps: appRoot + "\\resources\\game_data\\" + json_common[environment].data_paths.maps + "\\"
    },
    starting_zone: json_common[environment].starting_zone,
    port: json_common[environment].port
}

//Se lee el archivo "data_base.json".
rawdata = fs.readFileSync(appRoot + '\\config\\data_base.json');
let json_database = JSON.parse(rawdata);
let data_base =
{
    ip: json_database[environment].ip,
	url: "mongodb://" + json_database[environment].ip + "/" + json_database[environment].name,
	persist_interval: json_database[environment].persist_interval
};



//Se genera el archivo de configuración general.
extend(false, conf, {"common":common} );
extend(false, conf, {"data_base": data_base} );

//En la variable 'config' van a estar disponibles los atributos especificos del ambiente (variable 'conf').
module.exports = config = conf;
