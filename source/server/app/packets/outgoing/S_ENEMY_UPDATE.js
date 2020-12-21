/*
    Project: MMORPGServer
    Date: 17/12/2020
    Author: Cristian Ferrero

	Description: Packet "S_ENEMY_UPDATE"

*/

module.exports = packet_S_ENEMY_UPDATE = {
	packetDataTypes: [
		String, // Packet name
		String, // uuId
		String, // Enemy ID
		Number, // Coord X
		Number, // Coord Y
		Number, // Direction
		String, // State
		Number, // Current HP
		Number, // Max HP
	]
};