/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_ENEMY_SPAWN"

*/

module.exports = packet_S_ENEMY_SPAWN = {
	packetDataTypes: [
		String, // Packet name
		String, // uuId
		String, // Enemy ID
		Number, // Coord X
		Number, // Coord Y
		Number, // Direction
		Number  // Max HP
	]
};