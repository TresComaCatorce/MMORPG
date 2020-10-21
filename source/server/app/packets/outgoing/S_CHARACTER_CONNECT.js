/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_CHARACTER_CONNECT"

*/

module.exports = packet_S_CHARACTER_CONNECT = {
	packetDataTypes: [
		String,	// Packet name
		String,	// Character name
		Number,	// Character level
		Number,	// Character race
		Number,	// Room code
		Number,	// Character X coord
		Number,	// Character Y coord
		Number,	// Character current HP
		Number,	// Character max HP
		Number,	// Character current mana points
		Number,	// Character max mana points
		Number,	// Character current experience points
		Number	// Character next level experience points
	]
};