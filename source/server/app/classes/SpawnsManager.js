/*
    Project: MMORPGServer
    Date: 17/08/2020
    Author: Cristian Ferrero

    Description: Create and manage all spawners instances.

*/

const Spawner = require("./Spawner");

module.exports = SpawnsManager = class SpawnsManager {

	constructor() {
		// Each spawnersIntances is like { entities: [],  }
		this.spawnersIntances = [];

		this.loadAllSpawners();
	}

	// Process all "spawnerByRoom" objects in "spawners.json" file.
	loadAllSpawners() {
		const spawnersByRoom = Config.spawners;
		const hasSpawners = Utils.isNotEmptyArray(spawnersByRoom)
		if( hasSpawners ) {
			spawnersByRoom.forEach( this.loadSpawnSpots.bind(this) );
		}
	}

	// Load all spawn spots of one "spawnerByRoom" object.
	loadSpawnSpots( spawnerByRoom ) {
		const { spawnSpots, roomCode } = spawnerByRoom;
		const hasSpawnSpots = Utils.isNotEmptyArray( spawnSpots );
		if( hasSpawnSpots ) {
			spawnSpots.forEach( spawnSpot => this.processSpawnSpot({ roomCode, spawnSpot }) );
		}
	}

	// Process one "spawnSpot"
	processSpawnSpot({ roomCode, spawnSpot }) {
		try {
			const newSpawnerInstance = new Spawner({
				...spawnSpot,
				roomCode
			});
			this.spawnersIntances.push( newSpawnerInstance );
		}
		catch( error ) {
			console.error( (error.message || error).bold.red );
		}
		
	}
}