/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Esquema de la coleccion <user> de la base de datos.n
*/

const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema
({
	name: {
		type: String,
		required: true,
		unique: true,
		match: [ Config.common.validations.character_name.regex, Config.common.validations.character_name.message]
	},
	level: {
		type: Number,
		min: 1,
		max: Config.common.max_level
	},
	pos_x: {
		type: Number,
		min: 0
	},
	pos_y: {
		type: Number,
		min: 0
	},
});


module.exports = CharacterSchema = gamedb.model('Character', characterSchema);
