/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents all renderizable entity ingame.

*/

module.exports = class Entity {
	constructor( _id, _name ) {
		this.id = _id;
		this.name = _name;
	}
}