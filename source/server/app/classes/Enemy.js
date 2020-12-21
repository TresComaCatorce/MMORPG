/*
    Project: MMORPGServer
    Date: 17/08/2020
    Author: Cristian Ferrero

    Description: All enemies in game.

*/

const _ = require('underscore');

const Entity = require('./Entity');
const Position = require('./Position');
const HPFunctionality = require('./HPFunctionality');

module.exports = Enemy = class Enemy extends Entity {

	

	//#region CLASS FIELDS DECLARATION
	#position;
	#state;
	#HP;
	#spawnerAsociated;
	#externalOnDeadEvent;
	#updateDaemon;
	#dmgDaemon; //CBF TO_DELETE
	//#endregion



	//#region CONSTRUCTOR
	constructor( params={} ) {
		const { id, x, y, state=Constants.STATES.ENEMY.IDLE, roomCode, direction, spawnerAsociated, onDeadEvent=()=>{} } = params;
		super({ id });
		this.#setPosition( new Position({ x, y, roomCode, direction }) );
		this.#setState(state);
		this.#setSpawnerAsociated(spawnerAsociated);
		this.#setExternalOnDeadEvent(onDeadEvent);
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getPosition() {
		return this.#position;
	}
	#setPosition( value ) {
		if( value instanceof Position ) {
			this.#position = value;
		}
	}
	
	getState() {
		return this.#state;
	}
	#setState( value ) {
		if( Utils.isValidEnemyState(value) ) {
			this.#state = value;
		}
	}

	getHP() {
		return this.#HP;
	}
	#setHP( value ) {
		if( value instanceof HPFunctionality ) {
			this.#HP = value;
		}
	}

	getSpawnerAsociated() {
		return this.#spawnerAsociated;
	}
	#setSpawnerAsociated( value ) {
		if( Utils.exist(value) ) {
			this.#spawnerAsociated = value;
		}
	}
	
	#getExternalOnDeadEvent() {
		return this.#externalOnDeadEvent;
	}
	#setExternalOnDeadEvent( value ) {
		if( typeof value == 'function' ) {
			this.#externalOnDeadEvent = value;
		}
	}
	
	#getUpdateDaemon() {
		return this.#updateDaemon;
	}
	#setUpdateDaemon( value ) {
		if( Utils.exist(value) ) {
			this.#updateDaemon = value;
		}
	}
	//#endregion



	//#region METHODS
	#init() {
		this.#loadEnemyDataFromConfigJson();
		this.#addToWorld();
		this.#onSpawnEvent();
		this.#initUpdateDaemon();
		
		// CBF only to test
		// this.#programmedDeath();
		this.#programmedDmg();
	}
	
	// Load the data from "entities.json" file
	#loadEnemyDataFromConfigJson() {
		const entityObj = Config.entities.getEntityById( this.getId() );
		if( entityObj ) {
			const { minHp, maxHp } = entityObj;
			this.#setHP( new HPFunctionality({
				rangeMinHP: minHp,
				rangeMaxHP: maxHp,
				onDeadEvent: this.#onDeadEvent.bind(this)
			}) );
		}
		else {
			throw( new Error(` Enemy.js | entityId: '${this.getId()}' not found in <entities.json> file.`) );
		}
	}
	

	// Send a packet to all characters where are nearby to this Entity.
	// @param <Array> 'packetData': Data to send.
	#broadcastNearbyCharacters( data ) {
		World.forEachCharacterInRoom( this.getPosition().getRoomCode(), ( characterInRoom ) => {
			const distanceBetween = Utils.getDistanceBetweenPoints({
				x1: characterInRoom.getPosition().getX(), 
				y1: characterInRoom.getPosition().getY(),
				x2: this.getPosition().getX(),
				y2: this.getPosition().getY()
			});

			if( distanceBetween <Config.common.nearby_distance ) {
				characterInRoom.broadcastSelf( data );
			};
		})
	}


	// Add current instance to the World object.
	#addToWorld() {
		World.addEntityToRoom({
			roomCode: this.getPosition().getRoomCode(),
			entityInstance: this
		});
	}

	// Remove current instance from the World object.
	#removeFromWorld() {
		World.removeEntityFromRoom({
			roomCode: this.getPosition().getRoomCode(),
			entityInstance: this
		});
	}

	// Send S_ENEMY_SPAWN packet to nearby clients.
	#sendSpawnPacket() {
		this.#broadcastNearbyCharacters([
			Constants.PACKETS.S_ENEMY_SPAWN,
			this.getUId(),
			this.getId(),
			this.getPosition().getX(),
			this.getPosition().getY(),
			this.getPosition().getDirection(),
			this.getHP().getMaxHP()
		]);
	}

	// Send S_ENEMY_DEATH packet to nearby clients.
	#sendDeathPacket() {
		this.#broadcastNearbyCharacters([
			Constants.PACKETS.S_ENEMY_DEATH,
			this.getUId()
		]);
	}
	
	// Event who runs when the enemy spawn.
	#onSpawnEvent() {
		this.#sendSpawnPacket();
		console.log(`Enemy.js | ${this.getName()} EVENT_SPAWN (uId: ${this.getUId()}) in '${World.getRoomByCode(this.getPosition().getRoomCode()).getName()}' at X: ${this.getPosition().getX()} Y: ${this.getPosition().getY()}.`);
	}
	
	// Event who runs when the enemy die.
	#onDeadEvent() {
		console.log(`Enemy.js | ${this.getName()} EVENT_DEAD (uId: ${this.getUId()}) in '${World.getRoomByCode(this.getPosition().getRoomCode()).getName()}' at X: ${this.getPosition().getX()} Y: ${this.getPosition().getY()}.`);
		this.#clearUpdateDaemon();
		this.#removeFromWorld();
		this.#getExternalOnDeadEvent()(this);
		this.#sendDeathPacket();
	}

	// Send a update request
	#sendUpdateRequest() {
		const updateData = [
			Constants.PACKETS.S_ENEMY_UPDATE,
			this.getUId(),
			this.getId(),
			this.getPosition().getX(),
			this.getPosition().getY(),
			this.getPosition().getDirection(),
			this.getState(),
			this.getHP().getCurrentHP(),
			this.getHP().getMaxHP()
		];

		this.#broadcastNearbyCharacters(updateData);
	}

	// Init the update daemon of this enemy.
	#initUpdateDaemon() {
		const newInterval = setInterval( () => this.#sendUpdateRequest(), Config.common.enemy_update_interval_time );
		this.#setUpdateDaemon(newInterval);
	}

	// Clear the update daemon of this enemy.
	#clearUpdateDaemon() {
		clearInterval(this.#getUpdateDaemon());
		clearInterval(this.#dmgDaemon); //CBF TO_DELETE
	}

	//CBF TO_DELETE
	#programmedDeath() {
		const timeToDeath = 10000;//_.random( 1000, 60000 );
		setTimeout( () => {
			this.getHP().receiveDamage( 20 );
		}, timeToDeath );
	}
	//CBF TO_DELETE
	#programmedDmg() {
		const timeToGetDmg = 3000;
		const dmgToGet = _.random(1,2);
		this.#dmgDaemon = setInterval(() => {
			this.getHP().receiveDamage( dmgToGet );
		}, timeToGetDmg);
	}

	//#endregion


}