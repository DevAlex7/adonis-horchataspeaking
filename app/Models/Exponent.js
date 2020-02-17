'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exponent extends Model {
    horchata(){
        return this.belongsTo('App/Model/Horchata')
    }
}

module.exports = Exponent
