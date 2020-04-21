/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Various utils functions.

*/

module.exports = class Utils {
	constructor() {
	}

	isEmail( input ) {
		return input && typeof input === 'string' && input.match( new RegExp(Config.common.validations.account_email.regex) );
	}

	formatDateWithHours( dateToFormat ) {
		const options = {
			year: 'numeric', month: '2-digit', day: '2-digit',
			hour: '2-digit', minute: '2-digit', second: '2-digit',
			hour12: false
		};
		return new Intl.DateTimeFormat('en-US', options).format( new Date(dateToFormat) );
	}
}