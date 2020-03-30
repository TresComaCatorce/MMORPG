/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents one room (or map) in the game.

*/

module.exports = Room = class Room {
	constructor() {
		this.players = [];
	}

	// Quita a todos los clientes del room.
	removeAllClientsFromRoom() {
		this.players.forEach( client => {

		});
		this.players = [];
	}

	//Quita un cliente del room
    removePlayerFromRoom(client) {
        if(client) {
            this.clients = this.clients.filter( (item) => { return item !== client });
        }
        else {
            console.log( "Error removing client from room.".red );
        }
	}
}