const Router = require('express');
const userController = require('../controllers/user-controller');
const {body} = require('express-validator')
const authMiddleWare = require('../middlewares/auth-middleware');

const router = new Router();

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleWare,
    userController.getUsers);
router.post('/todos',
    userController.createTodo);
router.get('/todo',
    userController.getTodos)

module.exports = router