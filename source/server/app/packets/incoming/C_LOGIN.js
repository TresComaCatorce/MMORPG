/*
    Project: MMORPGServer
    Date: 18/03/2020
    Author: Cristian Ferrero

	Description: Handler que maneja la recepción del paquete "C_LOGIN" enviado por el cliente.
	Este paquete contiene una solicitud de login con una cuenta.

*/

module.exports = packet_C_LOGIN = {

	process: ( cliente, datapacket ) => {

		//Se leen los datos recibidos.
		const data = PacketModels.login.parse( datapacket );
		
		//Se busca el usuario en la DB.
		AccountModel.login( data.nickname, data.password, ( _result, _account ) => {
			let is_kernel_buffer_full;
		
			//Si los datos de login son correctos.
			if( _result )
			{
				//Se guarda el objecto user en el cliente (se utiliza para persistir los datos).
				cliente.account = _account;
		
				//Ingresa al room de selección de personaje.
				cliente.enterRoom( Constants.ROOMS.SELECT_CHARACTER );
		
				is_kernel_buffer_full = cliente.broadcastSelf( [Constants.PACKETS.S_LOGIN, true, cliente.account.id, cliente.account.current_room, cliente.user.pos_x, cliente.user.pos_y, cliente.user.username] );
			}
			else //Si los datos de login son incorrectos.
			{
				is_kernel_buffer_full = cliente.broadcastSelf( [Constants.PACKETS.S_LOGIN, false] );
			}
		
			if(!is_kernel_buffer_full)
			{
				socket.pause();
			}
		});
	}
};
