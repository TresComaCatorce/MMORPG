
/*
    Project: MMORPGServer
    Date: 10/09/2020
    Author: Cristian Ferrero

	Description: Position functionality to implement in any entity.
	
*/

const Utils = require("./Utils");

module.exports = Position = class Position {

	//#region CLASS FIELDS DECLARATION
	#x;
	#y;
	#roomCode;
	#direction;
	//#endregion



	//#region CONSTRUCTOR
	constructor({ x, y, roomCode, direction }) {
		this.#setX(x);
		this.#setY(y);
		this.#setRoomCode( roomCode );
		this.#setDirection( direction );
	}
	//#endregion



	//#region GETTERS & SETTERS
	getX() {
		return this.#x;
	}
	#setX( value ) {
		if( Utils.exist(value) ) {
			if( !isNaN(value) ) {
				if( value>=0 ) {
					this.#x = value;
				}
				else {
					throw( new Error(` Position: attempt to assign 'x' with a value less than zero.`) );
				}
			}
			else {
				throw( new Error(` Position: attempt to assign 'x' with a NaN value.`) );
			}
		}
	}

	getY() {
		return this.#y;
	}
	#setY( value ) {
		if( Utils.exist(value) ) {
			if( !isNaN(value) ) {
				if( value>=0 ) {
					this.#y = value;
				}
				else {
					throw( new Error(` Position: attempt to assign 'y' with a value less than zero.`) );
				}
			}
			else {
				throw( new Error(` Position: attempt to assign 'y' with a NaN value.`) );
			}
		}
	}
	
	getRoomCode() {
		return this.#roomCode;
	}
	
	#setRoomCode( value ) {
		if( Utils.exist(value) ) {
			console.warn("CBF Position setRoomCode TODO validation")
			if( true ) {
				this.#roomCode = value;
			}
			else {
				throw( new Error(` Position: attempt to assign invalid 'roomCode' value.`) );
			}
		}
	}

	getDirection() {
		return this.#direction;
	}

	#setDirection( value ) {
		this.#direction = this.#determineDirection( value );
	}
	//#endregion



	//#region METHODS
	#determineDirection( valueToSet ) {
		let retorno = valueToSet;
		if( isNaN(valueToSet) || valueToSet<0 || valueToSet>7 ) {
			retorno = _.random( 0, 7 );
		}
		return retorno;
	}
	//#endregion	
};