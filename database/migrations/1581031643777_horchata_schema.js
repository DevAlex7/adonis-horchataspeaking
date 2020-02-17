'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HorchataSchema extends Schema {
  up () {
    this.create('horchatas', (table) => {
      table.increments()
      table.string('name')
      table.string('date')
      table.string('place')
      table.integer('user_id').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('horchatas')
  }
}

module.exports = HorchataSchema
