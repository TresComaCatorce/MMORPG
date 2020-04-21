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
		unique: true,
		match: [
			new RegExp(Config.common.validations.character_name.regex),
			Config.common.validations.character_name.message
		]
	},
	race: {
		type: Number,
		min: 0,
		default: Config.character.default_race
	},
	level: {
		type: Number,
		min: 1,
		max: Config.character.max_level,
		default: 1
	},
	currentExp: {
		type: Number,
		min: 0,
		default: 0
	},
	nextLevelExp: {
		type: Number,
		default: 100
	},
	currentHp: {
		type: Number,
		min: 0,
		max: Config.character.max_hp,
		default: Config.character.default_hp
	},
	maxHp: {
		type: Number,
		min: Config.character.default_hp,
		max: Config.character.max_hp,
		default: Config.character.default_hp
	},
	currentMana: {
		type: Number,
		min: 0,
		max: Config.character.max_mana,
		default: Config.character.default_mana
	},
	maxMana: {
		type: Number,
		min: Config.character.default_mana,
		max: Config.character.max_mana,
		default: Config.character.default_mana
	},
	currentStamina: {
		type: Number,
		min: 0,
		max: Config.character.max_stamina,
		default: Config.character.default_stamina
	},
	maxStamina: {
		type: Number,
		min: Config.character.default_stamina,
		max: Config.character.max_stamina,
	},
	statStrength: {
		type: Number,
		min: Config.character.default_stat_strength,
		max: Config.character.max_stat_strength,
		default: Config.character.default_stat_strength,
	},
	statDexterity: {
		type: Number,
		min: Config.character.default_stat_dexterity,
		max: Config.character.max_stat_dexterity,
		default: Config.character.default_stat_dexterity,
	},
	current_room: {
		type: Number,
		min: 1,
		default: Config.character.default_room
	},
	pos_x: {
		type: Number,
		min: 1,
		default: Config.character.default_pos_x
	},
	pos_y: {
		type: Number,
		min: 1,
		default: Config.character.default_pox_y
	},
	account_slot: {
		type: Number,
		min: 1,
		max: 5
	},
	account: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account'
	}
});

// Create new character
characterSchema.statics.create = async( data ) => {
	console.log("CBF create char: ", data);
	//Deasembly object to control stored data
	const {name, race, level, current_room, pos_x, pos_y, account_slot, account} = data;

	const param  = {
		name,
		race,
		level,
		current_room,
		pos_x,
		pos_y,
		account_slot,
		account
	};
	console.log("CBF params: ", param);

	var newCharacter = new CharacterModel(param);

	return await newCharacter.save();
};

module.exports = CharacterModel = gamedb.model('Character', characterSchema);