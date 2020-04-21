/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents one room (or map) in the game.

*/

module.exports = RoomClass = class Room {

	constructor( data ) {
		const { name, code, spawn_range } = data;
		this.name = name;
		this.code = code;
		this.spawn_range = spawn_range;
		this.characters = [];
	}

	// Add a character to room.
	// @param <Character> 'character': Character to add.
	// @return <number> Total number of characters in room. || <undefined> error case.
	addCharacter( character ) {
		return character ? this.characters.push(character) : console.log( `Error adding character to room ${this.name}`.red );
	}

	// Remove a given character from the room.
	// @param <Character> 'character': Character to remove.
	removeCharacter( character ) {
		if(character) {
			this.characters = this.characters.filter( item => item !== character );
		}
		else {
			console.log( "Error removing character from room.".red );
		}
	}

	// Remove all character of the room.
	removeAllCharacters() {
		this.characters = [];
	}

	forEachCharacter( callback ) {
		this.characters.forEach( callback );
	}

}