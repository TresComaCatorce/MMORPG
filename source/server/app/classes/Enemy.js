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
		console.log(`CBF || ${this.getName()} spawned at X: ${this.getPosition().getX()} Y: ${this.getPosition().getY()}.`);
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
		this.#programmedDeath();
	}
	
	loadEnemyDataFromConfigJson( entityObj ) {
		const { minHp, maxHp } = entityObj;
		const hpParams = {
			rangeMinHP: minHp,
			rangeMaxHP: maxHp,
		};
		this.#setHP( new HPFunctionality(hpParams) );
	}

	loadEnemyTypeDataFromConfigJson( entityTypeObj ) {

	}

	#programmedDeath() {
		// setTimeout( () => {
		// 	this.receiveDamage( this.currentHp );
		// }, 3000);
	}
	//#endregion


}