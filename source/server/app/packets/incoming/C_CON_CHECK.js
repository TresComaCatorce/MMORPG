/*
    Project: MMORPGServer
    Date: 21/03/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete 'C_CON_CHECK' enviado por el cliente.
	Este paquete contiene un mensaje de chat.

*/

module.exports = packet_C_CON_CHECK = {
	process: ( client, datapacket ) => {
		//Utilizo el 'PacketModel' de update de posicion (definido en <01_packetmodels.js>).
		const data = PacketModels.connection_check.parse(datapacket);
				
		//Se envia la respuesta al cliente
		client.broadcastSelf( [Constants.PACKETS.S_CON_CHECK, data.key] );
	}
}