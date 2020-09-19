/*
    Project: MMORPGServer
    Date: 17/08/2020
    Author: Cristian Ferrero

    Description: Create and manage all spawners instances.

*/

const Spawner = require("./Spawner");

module.exports = SpawnsManager = class SpawnsManager {

	//#region CLASS FIELDS DECLARATION
	#spawnersInstances = [];
	//#endregion



	//#region CONSTRUCTOR
	constructor() {
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getSpawnersInstances() {
		return this.#spawnersInstances;
	}
	#setSpawnersInstances( value ) {
		if( Array.isArray(value) ) {
			this.#spawnersInstances = value;
		}
	}
	//#endregion



	//#region METHODS
	#init() {
		this.#loadAllSpawners();
	}

	// Process all "spawnerByRoom" objects in "spawners.json" file.
	#loadAllSpawners() {
		const spawnersByRoom = Config.spawners;
		const hasSpawners = Utils.isNotEmptyArray( spawnersByRoom );
		if( hasSpawners ) {
			spawnersByRoom.forEach( this.#loadSpawnSpots.bind(this) );
		}
	}

	// Load all spawn spots of one "spawnerByRoom" object.
	#loadSpawnSpots( spawnerByRoom ) {
		const { spawnSpots, roomCode } = spawnerByRoom;
		const hasSpawnSpots = Utils.isNotEmptyArray( spawnSpots );
		if( hasSpawnSpots ) {
			spawnSpots.forEach( spawnSpot => this.#processSpawnSpot({ roomCode, spawnSpot }) );
		}
	}

	#addSpawnerToSpawnersInstances( itemToAdd ) {
		if( itemToAdd instanceof Spawner ) {
			this.#spawnersInstances.push(itemToAdd);
		}
		else {
			throw( new Error(` SpawnsManager: attempt to add non 'Spawner' object into 'SpawnersInstances'.`) );
		}
	}

	// Process one "spawnSpot"
	#processSpawnSpot({ roomCode, spawnSpot }) {
		try {
			const newSpawnerInstance = new Spawner({
				...spawnSpot,
				roomCode
			});
			this.#addSpawnerToSpawnersInstances( newSpawnerInstance );
		}
		catch( error ) {
			console.error( (error.message || error).bold.red );
		}
		
	}
	//#endregion

}