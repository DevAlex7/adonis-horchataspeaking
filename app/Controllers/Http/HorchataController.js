'use strict'
//Instancia modelo Horchata
const Horchata = use('App/Models/Horchata')
//Instancia modelo User
const User = use('App/Models/User')
//Instancia modelo Exponent
const Exponent = use('App/Models/Exponent')
//Instancia de metodos del validator
const {validate}= use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with horchatas
 */
class HorchataController {
  /**
   * Show a list of all horchatas.
   * GET horchatas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, auth ,response, view }) {

      //Obtener todos los horchatas con sus respectivos usuarios
      //const horchata = await Horchata.query().with('user').fetch()
      const horchata = await Horchata.query().withCount('topics as total').with('topics').with('user').fetch()
      //return horchata.toJSON()
      /*
        Retorna vista index en la carpeta de resources/views/horchata 
        con la variable horchata que tiene toda la data
      */
      return view.render('horchata.index',{
        horchatas:horchata.toJSON(),
      })
  }

  /**
   * Render a form to be used for creating a new horchata.
   * GET horchatas/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    //de una vista create en resources/views/horchata que es el formulario para crear el horchata
    return view.render('horchata.create')
  }

  /**
   * Render a form to be used for creating a new horchata.
   * GET horchatas/:id/presentations/add
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async createPresentation ({ request, params ,response, view }) {
      /*
        Retorna una vista add-presentation en resources/views/presentations 
        que es el formulario para crear la ponencia de el horchata 
      */
      const getHorchata = await Horchata.find(params.id)  
      if(getHorchata){
        return view.render('presentations.add-presentation',{
          horchata : getHorchata.toJSON()
        })
      }
      else{
        return response.redirect('/horchatas')
      }
  }
/**
   * Create/save a new horchata.
   * POST horchatas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async storePresentation ({ request, response, session, auth }) {
    try {
      const data = request.only([
        'horchata_id',
        'nameSpeaker',
        'hourSpeaker',
        'topic'
      ])
  
      const messages = {
        'nameSpeaker.required' : 'You must fill the name for speaker',
        'hourSpeaker.required' : 'Your must fill the hour for the speaker',
        'topic.required' : 'You must fill the topic for the speaker'
      }
  
  
      const validation = await validate(data,{
        nameSpeaker:'required',
        hourSpeaker:'required',
        topic:'required'
      },messages) 

      if (validation.fails()) {
        const errors = session.withErrors(validation.messages()).flashAll()
        return response.redirect('back',{
          errors : errors
        })
      }

      const exponent = await Exponent.create({
          speaker: request.input('nameSpeaker'),
          hour : request.input('hourSpeaker'),
          topic : request.input('topic'),
          horchata_id : request.input('horchata_id') 
      })

      session.flash({
        'success' : 'Horchata presentation has been added!'
      })
      
      return response.redirect(`/horchatas/`+data.horchata_id)

    } catch (error) {
        return error      
    }
  }
  /**
   * Create/save a new horchata.
   * POST horchatas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, session, auth }) {
    const data = request.only([
          'nameHorchata',
          'date',
          'place'
    ])

    const messages = {
      'nameHorchata.required' : 'You must fill the Horchata session',
      'date.required' : 'Your must fill the date Horchata session',
      'place.required' : 'You must fill the Horchata place'
    }
    
    const validation = await validate(data,{
      nameHorchata:'required',
      date:'required',
      place:'required'
    },messages)

    if (validation.fails()) {
      const errors = session.withErrors(validation.messages()).flashAll()
      return response.redirect('back',{
        errors : errors
      })
    }

    const horchata = await Horchata.create({
        name: request.input('nameHorchata'),
        date : request.input('date'),
        place : request.input('place'),
        user_id : auth.user.id 
    })

    session.flash({
      'success' : '¡Horchata session has been added!'
    })

    return response.redirect('/horchatas')

  }

  /**
   * Display a single horchata.
   * GET horchatas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response, view, session }) {
      const getHorchata = await Horchata.find(params.id)
      if(getHorchata){
        const charlas = await getHorchata.topics().fetch()
        return view.render('horchata.view-horchata',{
            horchata : getHorchata.toJSON(),
            charlas : charlas.toJSON()
        })
      }
      else{
        session.flash({
          'fail' : "We didn't find your horchata sorry :( "
        })
        return response.redirect('/horchatas')
      }
  }

  /**
   * Render a form to update an existing horchata.
   * GET horchatas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
    const getHorchata = await Horchata.find(params.id)
    if(getHorchata){
      return view.render('horchata.edit',{
          horchata : getHorchata.toJSON(),
      })
    }
    else{
      session.flash({
        'fail' : "We didn't find your horchata sorry :( "
      })
      return response.redirect('/horchatas')
    }
  }

  /**
   * Update horchata details.
   * PUT or PATCH horchatas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, session }) {
    const data = request.only([
      'horchata_id',
      'nameHorchata',
      'date',
      'place'
    ])

  const messages = {
    'nameHorchata.required' : 'You must fill the Horchata session',
    'date.required' : 'Your must fill the date Horchata session',
    'place.required' : 'You must fill the Horchata place'
  }

  const validation = await validate(data,{
    nameHorchata:'required',
    date:'required',
    place:'required'
  },messages)

  if (validation.fails()) {
    const errors = session.withErrors(validation.messages()).flashAll()
    return response.redirect('back',{
      errors : errors
    })
  }
  const horchata = await Horchata.find(data.horchata_id)
  horchata.name = data.nameHorchata
  horchata.date = data.date
  horchata.place = data.place

  const save = await horchata.save()

  if(save){
    session.flash({
      'success' : 'Your horchata event has been updated!'
    })
  }
  else{
    session.flash({
      'fail' : save
    })
  }
  

  return response.redirect('back')

  }

  /**
   * Delete a horchata with id.
   * DELETE horchatas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, session }) {
      try {
        const horchata = await Horchata.find(request.all().id)

        await horchata.delete()

        await horchata.topics().delete()

        session.flash({
          'success' : 'Your horchata event has been deleted!'
        })

        return response.redirect('back')
      } catch (error) {
        session.flash({
          'fail' : error
        })
        return response.redirect('back')
      }
  }
  async destroyExponent ({params, request, response, session}){
      try {
        const data = request.only(['id'])
      } catch (error) {
        
      }
  }
}

module.exports = HorchataController
