'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.get('/','GuestController.showHorchatas').as('index')


//guest

//auth admin

Route.get('/login','AuthController.loginView').as('login.create')
Route.get('/register','AuthController.registrationView').as('register.create')
Route.post('/register-store','AuthController.PostRegister').as('register.store')
Route.post('/login-store','AuthController.PostLogin').as('login.store')

//Profile
Route.group(()=>{
    Route.get('/me','AuthController.showProfile').as('profile.me')
}).prefix('profile').middleware(['auth'])

//horchata
Route.group(()=>{
    Route.get('/','HorchataController.index').as('horchata.index')
    Route.get('/create','HorchataController.create').as('horchata.new')
    Route.post('/store','HorchataController.store').as('horchata.save')
    Route.get('/:id/presentations/add','HorchataController.createPresentation').as('horchata.add-presentation')
    Route.post('/presentations/add','HorchataController.storePresentation').as('presentation.store')
    Route.get('/:id','HorchataController.show').as('horchata.show')
    Route.get('/:id/edit','HorchataController.edit').as('horchata.edit')
    Route.put('/','HorchataController.update').as('horchata.update')
    Route.delete('/','HorchataController.destroy').as('horchata.destroy')
    Route.post('/logout','AuthController.Logout').as('logout')
}).prefix('horchatas').middleware(['auth'])



//users
Route.group(()=>{
    Route.get('/','UserController.index').as('UserIndex')
}).prefix('users')