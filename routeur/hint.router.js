let cors = require('cors')
let HintController = require('../controllers/hint.controller.js')

module.exports = function(app) {
 
    app.use(cors())
    const hintController = new HintController()

    app.post('/hints/create', hintController.createHint)
    app.get('/hints/', hintController.getHints)
    app.post('/hints/getHint', hintController.getHint)
}