/*
    Proyecto: MMORPGServer
    Fecha: 31/01/2019
    Autor: Cristian Ferrero

    Esquema de la coleccion <user> de la base de datos.n
*/

//Require de la libreria JS mongoose.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema
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
userSchema.statics.login = async ( username, password, cb) => {
    User.findOne({username: username}, ( err, useData ) => {
        if( !err && useData ) {
            if( useData.password == password ) {
                cb( true, useData );
            }
            else {
                cb( false, null );
            }
        }
        else {
            cb( false, null );
        }
    });
}


module.exports = User = gamedb.model( 'User', userSchema );
