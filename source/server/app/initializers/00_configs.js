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
const environment = args.env || "test";

//Variable "config" general que se va a exportar.
//Contiene todas las configuraciones.
const conf = {"environment": environment};


//Se lee el archivo "common.json".
let rawdata = fs.readFileSync( appRoot + '\\config\\common.json');
const json_common = JSON.parse(rawdata);

const common =
{
    name: json_common[environment].name,
    version: json_common[environment].version,
    environment_description: json_common[environment].environment_description,
    max_player: parseInt(json_common[environment].max_player),
    data_paths:
    {
        items: appRoot + "\\resources\\game_data\\" + json_common[environment].data_paths.items + "\\",
        rooms: appRoot + "\\resources\\game_data\\" + json_common[environment].data_paths.rooms + "\\"
    },
	port: json_common[environment].port,
	update_interval: json_common[environment].update_interval,
	nearby_distance: json_common[environment].nearby_distance,
	validations: json_common[environment].validations
}

//Se lee el archivo "data_base.json".
rawdata = fs.readFileSync(appRoot + '\\config\\data_base.json');
const json_database = JSON.parse(rawdata);
const data_base =
{
    ip: json_database[environment].ip,
	url: "mongodb://" + json_database[environment].ip + "/" + json_database[environment].name,
	persist_interval: json_database[environment].persist_interval
};


//Se lee el archivo "data_base.json".
rawdata = fs.readFileSync(appRoot + '\\config\\character.json');
const json_character = JSON.parse(rawdata);
const character =
{
    max_level: json_character[environment].max_level,
	max_hp: json_character[environment].max_hp,
	max_mana: json_character[environment].max_mana,
	max_stamina: json_character[environment].max_stamina,
	default_room: json_character[environment].default_room,
	default_race: json_character[environment].default_race,
	default_pos_x: json_character[environment].default_pos_x,
	default_pox_y: json_character[environment].default_pox_y,
	max_level: json_character[environment].max_level,
	points_per_level: json_character[environment].points_per_level,
	default_hp: json_character[environment].default_hp,
	max_hp: json_character[environment].max_hp,
	default_mana: json_character[environment].default_mana,
	max_mana: json_character[environment].max_mana,
	default_stamina: json_character[environment].default_stamina,
	max_stamina: json_character[environment].max_stamina,
	default_stat_strength: json_character[environment].default_stat_strength,
	max_stat_strength: json_character[environment].max_stat_strength,
	default_stat_dexterity: json_character[environment].default_stat_dexterity,
	max_stat_dexterity: json_character[environment].max_stat_dexterity,
	default_stat_vitality: json_character[environment].default_stat_vitality,
	max_stat_vitality: json_character[environment].max_stat_vitality,
	default_stat_energy: json_character[environment].default_stat_energy,
	max_stat_energy: json_character[environment].max_stat_energy,
	default_stat_intelligence: json_character[environment].default_stat_intelligence,
	max_stat_intelligence: json_character[environment].max_stat_intelligence,
	default_stat_spirit: json_character[environment].default_stat_spirit,
	max_stat_spirit: json_character[environment].max_stat_spirit,
	default_stat_wildness: json_character[environment].default_stat_wildness,
	max_stat_wildness: json_character[environment].max_stat_wildness
};


//Se genera el archivo de configuración general.
extend(false, conf, {"character":character} );
extend(false, conf, {"common":common} );
extend(false, conf, {"data_base": data_base} );

//En la variable 'config' van a estar disponibles los atributos especificos del ambiente (variable 'conf').
module.exports = Config = conf;
