/*
    Proyecto: MMORPGServer
    Fecha: 18/03/2020
    Autor: Cristian Ferrero

	Descripcion: Handler que maneja la recepción del paquete "C_CHAT_MSG" enviado por el cliente.
	Este paquete contiene un mensaje de chat.

*/

module.exports = packet_C_CHAT_MSG = {
	process: ( cliente, datapacket ) => {
		//Utilizo el "PacketModel" de update de posicion (definido en <01_packetmodels.js>).
		var data = PacketModels.chat_message.parse(datapacket);
				
		//Se envia la respuesta al cliente
		var packetToSend = packetManager.build( ["S_CHAT_MSG", "TRUE", data.message] );
		cliente.broadcastSelf(packetToSend);
	}
}