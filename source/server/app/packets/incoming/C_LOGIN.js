/*
    Proyecto: MMORPGServer
    Fecha: 18/03/2020
    Autor: Cristian Ferrero

	Descripcion: Handler que maneja la recepción del paquete "C_LOGIN" enviado por el cliente.
	Este paquete contiene una solicitud de login con una cuenta.

*/

module.exports = packet_C_LOGIN = {

	process: ( cliente, datapacket ) => {

		//Se leen los datos recibidos.
		const data = PacketModels.login.parse( datapacket );
		
		//Se busca el usuario en la DB.
		User.login( data.username, data.password, function( result, user )
		{
			let is_kernel_buffer_full;
		
			//Si los datos de login son correctos.
			if( result )
			{
				//Se guarda el objecto user en el cliente (se utiliza para persistir los datos).
				cliente.user = user;
		
				//Se guarda el ID del user en la DB dentro del cliente.
				cliente.id = user._id.toString();
		
				//Ingresa al room correspondiente.
				cliente.enterRoom( cliente.user.current_room );
		
				//Informa el ingreso a los demas clientes.
				cliente.broadcastRoom( ['S_UPDATE', cliente.user.username, cliente.user.pos_x, cliente.user.pos_y, 0, 0] );
				//cliente.broadcastRoom( cliente.user.username, cliente.user.pos_x, cliente.user.pos_y, 0, 0 ) //direccion y status = 0
		
				is_kernel_buffer_full = cliente.broadcastSelf( ['S_LOGIN', true, cliente.id, cliente.user.current_room, cliente.user.pos_x, cliente.user.pos_y, cliente.user.username] );
			}
			else //Si los datos de login son incorrectos.
			{
				is_kernel_buffer_full = cliente.broadcastSelf( ['S_LOGIN', false] );
			}
		
			if(!is_kernel_buffer_full)
			{
				socket.pause();
			}
		});
	}
}
