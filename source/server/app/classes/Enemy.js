/*
    Project: MMORPGServer
    Date: 17/08/2020
    Author: Cristian Ferrero

    Description: All enemies in game.

*/

const Entity = require('./Entity');
const Position = require('./Position');
const HPFunctionality = require('./HPFunctionality');

module.exports = Enemy = class Enemy extends Entity {

	//#region CLASS FIELDS DECLARATION
	#position;
	#HP;
	//#endregion



	//#region CONSTRUCTOR
	constructor( params={} ) {
		const { id, x, y, roomCode, direction } = params;
		super({ id });
		this.#setPosition( new Position({ x, y, roomCode, direction }) );
		this.#init();
		console.log(`CBF || ${this.getName()} spawned in '${World.getRoomByCode(this.getPosition().getRoomCode()).getName()}' at X: ${this.getPosition().getX()} Y: ${this.getPosition().getY()}.`);
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
	//#endregion



	//#region METHODS
	#init() {
		this.#loadEnemyDataFromConfigJson();
		this.#programmedDeath();
		this.#addToWorld();
	}
	
	
	#loadEnemyDataFromConfigJson() {
		const entityObj = Config.entities.getEntityById( this.getId() );
		if( entityObj ) {
			const { minHp, maxHp } = entityObj;
			const hpParams = {
				rangeMinHP: minHp,
				rangeMaxHP: maxHp,
				onDeadEvent: this.onDead.bind(this)
			};
			this.#setHP( new HPFunctionality(hpParams) );
		}
		else {
			throw( new Error(` Enemy.js | entityId: '${this.getId()}' not found in <entities.json> file.`) );
		}
	}

	loadEnemyTypeDataFromConfigJson( entityTypeObj ) {

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

	onDead() {
		this.#removeFromWorld();
	}

	#programmedDeath() {
		setTimeout( () => {
			this.getHP().receiveDamage( 20 );
		}, 5000);
	}
	//#endregion


}