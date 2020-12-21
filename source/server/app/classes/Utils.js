/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Various utils functions.

*/

module.exports = class Utils {
	constructor() {
	}

	exist( value ) {
		return (value!==undefined && value!==null);
	}

	isValidEmail( input ) {
		return input && typeof input === 'string' && input.match( new RegExp(Config.common.validations.account_email.regex) );
	}

	isValidDirection( value ) {
		return ( typeof value == 'number' && value>=0 && value <= 7 )
	}

	formatDateWithHours( dateToFormat ) {
		const options = {
			year: 'numeric', month: '2-digit', day: '2-digit',
			hour: '2-digit', minute: '2-digit', second: '2-digit',
			hour12: false
		};
		return new Intl.DateTimeFormat('en-US', options).format( new Date(dateToFormat) );
	}

	isNotEmptyArray( value ) {
		return (Array.isArray(value) && value.length>0);
	}

	isValidPlayerState(value) {
		// console.log("CBF Constants: ", Constants.STATES.CHARACTER);
		return true;
	}

	isValidEnemyState(value) {
		// console.log("CBF Constants: ", Constants.STATES.ENEMY);
		return true;
	}

	getDistanceBetweenPoints({x1, y1, x2, y2}) {
		if( isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2) ) {
			throw new Error(`Attempt to calculate between invalid points | P1: x->${x1} y->${y1} P2: x->${x2} y->${y2}`);
		}

		const distXPow2 = Math.pow( Math.abs( x1 - x2 ), 2 );
		const distYPow2 = Math.pow( Math.abs( y1 - y2 ), 2 );
		const summation = distXPow2 + distYPow2;

		return Math.pow(summation, .5);
	}
}