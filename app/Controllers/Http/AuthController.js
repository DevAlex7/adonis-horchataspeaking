'use strict'
const User = use('App/Models/User')
const Helpers = use('Helpers')
const {validate}= use('Validator')
class AuthController {

    loginView({view}){
        return view.render('auth.login')
    }
    registrationView({view}){
        return view.render('auth.register')
    }

    async PostLogin({request, auth, response}){
        await auth.attempt(request.input('email'),request.input('password'))

        return response.route('/horchatas')
    }

    async PostRegister({request, session, response}){
        const data = request.only([
            'name',
            'email',
            'password',
            'profile_pic'
        ])
        //user validation
        const rules = {
            name :'required',
            email : 'required|email|unique:users',
            password:'required'
        }
        const validationUserMessages ={
            'name.required' : 'You need to fill the name input',
            'email.required' : 'Email is required',
            'email.email' : 'Bad format for email',
            'email.unique' : 'This email is already exists',
            'password.required':'password is required'
        }

        const validation = await validate(data, rules ,validationUserMessages)

        if(validation.fails()){
            const errors = session.withErrors(validation.messages()).flashAll()
            return response.redirect('back',{
                errors: errors
            })
        }
        
        //image validation
        const validationOptions = {
            types : ['image'],
            size : '2mb',
            extnames:['png','jpeg','jpg']
        }

        const profilePic = request.file('profile_pic', validationOptions)

        await profilePic.move('public/uploads', {
            name: profilePic.clientName,
            overwrite: true
        })
            
        if (!profilePic.moved()) {
            const error = session.withErrors([
                {
                    field: 'photo',
                    message : profilePic.error().message
                }
            ]).flashAll()
            return response.redirect('back',{
                errors : error
            })
        }

        const user = await User.create({
            username:request.input('name'),
            email:request.input('email'),
            password:request.input('password'),
            role_id:1,
            photo:profilePic.clientName
        })

        return response.route('/horchatas')
    }

    async Logout({auth, response}){
        await auth.logout()
        return response.route('/')
    }

    async showProfile({view, response, session, auth}){
        const user = await User.find(auth.user.id)
        const role = await auth.user.role().fetch()
        return view.render('profile.me',{
            user,
            role
        })
    }
}

module.exports = AuthController
