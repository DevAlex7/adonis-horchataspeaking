'use strict'

class TestController {
    async sayHello({response}){
        return response.send('Hola horchata')
    }
}

module.exports = TestController
