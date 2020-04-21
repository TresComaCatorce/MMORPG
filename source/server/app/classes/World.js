/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: World object, contains all maps in it and players connected.

*/

const fs = require('fs');
const Room = require('./Room');

module.exports = WorldClass = class World {
	constructor() {
		this.rooms = {};
		this.init();
	}

	init() {
		try {
			const roomsPath = Config.common.data_paths.rooms;
			const roomsFiles = fs.readdirSync( roomsPath );

			roomsFiles.forEach( roomFile => {
				const roomPath = `${roomsPath}${roomFile}`;
				const roomData = require( roomPath);
				this.rooms[roomData.code] = new Room(roomData);
			});
		} catch (error) {
			console.log("CBF error reading rooms: ", error);
		}
	}

	// Check if exist a room with a given room code.
	// @param <string> 'roomCode': Room code to check.
	roomExist( roomCode ) {
		return this.rooms.hasOwnProperty(roomCode);
	}

	// Call a callback for each map and pass the map as a paremeter to the callback.
	// @param <function> 'callBack': Function to execute for every room.
	forEachRoom( callBack ) {
		for( const room in this.rooms ) {
			callBack( this.rooms[room] );
		}
	}

	// Call a callback for each character in the given room.
	// @param <string> 'roomCode': Code of the room.
	// @param <function> 'callback': Callback to execute for every character in the given room.
	forEachCharacterInRoom( roomCode, callback ) {
		this.roomExist(roomCode) ? this.rooms[roomCode].forEachCharacter( callback ) : console.log(`CBF Error: The room with code "${roomCode}" doesn't exist.`.red);
	}
	
	// Remove all characters from every rooms.
	removeAllCharacters() {
		this.forEachRoom( room => {
			room.removeAllCharacters();
		});
	}

	// Remove a character from a given room.
	// @param <string> 'roomCode': Code name of the room.
	// @param <Character> 'character': Id of the user.
	removeCharacterFromRoom( roomCode, character ) {
		this.roomExist(roomCode) ? this.rooms[roomCode].removeCharacter( character ) : console.log(`CBF Error: The room with code "${roomCode}" doesn't exist.`.red);
	}

	// Add a character to a given room.
	// @param <string> 'roomCode': Code name of the room.
	// @param <Character> 'character': Id of the user.
	addCharacterToRoom( roomCode, character ) {
		this.roomExist(roomCode) ? this.rooms[roomCode].addCharacter( character ) : console.log(`CBF Error: The room with code "${roomCode}" doesn't exist.`.red);
	}
};