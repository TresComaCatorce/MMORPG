/*
    Project: MMORPGServer
    Date: 24/01/2019
    Author: Cristian Ferrero
*/

const fs = require('fs'); 
const args = require('minimist')(process.argv.slice(2));
const extend = require('extend');

//Si no se recibe un parametro el valor de la variable 'environment' es 'test'.
//Para darle un valor al argumento 'environment' se debe ejecutar: node server.js --env="production"
const environment = args.env || 'test';

//Variable "config" general que se va a exportar.
//Contiene todas las configuraciones.
const conf = { 'environment': environment };


// Reads all json files
const jsonCommonRaw = fs.readFileSync( `${appRoot}\\config\\common.json` );
const jsonDataBaseRaw = fs.readFileSync( `${appRoot}\\config\\dataBase.json` );
const jsonCharacterRaw = fs.readFileSync( `${appRoot}\\config\\character.json` );
const jsonSpawnersRaw = fs.readFileSync( `${appRoot}\\config\\spawners.json` );
const jsonEntitiesRaw = fs.readFileSync( `${appRoot}\\config\\entities.json` );
const jsonEntityTypesRaw = fs.readFileSync( `${appRoot}\\config\\entityTypes.json` );

const jsonCommonParsed = JSON.parse( jsonCommonRaw );
const jsonDataBaseParsed = JSON.parse( jsonDataBaseRaw );
const jsonCharacterParsed = JSON.parse( jsonCharacterRaw );
const jsonSpawnersParsed = JSON.parse( jsonSpawnersRaw );
const jsonEntitiesParsed = JSON.parse( jsonEntitiesRaw );
const jsonEntityTypesParsed = JSON.parse( jsonEntityTypesRaw );


// "common" configs
const common = jsonCommonParsed[environment];
common.data_paths.items = `${appRoot}\\resources\\game_data\\${jsonCommonParsed[environment].data_paths.items}\\`;
common.data_paths.rooms = `${appRoot}\\resources\\game_data\\${jsonCommonParsed[environment].data_paths.rooms}\\`;

// "dataBase" configs
const dataBase = jsonDataBaseParsed[environment];
dataBase.url = `mongodb://${jsonDataBaseParsed[environment].ip}/${jsonDataBaseParsed[environment].name}`;

// "character" configs
const character = jsonCharacterParsed[environment];

// "spawners" config
const spawners = jsonSpawnersParsed[environment];

// "entities" config
const entities = jsonEntitiesParsed[environment];
entities.getEntityById = entityId => entities.find( entityObj => entityObj.id == entityId );
entities.isValidEntity = entityId => !!entities.getEntityById(entityId);

// "entityTypes" config
const entityTypes = jsonEntityTypesParsed[environment];
entityTypes.getEntityTypeById = entityTypeId => entityTypes[entityTypeId];
entityTypes.isValidEntityType = entityTypeId => !!entityTypes.getEntityTypeById(entityTypeId);


//Se genera el archivo de configuración general.
extend( false, conf, { 'character': character } );
extend( false, conf, { 'common': common } );
extend( false, conf, { 'dataBase': dataBase } );
extend( false, conf, { 'spawners': spawners } );
extend( false, conf, { 'entities': entities } );
extend( false, conf, { 'entityTypes': entityTypes } );

//En la variable 'config' van a estar disponibles los atributos especificos del ambiente (variable 'conf').
module.exports = Config = conf;
