'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Auth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth, session }, next) {
    try {
      await auth.check()  
      await next()
    } catch (error) {
        session.flash({message:'Yo should log in'})
        return response.redirect('/login')
    }
    
  }
  
}

module.exports = Auth
