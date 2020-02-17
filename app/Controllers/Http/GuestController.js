'use strict'
//Instancia modelo Horchata
const Horchata = use('App/Models/Horchata')
//Instancia modelo Exponent
const Exponent = use('App/Models/Exponent')
class GuestController {
    async showHorchatas({view}){

        //Obtener todos los horchatas con sus respectivos usuarios
      //const horchata = await Horchata.query().with('user').fetch()
      const horchata = await Horchata.query().withCount('topics as total').with('topics').with('user').fetch()
      //return horchata.toJSON()
      /*
        Retorna vista index en la carpeta de resources/views/horchata 
        con la variable horchata que tiene toda la data
      */
      return view.render('guest.horchatas',{
        horchatas:horchata.toJSON(),
      })
    }

}

module.exports = GuestController
