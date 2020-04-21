/*
    Project: MMORPGServer
    Date: 18/03/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete "C_REGISTER" enviado por el cliente.
	Este paquete contiene una solicitud de registro de una cuenta nueva.
	
*/

module.exports = packet_C_REGISTER = {
	process: (cliente, datapacket) => {
		var data = PacketModels.register.parse(datapacket);
		User.register( data.username, data.password, function(result)
		{
			if(result)
			{
				cliente.broadcastSelf( ['S_REGISTER', true] );
			}
			else
			{
				cliente.broadcastSelf( ['S_REGISTER', false] );
			}
		});
	}
}