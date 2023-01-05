const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../services/mail-servie')
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const Todo = require('../models/todo-model')
const TokenModel = require('../models/token-model')
const SmallUserDto = require('../dtos/small-user-dto')

class userService{
    async register(email, password) {
        const candidate = await UserModel.findOne({email})

        if(candidate){
           throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует!`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return{
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка для активации аккаунта')
        }
        user.activated = true;
        await user.save()

    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('Пользователь с таким адресом электронной почты не найден!')
        }
        const isPassEq = await  bcrypt.compare(password, user.password);
        if(!isPassEq){
            throw ApiError.BadRequest('Неверный пароль!')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return{
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return(200);
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = tokenService.findToken(refreshToken);

        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return{
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users
    }

    async getTodos(refreshToken) {
        const userData = await Todo.findOne({where: {
                refreshToken
            }})
        const user = userData.user
        const todos = await Todo.find({where:
                {user}});
        return todos
    }

    async createTodo(title, desc, refreshToken) {
        const userData = await TokenModel.findOne({where: {
            refreshToken
            }})
        const user = userData.user
        console.log(user)
        const key = new Date().getTime()
        const todo = Todo.create({user: user, title: title, desc: desc, key: key})
        return todo
    }
}

module.exports = new userService();