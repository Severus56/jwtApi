const userService = require('../services/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
    async register(req, res, next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации | Validation Error', errors.array()))
            }
            const{email, password} = req.body;
            const userData = await userService.register(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30*24*60*60*1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next){
        try {
            const{email, password} = req.body;
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30*24*60*60*1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken');
            return res.json(200);
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30*24*60*60*1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next){
        try {
            const users = await userService.getAllUsers()
            return res.json(users);
        } catch (e) {
            next(e)
        }
    }

    async getTodos(req, res, next){
        try {
            const {refreshToken} = req.cookies;
            const todos = await userService.getTodos(refreshToken)
            return res.json(todos);
        } catch (e) {
            next(e)
        }
    }
    
    async createTodo(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const{title, desc} = req.body
            const todo = userService.createTodo(title, desc, refreshToken)
            return res.json(todo);
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

}
module.exports = new UserController();