/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents one room (or map) in the game.

*/

const Character = require("./Character");
const Entity = require("./Entity");

module.exports = RoomClass = class Room {

	//#region CLASS FIELDS DECLARATION
	#name;
	#code;
	#spawnRange;
	#characters = [];
	#entities = [];
	//#endregion



	//#region CONSTRUCTOR
	constructor( data ) {
		const { name, code, spawn_range } = data;
		this.#setName( name );
		this.#setCode( code );
		this.#setSpawnRange( spawn_range );
	}
	//#endregion



	//#region GETTERS & SETTERS
	getName() {
		return this.#name;
	}
	#setName( value ) {
		this.#name = value;
	}

	getCode() {
		return this.#code;
	}
	#setCode( value ) {
		this.#code = value;
	}

	getSpawnRange() {
		return this.#spawnRange;
	}
	#setSpawnRange( value ) {
		this.#spawnRange = value;
	}

	getCharacters() {
		return this.#characters;
	}
	#setCharacters( value ) {
		if( Array.isArray(value) ) {
			this.#characters = value;
		}
	}

	getEntities() {
		return this.#entities;
	}
	#setEntities( value ) {
		if( Array.isArray(value) ) {
			this.#entities = value;
		}
	}
	//#endregion



	//#region METHODS
	// Add a character to room.
	// @param <Character> 'character': Character to add.
	// @return <number> Total number of characters in room. || <undefined> error case.
	addCharacter( character ) {
		if( character instanceof Character ) {
			return this.getCharacters().push(character);
		}
		else {
			throw( new Error(` Room.js | ${this.getName()} | try to add an invalid Character.`) );
		}
	}

	// Remove a given character from the room.
	// @param <Character> 'character': Character to remove.
	removeCharacter( character ) {
		if( character instanceof Character ) {
			this.#setCharacters( this.getCharacters().filter( item => item !== character ) );
		}
		else {
			throw( new Error(` Room.js | ${this.getName()} | try to remove an invalid Character.`) );
		}
	}

	// Remove all character of the room.
	removeAllCharacters() {
		this.#setCharacters( [] );
	}

	forEachCharacter( callback ) {
		this.getCharacters().forEach( callback );
	}

	// Adds entity to room.
	// @param <Entity> 'entity': Entity to add.
	// @return <number> Total number of entities in room. || <undefined> error case.
	addEntity( entity ) {
		if( entity instanceof Entity ) {
			return this.getEntities().push( entity );
		}
		else {
			throw( new Error(` Room.js | ${this.getName()} | try to add an invalid Entity.`) );
		}
	}

	// Remove a given entity from the room.
	// @param <Entity> 'entity': Entity to remove.
	removeEntity( entity ) {
		if( entity instanceof Entity ) {
			this.#setEntities( this.getEntities().filter( item => item !== entity ) );
		}
		else {
			throw( new Error(` Room.js | ${this.getName()} | try to remove an invalid Entity.`) );
		}
	}
	//#endregion

}