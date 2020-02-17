'use strict'
const User = use('App/Models/User')
class AuthController {

    loginView({view}){
        return view.render('auth.login')
    }
    registrationView({view}){
        return view.render('auth.register')
    }

    async PostLogin({request, auth, response}){
        await auth.attempt(request.input('email'),request.input('password'))

        return response.route('/')
    }

    async PostRegister({request, session, response}){
        const user = await User.create({
            username:request.input('name'),
            email:request.input('email'),
            password:request.input('password'),
            role_id:1
        })

        session.flash({successmessage:'User have been created'})

        return response.route('login.create')
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
