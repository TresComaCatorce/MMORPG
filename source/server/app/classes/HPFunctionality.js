/*
    Project: MMORPGServer
    Date: 10/09/2020
    Author: Cristian Ferrero

	Description: Health points functionality to implement in any entity.
	
*/

const _ = require('underscore');

module.exports = HPFunctionality = class HPFunctionality {

	//#region CLASS FIELDS DECLARATION
	#currentHP;
	#maxHP;
	#rangeMinHP;
	#rangeMaxHP;
	#onDeadEvent
	//#endregion



	//#region CONSTRUCTOR
	constructor({ currentHP, maxHP, rangeMinHP, rangeMaxHP, onDeadEvent=()=>{} }) {
		this.#setCurrentHP( currentHP );
		this.#setMaxHP( maxHP );
		this.#setRangeMinHP( rangeMinHP );
		this.#setRangeMaxHP( rangeMaxHP );
		this.#setOnDeadEvent( onDeadEvent );

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
				(newValue == 0) ? this.#getOnDeadEvent()() : undefined;
			}
			else {
				throw( new Error(` HPFunctionality.js | Attempt to assign 'currentHP' with a NaN value.`) );
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
					throw( new Error(` HPFunctionality.js | Attempt to assign 'maxHP' with a value less than or equal to zero.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality.js | Attempt to assign 'maxHP' with a NaN value.`) );
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
					throw( new Error(` HPFunctionality.js | Attempt to assign 'rangeMinHP' with a value less than or equal to zero.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality.js | Attempt to assign 'rangeMinHP' with a NaN value.`) );	
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
					throw( new Error(` HPFunctionality.js | Attempt to assign 'rangeMaxHP' with a value less than, equal to zero or less than 'rangeMinHP'.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality.js | Attempt to assign 'rangeMaxHP' with a NaN value.`) );
			}
		}
	}
	
	#getOnDeadEvent() {
		return this.#onDeadEvent;
	}
	
	#setOnDeadEvent( value ) {
		if( typeof value == 'function' ) {
			this.#onDeadEvent = value;
		}
		else {
			throw( new Error(` HPFunctionality.js | Attempt to assign 'onDeadEvent' with a non 'function' value.`) );
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
	
	// 
	isAlive() {
		return (this.getCurrentHP()>0);
	}
	
	// Receive damage.
	// @param <number> 'damageToReceive': HP points to substract to the currentHp.
	// @return <number|undefined> 'currentHp': HP value after the damage calculation, 'undefined' if is already dead.
	receiveDamage( damageToReceive ) {
		let returnValue;
		if( Utils.exist(damageToReceive) ) {
			if( !isNaN(damageToReceive) ) {
				if( damageToReceive>=0 ) {
					if( this.isAlive() ) {
						let auxNewCurrentHP = this.getCurrentHP() - damageToReceive;
						console.log(`HPFunctionality.js | receiveDamage | damageToReceive: ${damageToReceive} | ${this.getCurrentHP()}/${this.getMaxHP()} -> ${auxNewCurrentHP<0?0:auxNewCurrentHP}/${this.getMaxHP()}`);
						this.#setCurrentHP( auxNewCurrentHP );
						returnValue = this.getCurrentHP();
					}
				}
				else {
					throw( new Error(` HPFunctionality.js | Attempt to receive damage with a negative value.`) );
				}
			}
			else {
				throw( new Error(` HPFunctionality.js | Attempt to receive damage with a NaN value.`) );
			}
		}
		return returnValue;
	}
	//#endregion
};