/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_CHAT_MSG_SPREAD"

*/

module.exports = packet_S_CHAT_MSG_SPREAD = {
	packetDataTypes: [
		String,	// Packet name
		String,	// Character name
		String,	// Message text
		Number	// Message type
	]
};