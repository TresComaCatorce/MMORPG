/*
    Project: MMORPGServer
    Date: 23/03/2020
    Author: Cristian Ferrero

    Description: Character object represents all connected clients to the server, only autenticated.

*/

const Entity = require('./Entity');

module.exports = Character = class Character extends Entity {
	
	constructor( _id, _name ) {
		super( _id, _name );
	}

	
}