/*
    Project: MMORPGServer
    Date: 10/09/2020
    Author: Cristian Ferrero

	Description: Health points functionality to implement in any entity.
	
*/

const Utils = require("./Utils");

module.exports = HPFunctionality = class HPFunctionality {

	//#region CLASS FIELDS DECLARATION
	#currentHP;
	#maxHP;
	#rangeMinHP;
	#rangeMaxHP;
	//#endregion



	//#region CONSTRUCTOR
	constructor({ currentHP, maxHP, rangeMinHP, rangeMaxHP }) {
		this.#setCurrentHP( currentHP );
		this.#setMaxHP( maxHP );
		this.#setRangeMinHP( rangeMinHP );
		this.#setRangeMaxHP( rangeMaxHP );

		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getCurrentHP() {
		return this.#currentHP;
	}

	#setCurrentHP( value ) {
		if( Utils.exist(value) ) {
			if( !isNaN(value) ) {
				const newValue = (value<0) ? 0 : value;
				this.#currentHP = newValue;
			}
			else {
				throw( new Error(` HPFunctionality: attempt to assign 'currentHP' with a NaN value.`) );
			}
		}
	}
	
	getMaxHP() {
		return this.#maxHP;
	}

	#setMaxHP( value ) {
		if( Utils.exist(value) ) {
			if( !isNaN(value) ) {
				if( value>0 ) {
					this.#maxHP = value;
				}
				else {
					throw( new Error(` HPFunctionality: attempt to assign 'maxHP' with a value less than or equal to zero.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality: attempt to assign 'maxHP' with a NaN value.`) );
			}
		}
	}
	
	getRangeMinHP() {
		return this.#rangeMinHP;
	}
	
	#setRangeMinHP( value ) {
		if( Utils.exist(value) ) {
			if( !isNaN(value) ) {
				if( value>0 ) {
					this.#rangeMinHP = value;
				}
				else {
					throw( new Error(` HPFunctionality: attempt to assign 'rangeMinHP' with a value less than or equal to zero.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality: attempt to assign 'rangeMinHP' with a NaN value.`) );	
			}
		}
	};
	
	getRangeMaxHP() {
		return this.#rangeMaxHP;
	}
	
	#setRangeMaxHP( value ) {
		if( Utils.exist(value) ) {
			if( !isNaN(value) ) {
				if( value>0 && value>=this.getRangeMinHP() ) {
					this.#rangeMaxHP = value;
				}
				else {
					throw( new Error(` HPFunctionality: attempt to assign 'rangeMaxHP' with a value less than, equal to zero or less than 'rangeMinHP'.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality: attempt to assign 'rangeMaxHP' with a NaN value.`) );
			}
		}
	}
	//#endregion
	
	
	
	//#region METHODS
	#init() {
		this.#randomizeHP();
	}
	
	#canRandomizeHP() {
		return ( Utils.exist(this.getRangeMinHP()) && Utils.exist(this.getRangeMaxHP()) );
	}
	
	#randomizeHP() {
		if( this.#canRandomizeHP() ) {
			const auxRandomHP = _.random( this.getRangeMinHP(), this.getRangeMaxHP() );
			this.#setCurrentHP( auxRandomHP );
			this.#setMaxHP( auxRandomHP );
		}
	}
	
	isAlive() {
		return (this.getCurrentHP()>0);
	}
	
	// Receive damage
	receiveDamage( damageToReceive ) {
		if( Utils.exist(damageToReceive) ) {
			if( !isNaN(damageToReceive) ) {
				if( this.isAlive() ) {
					let auxNewCurrentHP = this.getCurrentHP() - damageToReceive;
					this.#setCurrentHP( auxNewCurrentHP );
				}
			}
			else {
				throw( new Error(` HPFunctionality: attempt to receive damage with a NaN value.`) );
			}
		}
	}
	//#endregion
};