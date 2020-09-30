/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_CHAT_MSG"

*/

module.exports = packet_S_CHAT_MSG = {
	packetDataTypes: [
		String,	// Packet name
		Boolean,// 
		String,	// Message text
		Number	// Message type
	]
};