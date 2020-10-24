/*
    Project: MMORPGServer
    Date: 16/04/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete 'C_CONNECT_CHARACTER' enviado por el cliente.
	Este paquete contiene un mensaje de chat.

*/

module.exports = packet_C_CHARACTER_CONNECT = {
	process: (client, datapacket) => {

		// Read incoming data, packet model defined in <01_packetmodels.js>.
		var data = PacketModels.character_connect.parse(datapacket);

		client.getAccount().enterGame( data.character_name );
	}
}