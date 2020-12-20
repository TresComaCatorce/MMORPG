/// scr_nameBoxDraw( parentObject )

//----------------------------------//
//Caja con el nombre del personaje. //
//----------------------------------//
//Si no existe creo una instancia.
if(!instance_exists(argument0.nameBox))
{
    argument0.nameBox = instance_create( argument0.x, argument0.y, obj_characterNameBox );
    with( argument0.nameBox ) {
        argument0.nameBox.playerOwner = argument0;
    }
}
// FIN Caja con el nombre del personaje
//-------------------------------------//
