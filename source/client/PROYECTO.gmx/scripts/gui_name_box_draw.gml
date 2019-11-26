//----------------------------------//
//Caja con el nombre del personaje. //
//----------------------------------//
//Si no existe creo una instancia.
if(!instance_exists(argument0.nameBox))
{
    argument0.nameBox = instance_create( argument0.x, argument0.y, obj_Player_Name_Box );
}
// FIN Caja con el nombre del personaje
//-------------------------------------//
