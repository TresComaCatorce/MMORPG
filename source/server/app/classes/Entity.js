/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents all renderizable entity ingame.

*/

module.exports = class Entity {
	constructor( _id, name, current_room, pos_x, pos_y ) {
		this.id = _id;
		this.name = name;
		this.current_room = current_room;
		this.pos_x = pos_x;
		this.pos_y = pos_y;
	}
}