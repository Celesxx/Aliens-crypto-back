const jwt = require('jsonwebtoken')
require("dotenv").config()

class loginFunction
{
    constructor()
    {
        this.filename = "login.function.js"
        this.functionName = ""
    }

    async decryptToken(token)
    {
        this.functionName = "decryptToken"
        let result
        try 
        {
            jwt.verify(token, process.env.JWTSECRET, (error, decoded) =>
            {
                if(error) result = { 
                    auth: false,
                    state:  false,
                    message: "You seems to be not logged, please login",
                    error : error,
        
                }
                else result = {
                    auth: true,
                    state: true,
                    message: "You are logged !",
                    data: decoded,
                }
            }) 
        } catch (error) 
        {
            console.log(`Server status : An error append to this function ${functionName} in the followed file 
            ${filename}.\nServer status : The followed error is ${error}`)
        }

        return result
    }

}

module.exports = loginFunction
