/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

	Description: Account object, represents a user logged in to the system.
	Contains the characters.

*/

module.exports = Account = class Account {
	
	constructor( _id, _nickname ) {
		this.id = _id;
		this.nickname = _nickname;
		this.characters = [];

		this.loadCharactersFromDB();
	}

	readCharactersFromDB() {

	}
}