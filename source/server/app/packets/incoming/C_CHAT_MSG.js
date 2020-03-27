/*
    Proyecto: MMORPGServer
    Fecha: 18/03/2020
    Autor: Cristian Ferrero

	Descripcion: Handler que maneja la recepción del paquete "C_CHAT_MSG" enviado por el cliente.
	Este paquete contiene un mensaje de chat.

*/

module.exports = packet_C_CHAT_MSG = {
	process: (cliente, datapacket) => {
		//Utilizo el "PacketModel" de update de posicion (definido en <01_packetmodels.js>).
		var data = PacketModels.chat_message.parse(datapacket);

		console.log("CBF C_CHAR_MSG: ", data);

		//Se envia la respuesta a los clientes que correspondan
		switch (data.type) {
			case Constants.CHAT.CHAT_MSG_TYPES.CHAT: {
				cliente.broadcastNearby([
					Constants.PACKETS.S_CHAT_MSG,
					true,
					data.pj_name,
					data.message,
					data.type
				], true);
				break;
			}
			case Constants.CHAT.CHAT_MSG_TYPES.GLOBAL: {
				break;
			}
			case Constants.CHAT.CHAT_MSG_TYPES.WHISPER: {
				break;
			}
			default: {

			}
		}
	}
}