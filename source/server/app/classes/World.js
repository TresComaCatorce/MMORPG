/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: World object, contains all maps in it and players connected.

*/

const fs = require('fs');
const Room = require('./Room');

module.exports = WorldClass = class World {

	//#region CLASS FIELDS DECLARATION
	#rooms = {};
	//#endregion



	//#region CONSTRUCTOR
	constructor() {
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getRooms() {
		return this.#rooms;
	}

	#setRooms( value ) {
		if( Utils.exist(value) && typeof value == 'object' ) {
			this.#rooms = value;
		}
	}
	//#endregion



	//#region METHODS
	#init() {
		this.#loadRoomsFiles();
	}

	#loadRoomsFiles() {
		try {
			const roomsPath = Config.common.data_paths.rooms;
			const roomsFiles = fs.readdirSync( roomsPath );

			roomsFiles.forEach( roomFile => {
				const roomPath = `${roomsPath}${roomFile}`;
				const roomData = require( roomPath);
				this.#addRoom( new Room(roomData) );
			});
		} catch (error) {
			console.log("CBF error reading rooms: ", error);
		}
	}

	#addRoom( roomToAdd ) {
		if( roomToAdd && roomToAdd instanceof Room ) {
			this.#rooms[roomToAdd.getCode()] = roomToAdd;
		}
	}

	// Check if exist a room with a given room code.
	// @param <string> 'roomCode': Room code to check.
	#roomExist( roomCode ) {
		return this.getRooms().hasOwnProperty(roomCode);
	}

	getRoomByCode( roomCode ) {
		if( Utils.exist(roomCode) && this.#roomExist(roomCode) ) {
			return this.getRooms()[roomCode];
		}
	}

	// Call a callback for each map and pass the map as a paremeter to the callback.
	// @param <function> 'callBack': Function to execute for every room.
	forEachRoom( callBack ) {
		for( const roomCode in this.getRooms() ) {
			callBack( this.getRoomByCode(roomCode) );
		}
	}

	// Call a callback for each character in the given room.
	// @param <string> 'roomCode': Code of the room.
	// @param <function> 'callback': Callback to execute for every character in the given room.
	forEachCharacterInRoom( roomCode, callback ) {
		if( this.#roomExist(roomCode) ) {
			this.getRoomByCode(roomCode).forEachCharacter( callback );
		}
		else {
			throw( new Error(` World.js | forEachCharacterInRoom() | The room with code "${roomCode}" doesn't exist.`) );
		}
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
		if(this.#roomExist(roomCode) ) {
			this.getRoomByCode(roomCode).removeCharacter( character );
		}
		else {
			throw( new Error(` World.js | removeCharacterFromRoom() | The room with code "${roomCode}" doesn't exist.`) );
		}
	}

	// Add a character to a given room.
	// @param <string> 'roomCode': Code name of the room.
	// @param <Character> 'character': Id of the user.
	addCharacterToRoom( roomCode, character ) {
		if( this.#roomExist(roomCode) ) {
			this.getRoomByCode(roomCode).addCharacter( character )
		}
		else {
			throw( new Error(` World.js | addCharacterToRoom() | The room with code "${roomCode}" doesn't exist.`) );
		}
	}
	//#endregion
	
};