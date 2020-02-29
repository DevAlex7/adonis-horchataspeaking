'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  static get hidden(){
    return ['password','created_at','updated_at','role_id']
  }
  
  static currentUser({auth}){
      return {
          id : auth.user.id
      }
  }
  tokens () {
    return this.hasMany('App/Models/Token')
  }
  
  role(){
    return this.belongsTo('App/Models/Role')
  }
  
  quote(){
    return this.hasMany('App/Models/Quote')
  }
  
  //has Many Horchatas
  horchata(){
    return this.hasMany('App/Models/Horchata')
  }
}

module.exports = User
