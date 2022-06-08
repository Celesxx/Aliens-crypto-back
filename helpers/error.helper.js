exports.alreadyExist = (res, type) => 
{   
    return res.status(208).json(
    {
        state: false,
        message: `The ${type} already exist`,
        error: `The ${type} was already save in the database`
    })
}

exports.dataCreated = (res, type, data) => 
{   
    return res.status(200).json(
    {
        state: true,
        message: `The ${type} was save`,
        error: `The ${type} was save in the database`,
        data: data,
    })
}

exports.contentNotFound = (res, type, request, id) => 
{   
    return res.status(403).json(
    {
        state: false,
        message: `The ${type} was not ${request} succesfully`,
        error: `The ${type} was not found with the following id : ${id}.`
    })
}

exports.contentNoAccess = (res) => 
{   
    return res.status(403).json(
    {
        state: false,
        message: `You dont have the right access to do this`
    }) 
}

exports.contentNotAuth = (res) => 
{   
    return res.status(401).json(
    {
        state: false,
        isAuth: false,
        message: "You seems to be not logged, please login",
    }) 
}

exports.contentFound = (res, type, request, data) => 
{   
    return res.status(200).json(
    {
        state: true,
        message: `The ${type} has been successfully ${request} !`,
        data: data,
    })
}


exports.logged = (res, token) => 
{   
    return res.status(200).json(
    {
        auth: true, 
        message: "You are logged !", 
        token: token,
    })
}



exports.hintFound = (res, currentHint) => 
{   
    return res.status(200).json(
    {
        state: true,
        found: true, 
        message: "You have unlocked a new hint !", 
        data: currentHint,
    })
}


exports.hintNotFound = (res) => 
{   
    return res.status(200).json(
    {
        state: true,
        found: false, 
        message: "It is not the rigth hint", 
    })
}


exports.hintNotUnlocked = (res) => 
{   
    return res.status(403).json(
    {
        state: false,
        found: false, 
        message: "The next hint is currently locked. wait the next transmission", 
    })
}