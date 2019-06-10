/*
    Proyecto: MMORPGServer
    Fecha: 31/01/2018
    Autor: Cristian Ferrero
*/

//Require de la libreria JS mongoose.
var mongoose = require('mongoose');

//Esquema de la coleccion <user> de la base de datos.
var userSchema = new mongoose.Schema
({
    username : {type: String, unique: true},
    password: String,

    sprite: String,

    current_room: String,
    pos_x: Number,
    pos_y: Number

});

//Registro de nuevo usuario.
userSchema.statics.register = function( username, password, cb)
{
    var new_user = new User
    ({
        username : username,
        password : password,

        sprite : "spr_Hero",

        current_room : maps[config.common.starting_zone].room,
        pos_x : maps[config.common.starting_zone].start_x,
        pos_y : maps[config.common.starting_zone].start_y,
    });

    new_user.save(function(err)
    {
        if(!err)
        {
            cb(true);
        }
        else
        {
            cb(false);
        }
    });
};

//Login de usuario ya existente.
userSchema.statics.login = function( username, password, cb)
{
    console.log("CBF P: ", username, password);
    User.findOne({username: username}, function( err, username )
    {
        if( !err && username )
        {
            if( username.password == password )
            {
                cb( true, username );
            }
            else
            {
                cb( false, null );
            }
        }
        else
        {
            cb( false, null );
        }
    });
}


module.exports = User = gamedb.model( 'User', userSchema );
