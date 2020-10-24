/*
    Project: MMORPGServer
    Date: 17/08/2020
    Author: Cristian Ferrero

	Description:	Spawns a quantity of one specific type of entities, in one specific room,
					in a specific coords range, in one specific direction every specific time interval.

*/
const _ = require('underscore');
const Enemy = require('./Enemy');
const Entity = require('./Entity');

module.exports = Spawner = class Spawner {
	//#region CLASS FIELDS DECLARATION
	#entityIdToSpawn;
	#roomCodeToSpawn;
	#quantityToSpawn;
	#entityTypeId;
	#x1;
	#y1;
	#x2;
	#y2;
	#direction;
	#timeInterval;
	#entitiesSpawned=[];
	//#endregion



	//#region CONSTRUCTOR
	constructor( params ) {
		const { entityId, roomCode, quantity, x1, y1, x2, y2, direction, interval} = params;
		this.#setEntityIdToSpawn( entityId );
		this.#setRoomCodeToSpawn( roomCode );
		this.#setQuantityToSpawn( quantity );
		this.#setX1( x1 );
		this.#setY1( y1 );
		this.#setX2( x2 );
		this.#setY2( y2 );
		this.#setDirection( direction );
		this.#setTimeInterval( interval );
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getEntityIdToSpawn() {
		return this.#entityIdToSpawn;
	}
	#setEntityIdToSpawn( value ) {
		if( typeof value == 'string' ) {
			if( Config.entities.isValidEntity(value) ) {
				this.#entityIdToSpawn = value;
			}
		}
	}

	getEntityTypeId() {
		return this.#entityTypeId;
	}
	#setEntityTypeId( value ) {
		if( typeof value == 'string' ) {
			if( Config.entityTypes.isValidEntityType(value) ) {
				this.#entityTypeId = value;
			}
		}
	}

	getRoomCodeToSpawn() {
		return this.#roomCodeToSpawn;
	}
	#setRoomCodeToSpawn( value ) {
		this.#roomCodeToSpawn = value;
	}
	
	getQuantityToSpawn() {
		return this.#quantityToSpawn;
	}
	#setQuantityToSpawn( value ) {
		this.#quantityToSpawn = value;
	}

	getX1() {
		return this.#x1;
	}
	#setX1( value ) {
		if( typeof value == 'number' && value>=0 ) {
			this.#x1 = value;
		}
	}
	getY1() {
		return this.#y1;
	}
	#setY1( value ) {
		if( typeof value == 'number' && value>=0 ) {
			this.#y1 = value;
		}
	}
	getX2() {
		return this.#x2;
	}
	#setX2( value ) {
		if( typeof value == 'number' && value>=0 ) {
			this.#x2 = value;
		}
	}
	getY2() {
		return this.#y2;
	}
	#setY2( value ) {
		if( typeof value == 'number' && value>=0 ) {
			this.#y2 = value;
		}
	}

	getDirection() {
		return this.#direction;
	}
	#setDirection( value ) {
		this.#direction = Utils.isValidDirection(value) ? value : -1;
	}

	#getTimeInterval() {
		return this.#timeInterval;
	}
	#setTimeInterval( value ) {
		if( typeof value == 'number' ) {
			this.#timeInterval = value;
		}
	}

	getEntitiesSpawned() {
		return this.#entitiesSpawned;
	}
	#setEntitiesSpawned( value ) {
		if( Array.isArray(value) ) {
			this.#entitiesSpawned = value;
		}
	}
	//#endregion



	//#region METHODS
	#init() {
		this.#determineEntityType();
		this.#spawnAllEntities();
	}


	
	#determineEntityType() {
		const entityObj = Config.entities.getEntityById( this.getEntityIdToSpawn() );
		if(entityObj) {
			const entityTypeObj = Config.entityTypes[entityObj.typeId];
			if(entityTypeObj) {
				this.#setEntityTypeId( entityTypeObj.id );
			}
			else {
				throw( new Error(` Spawner.js | Error spawning entityTypeId: '${entityObj.typeId}'. Entity type not found in <entityTypes.json>`) );
			}
		}
		else {
			throw( new Error(` Spawner.js | Error spawning entityId: '${this.getEntityIdToSpawn()}'. Not found in <entities.json> file.`) );
		}
	}

	#spawnAllEntities() {
		for( let i=0; i<this.getQuantityToSpawn() ; i++ ) {
			this.#spawnOneEntity();
		}
	}

	#spawnOneEntity() {
		const randomPoint = this.#getRandomSpawnPoint();
	
		this.#spawnEntity({
			x: randomPoint.x,
			y: randomPoint.y
		});
	}

	#respawnOneEntity() {
		setTimeout( () => {
			this.#spawnOneEntity();
		}, this.#getTimeInterval() );
	}

	// Get a random spawn points inside the configured spawner area
	#getRandomSpawnPoint() {
		return {
			x: this.#getRandomCoordBetween({ c1: this.getX1(), c2: this.getX2() }),
			y: this.#getRandomCoordBetween({ c1: this.getY1(), c2: this.getY2() })
		}
	}

	// Obtains a random coord beetwen two points of the same axis
	#getRandomCoordBetween({ c1, c2 }) {
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

	// Add entity to 'entitiesSpawned' array
	// @param <Entity> 'entityToAdd': Entity to add.
	#addEntitySpawned( entityToAdd ) {
		if( entityToAdd instanceof Entity ) {
			this.getEntitiesSpawned().push( entityToAdd );
		}
		else {
			throw( new Error(`Spawner.js | Attempt to add a non 'Entity' object into 'entitiesSpawned'.`) );
		}
	}

	#removeEntitySpawned( entityToRemove ) {
		if( entityToRemove instanceof Entity ) {
			const newEntitiesSpawned = this.getEntitiesSpawned().filter( item => item!=entityToRemove );
			this.#setEntitiesSpawned( newEntitiesSpawned );
			console.log("CBF realEntitiesSpawned: ", this.getEntitiesSpawned());
		}
		else {
			throw( new Error(`Spawner.js | Attempt to remove a non 'Entity' object fom 'entitiesSpawned'.`) );
		}
	}

	// Spawns entity at given point
	#spawnEntity({ x, y }) {
		let instanceCreated;

		switch( this.getEntityTypeId() ) {
			case Config.entityTypes.ENEMY.id: {
				instanceCreated = new Enemy({
					x,
					y,
					id: this.getEntityIdToSpawn(),
					roomCode: this.getRoomCodeToSpawn(),
					direction: this.getDirection(),
					spawnerAsociated: this,
					onDeadEvent: this.#entityOnDeadEvent.bind(this)
				});
				break;
			}
			
			case Config.entityTypes.NPC.id: {
				console.log('CBF instance NPC')
				break;
			}

			default: {

			}
		}

		this.#addEntitySpawned( instanceCreated );
	}

	// Re-spawn entity who died
	// @param <Entity> 'entityDead': Instence of entity who die.
	#entityOnDeadEvent( entityDead ) {
		this.#removeEntitySpawned( entityDead );
		this.#respawnOneEntity();
	}
	//#endregion



	

	
};