/*
    Proyecto: MMORPGServer
    Fecha: 28/03/2020
    Autor: Cristian Ferrero

    Descripcion: World object, contains all maps in it and players connected.

*/

module.exports = World = class World {
	constructor() {
		this.rooms = [];
	}

	// Calls a callback for each map and pass the map as a paremeter to the callback.
	forEachRoom( callBack ) {
		this.rooms.forEach( callBack );
	}
}