/*
    Project: MMORPGServer
    Date: 17/08/2020
    Author: Cristian Ferrero

	Description:	Spawns a quantity of one specific type of entities, in one specific room,
					in a specific coords range, in one specific direction every specific time interval.

*/
const _ = require('underscore');
const Enemy = require('./Enemy');

module.exports = Spawner = class Spawner {
	constructor({ entityId, roomCode, quantity, x1, y1, x2, y2, direction, interval}) {
		this.entityIdToSpawn = entityId;
		this.entityTypeId = undefined;
		this.roomCodeToSpawn = roomCode;
		this.quantityToSpawn = quantity;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.direction = direction;
		this.timeInterval = interval;
		this.entitiesSpawned = [];
		this.init();
	}

	init() {
		this.getEntityType();
		this.spawnAllEntities();
	}
	
	getEntityType() {
		const entityObj = Config.entities.getEntityById( this.entityIdToSpawn );
		if(entityObj) {
			const entityTypeObj = Config.entityTypes[entityObj.type];
			if(entityTypeObj) {
				this.entityTypeId = entityTypeObj.id;
			}
			else {
				throw( new Error(`Error spawning entity id: ${this.entityIdToSpawn}. Entity type not found in <entityTypes.json>`) );
			}
		}
		else {
			throw( new Error(`Error spawning entity id: ${this.entityIdToSpawn}. Not found in <entities.json>`) );
		}
	}

	spawnAllEntities() {
		
		for( let i=0; i<this.quantityToSpawn ; i++ ) {
			const randomPoint = this.getRandomSpawnPoint();
			// console.log(`Random point X: ${randomPoint.x} Y: ${randomPoint.y}`);
	
			this.spawnEntity({
				x: randomPoint.x,
				y: randomPoint.y
			});
		}

	}

	// Get a random spawn points inside the configured spawner area
	getRandomSpawnPoint() {
		return {
			x: this.getRandomCoordBetween({ c1: this.x1, c2: this.x2 }),
			y: this.getRandomCoordBetween({ c1: this.y1, c2: this.y2 })
		}
	}

	// Obtains a random coord beetwen two points of the same axis
	getRandomCoordBetween({ c1, c2 }) {
		if( c1 == c2 )
			return c1;
		
		let cMin, cMax;
		if( c2 > c1 ) {
			cMin = c1;
			cMax = c2;
		}
		else if( c2 < c1 ) {
			cMin = c2;
			cMax = c1;
		}
		return _.random( cMin, cMax );
	}

	// Spawns entity at given point
	spawnEntity({ x, y }) {
		let instanceCreated;

		switch( this.entityTypeId ) {
			case Config.entityTypes.ENEMY.id: {
				instanceCreated = new Enemy({
					pos_x: x,
					pos_y: y,
					_id: this.entityIdToSpawn,
					current_room: this.roomCodeToSpawn,
					direction: this.direction,
					spawnerAsociated: this
				});
				break;
			}
			
			case Config.entityTypes.NPC.id: {
				console.log("CBF instance NPC")
				break;
			}

			default: {

			}
		}

		this.entitiesSpawned.push(instanceCreated);
		
	}

	// Re-spawn entity who died
	getEntityDeathEvent( entityDead ) {
		this.entitiesSpawned.forEach( entity => {
			if( entity == entityDead ) {
				console.log("CBF entidad muerta: ", entity, entityDead);
			}
		});
	}
};