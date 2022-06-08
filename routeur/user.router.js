let cors = require('cors')
let UserController = require('../controllers/user.controller.js')

module.exports = function(app) {
 
    app.use(cors())
    const userController = new UserController()

    app.post('/users/register', userController.createUser)
    app.get('/users/getUsers', userController.getUsers)
    app.put('/users/updateUser', userController.updateUser)
    app.post('/users/login', userController.login)
    app.put('/users/logout', userController.logoutUser)
    app.post('/users/getHint', userController.getCurrentHint)
}