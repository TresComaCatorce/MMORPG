/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_CLOSE_GAME"

*/

module.exports = packet_S_CLOSE_GAME = {
	packetDataTypes: [
		String,	// Packet name
		String	// Diconnection message
	]
};