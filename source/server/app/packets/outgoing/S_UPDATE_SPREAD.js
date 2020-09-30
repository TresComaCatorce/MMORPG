/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_UPDATE_SPREAD"

*/

module.exports = packet_S_UPDATE_SPREAD = {
	packetDataTypes: [
		String,	// Packet name
		String,	// Character name
		Number,	// Character X coord
		Number,	// Character Y coord
		Number,	// Character direction
		Number	// Character state
	]
};