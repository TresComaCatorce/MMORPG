//----------------------------------//
//Caja con el nombre del personaje. //
//----------------------------------//
//Si no existe creo una instancia.
if(!instance_exists(argument0.nameBox))
{
    argument0.nameBox = instance_create( argument0.x, argument0.y, obj_Player_Name_Box );
    
    //Guardo la referencia al jugador en el objeto de la caja del nombre.
    with( argument0.nameBox )
    {
        padre = argument0;
    }
}
// FIN Caja con el nombre del personaje
//-------------------------------------//
