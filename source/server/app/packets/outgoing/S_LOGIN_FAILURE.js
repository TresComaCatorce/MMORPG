/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_LOGIN_FAILURE"

*/

module.exports = packet_S_LOGIN_FAILURE = {
	packetDataTypes: [
		String,	// Packet name
		String	// Message
	]
};