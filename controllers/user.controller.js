const Users = require('../models/user.model.js')
const errorHelper = require('../helpers/error.helper')
const filename = "user.controller.js"
const bcrypt = require('bcrypt')
const LoginFunction = require('../functions/login.function.js')
const jwt = require('jsonwebtoken')
require("dotenv").config()
const type = "Users"



class UserController 
{
 
    


    //---------------------------------- Create user to database --------------------------------------
    async createUser(req, res)
    {
        const functionName = "createUser"
        let [id, token] = []

        try
        {           
            const user = new Users({ address: req.body.address })

            const userCheck = await Users.find({address : user.address })
            if(userCheck.length != 0) return errorHelper.alreadyExist(res, req.body.address)

            let result = await user.save()

            id = result._id
            token = jwt.sign({id}, process.env.JWTSECRET, { expiresIn: "7d" })
            
            await Users.updateOne({_id: id}, {token : token }, {new: true})
            return errorHelper.dataCreated(res, req.body.address, token) 

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
    }







    //---------------------------------- get all users --------------------------------------

    async getUsers(req, res)
    {
        const functionName = "getUsers"
        const request = "receive"
        const token = req.headers["x-access-token"]

        try
        {
            const loginFunction = new LoginFunction()

            if(!token) res.json({ auth: false, message: "You have to be logged !"})
            else
            {
                let resultToken = await loginFunction.decryptToken(token)
                if(resultToken.state == true & resultToken.auth == true)
                {
                    let isAdmin = await Users.findOne({token: token}).select('admin')
                    if(isAdmin == null) return await errorHelper.contentNotAuth(res)
                    if(isAdmin.length == 0) return await errorHelper.contentNotFound(res, type, request, token)

                    if(isAdmin.admin)
                    {
                        const users = await Users.find().select('-__v -token -admin')
                        return await errorHelper.contentFound(res, type, request, users)

                    }else return await errorHelper.contentNoAccess(res)
                    
                }else return await errorHelper.contentNotAuth(res)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
            
    };









    //---------------------------------- update user by id --------------------------------------

    async updateUser(req, res)
    {

        const functionName = "updateUser"
        const request = "updated"
        const token = req.headers["x-access-token"]

        try
        {
            const loginFunction = new LoginFunction()

            if(!token) res.json({ auth: false, message: "You have to be logged !"})
            else
            {
                let resultToken = await loginFunction.decryptToken(token)
                
                if(resultToken.state == true & resultToken.auth == true)
                {

                    let user = await Users.updateOne({token: token},
                    {
                        address: req.body.address,
                        hint: req.body.hint,
                    }, {new: true})

                    if(user.length == 0) return errorHelper.contentNotFound(res, type, request, token)
                    else return errorHelper.contentFound(res, type, request, user)

                }else return await errorHelper.contentNotAuth(res)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
    }







    //---------------------------------- logout user by token --------------------------------------

    async logoutUser(req, res) 
    {

        const functionName = "logoutUser"
        const request = "logout"
        const token = req.headers["x-access-token"]

        try
        {
            const loginFunction = new LoginFunction()

            if(!token) res.json({ auth: false, message: "You have to be logged !"})
            else
            {
                let resultToken = await loginFunction.decryptToken(token)
                
                if(resultToken.state == true & resultToken.auth == true)
                {
                    let user = await Users.updateOne({token: token}, { token: "" }, {new: true})
                    if(user.length == 0) return errorHelper.contentNotFound(res, type, request, token)
                    else return errorHelper.contentFound(res, type, request, user)
                        
                }else return await errorHelper.contentNotAuth(res)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
    }





    //---------------------------------- login --------------------------------------
    async login(req, res)
    {
        const functionName = "loginUser"
        const request = "loginUser"
        try
        {
            let user = await Users.findOne({ address: req.body.address }).select('-__v')
            if(user.length != 0)
            {
                
                const id = user._id
                const token = jwt.sign({id}, process.env.JWTSECRET, 
                {
                    expiresIn: "7d",
                })

                let result = await Users.updateOne({_id: id}, {token: token}, {new: true})
                if(result.length == 0) return await errorHelper.contentNotFound(res, token, request, token)

                return await errorHelper.logged(res, token)
            
            }else{ res.json({auth: false, message: `The user does not exist on the database`}) }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
    }
    





    async getCurrentHint(req, res)
    {
        const functionName = "getCurrentHint"
        const request = "receive"
        const token = req.headers["x-access-token"]

        try
        {
            const loginFunction = new LoginFunction()

            if(!token) res.json({ auth: false, message: "You have to be logged !"})
            else
            {
                let resultToken = await loginFunction.decryptToken(token)
                if(resultToken.state == true & resultToken.auth == true)
                {

                    const result = await Users.findOne({token: token}).select('hint -_id')
                    return await errorHelper.contentFound(res, type, request, result)

                }else return await errorHelper.contentNotAuth(res, resultToken.auth, resultToken.message, resultToken.error)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
            
    }

}

module.exports = UserController




