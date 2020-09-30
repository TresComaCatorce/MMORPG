/*
    Project: MMORPGServer
    Date: 25/09/2020
    Author: Cristian Ferrero

	Description: Packet "S_HELLO"

*/

module.exports = packet_S_HELLO = {

	packetDataTypes: [
		String,
		String
	]

	// validate: function(packetData) {

	// 	// Validate packet length
	// 	if( packetData.length != this.packetDataTypes.length ) {
	// 		throw( new Error(` S_HELLO.js | Invalid packet length.`) );
	// 	}
		
	// 	// Validate packet name
	// 	if( packetData[0] != Constants.PACKETS.S_HELLO ) {
	// 		throw( new Error(` S_HELLO.js | Error processing packet name.`) );
	// 	}

	// 	// Validate packet data type
	// 	for( let i=0 ; i<packetData.length ; i++ ) {
	// 		const item = packetData[i];
	// 		const itemTypeof = (typeof item);
	// 		if( itemTypeof.toLowerCase() != this.packetDataTypes[i].name.toLowerCase() ) {
	// 			throw( new Error(` S_HELLO.js | Invalid data type '${itemTypeof}' at index: ${i}`) );
	// 		}
	// 	}

	// 	return packetData;
	// }
};