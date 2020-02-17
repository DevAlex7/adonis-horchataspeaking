'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExponentsSchema extends Schema {
  up () {
    this.create('exponents', (table) => {
      table.increments()
      table.string('speaker')
      table.string('hour')
      table.string('topic')
      table.integer('horchata_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('exponents')
  }
}

module.exports = ExponentsSchema
