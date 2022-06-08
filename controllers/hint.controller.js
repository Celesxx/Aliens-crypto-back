const Users = require('../models/user.model.js')
const Hints = require('../models/hint.model.js')
const errorHelper = require('../helpers/error.helper')
const filename = "user.controller.js"
const LoginFunction = require('../functions/login.function.js')
const jwt = require('jsonwebtoken')
const { create } = require('../models/user.model.js')
require("dotenv").config()
const type = "Hints"



class UserController 
{
 
    


    //---------------------------------- Create hint to database --------------------------------------
    async createHint(req, res)
    {
        const functionName = "createHint"
        const request = "created"
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
                    if(isAdmin.length == 0) return await errorHelper.contentNotFound(res, type, request, token)

                    if(isAdmin.admin)
                    {
                        const hint = new Hints(
                        { 
                            identifier: req.body.identifier,
                            hint: req.body.hint,
                            dateUnlock: req.body.dateUnlock
                        })
                        await hint.save()

                        return errorHelper.dataCreated(res, type, hint)

                    }else return await errorHelper.contentNoAccess(res)
                    
                }else return await errorHelper.contentNotAuth(res, resultToken.auth, resultToken.message, resultToken.error)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
    }





    //---------------------------------- get next hint --------------------------------------

    async getHint(req, res)
    {
        const functionName = "getHint"
        const request = "receive"
        const token = req.headers["x-access-token"]

        try
        {
            const loginFunction = new LoginFunction()
            const date = new Date()

            if(!token) res.json({ auth: false, message: "You have to be logged !"})
            else
            {
                let resultToken = await loginFunction.decryptToken(token)
                if(resultToken.state == true & resultToken.auth == true)
                {
                    const hint = req.body.hint
                    const currentHint = req.body.currentHint
                    const currentDay = ("00" + date.getDate()).slice(-2) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear()

                    const hintResult = await Hints.findOne({identifier: req.body.identifier}).select('-__v')
                    const hintDate = hintResult.dateUnlock[currentHint.length]

                    if(currentDay.slice(0,2) >= hintDate.slice(0,2)  && currentDay.slice(3,5) >= hintDate.slice(3,5)  && currentDay.slice(6,10) >= hintDate.slice(6,10))
                    {
                        if(hintResult.hint[currentHint.length] == hint)
                        {
                            currentHint.push(hint)
                            await Users.updateOne({token: token}, { hint: currentHint }, {new: true})
                            return await errorHelper.hintFound(res, currentHint)
                        
                        }else return await errorHelper.hintNotFound(res)

                    }else return await errorHelper.hintNotUnlocked(res)

                    
                }else return await errorHelper.contentNotAuth(res, resultToken.auth, resultToken.message, resultToken.error)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
            
    }







    //---------------------------------- get all hints --------------------------------------

    async getHints(req, res)
    {
        const functionName = "getHints"
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
                    if(isAdmin.length == 0) return await errorHelper.contentNotFound(res, type, request, token)

                    if(isAdmin.admin)
                    {
                        const hints = await Hints.find().select('-__v')
                        return await errorHelper.contentFound(res, type, request, hints)

                    }else return await errorHelper.contentNoAccess(res)
                    
                }else return await errorHelper.contentNotAuth(res, resultToken.auth, resultToken.message, resultToken.error)
            }

        }catch(error)
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file ${filename}.\nServer status : The followed error is ${error}`)
        }
            
    }

}

module.exports = UserController




