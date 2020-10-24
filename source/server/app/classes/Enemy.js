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
	#HP;
	#spawnerAsociated;
	#externalOnDeadEvent;
	//#endregion



	//#region CONSTRUCTOR
	constructor( params={} ) {
		const { id, x, y, roomCode, direction, spawnerAsociated, onDeadEvent=()=>{} } = params;
		super({ id });
		this.#setPosition( new Position({ x, y, roomCode, direction }) );
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
	//#endregion



	//#region METHODS
	#init() {
		this.#loadEnemyDataFromConfigJson();
		this.#addToWorld();
		this.#onSpawnEvent();
		
		// CBF only to test
		this.#programmedDeath();
	}
	
	// Load the data from "entities.json" file
	#loadEnemyDataFromConfigJson() {
		const entityObj = Config.entities.getEntityById( this.getId() );
		if( entityObj ) {
			const { minHp, maxHp } = entityObj;
			const hpParams = {
				rangeMinHP: minHp,
				rangeMaxHP: maxHp,
				onDeadEvent: this.#onDeadEvent.bind(this)
			};
			this.#setHP( new HPFunctionality(hpParams) );
		}
		else {
			throw( new Error(` Enemy.js | entityId: '${this.getId()}' not found in <entities.json> file.`) );
		}
	}
	

	// Send a packet to all characters where are nearby to this Entity.
	// @param <Array> 'packetData': Data to send.
	#broadcastNearbyCharacters( data ) {
		World.forEachCharacterInRoom( this.getPosition().getRoomCode(), ( characterInRoom ) => {
			const distX = Math.abs( characterInRoom.getPosition().getX() - this.getPosition().getX() );
			const distY = Math.abs( characterInRoom.getPosition().getY() - this.getPosition().getY() );

			if( distX<Config.common.nearby_distance.horizontal && distY<Config.common.nearby_distance.vertical ) {
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

	// Send S_ENEMY_SPAWN packet to nearby clients
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
	
	// Event who runs when the enemy spawn.
	#onSpawnEvent() {
		this.#sendSpawnPacket();
		console.log(`Enemy.js | ${this.getName()} (uId: ${this.getUId()}) spawned in '${World.getRoomByCode(this.getPosition().getRoomCode()).getName()}' at X: ${this.getPosition().getX()} Y: ${this.getPosition().getY()}.`);
	}

	// Event who runs when the enemy die.
	#onDeadEvent() {
		this.#removeFromWorld();
		this.#getExternalOnDeadEvent()(this);
	}

	#programmedDeath() {
		setTimeout( () => {
			this.getHP().receiveDamage( 20 );
		}, _.random( 1000, 5000 ));
	}
	//#endregion


}