'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Horchata extends Model {    
    user(){
        return this.belongsTo('App/Models/User')
    }   
    topics(){
        return this.hasMany('App/Models/Exponent')
    }
}

module.exports = Horchata
