/*
    Project: MMORPGServer
    Date: 18/03/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete 'C_CHAT_MSG' enviado por el cliente.
	Este paquete contiene un mensaje de chat.

*/

module.exports = packet_C_CHAT_MSG = {
	process: (client, datapacket) => {
		// Use the 'PacketModel' defined in <01_packetmodels.js>.
		const data = PacketModels.chat_message.parse(datapacket);

		// Send confirmation to the same client
		const dataToSend = [
			Constants.PACKETS.S_CHAT_MSG,
			true,
			data.message_text,
			data.message_type
		];
		client.getAccount().getCharacterOnline().broadcastSelf(dataToSend);

		// Spread message to another clients
		switch (data.message_type) {
			case Constants.CHAT.CHAT_MSG_TYPES.CHAT: {
				const sendToSelf = false;
				client.getAccount().getCharacterOnline().broadcastNearby([
					Constants.PACKETS.S_CHAT_MSG_SPREAD,
					data.character_name,
					data.message_text,
					data.message_type
				], sendToSelf);
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