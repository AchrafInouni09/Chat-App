const {User} = require ('../models/users');




async function AddUser_mw (req, res, next)
{
    if (!req.body)
        return res.status (400).json ({message: 'Request body is missing. Check Content-Type header.'});

    const {firstname, lastname , username, email, password, role} = req.body;

    if (!username || !email || !password)
        return res.status (400).json ({message: 'Missing required fields: username, email, password, role'});
    try
    {
        const userModel = new User ();
        const result = await userModel.AddUser (firstname, lastname , username, email, role , password);
        res.status (201).json ({message: 'User added successfully', userId: result.insertId});
        next ();
    }
    catch (err)
    {
        console.error("Error in GetAllUsers_mw:", err);
        res.status (500).json ({message: 'Internal server error'});
    }
}

async function GetAllUsers_mw(req, res, next)
{
    try
    {
        const userModel = new User ();
        const users = await userModel.GetAllUsers ();
        res.json ({users: users});
        next ();
    }
    catch (err)
    {
        console.error("Error in GetAllUsers_mw:", err);
        res.status (500).json ({message: 'Internal server error'});
    }
}

async function DeleteUser_mw (req, res, next)
{
    if (!req.params.id)
        return res.status (400).json ({message: 'User ID is required in query parameters.'});

    try
    {
        const userModel = new User ();
        const result = await userModel.DeleteUser (req.params.id);
        res.json ({message: 'User deleted successfully', affectedRows: result.affectedRows});
        next ();
    }
    catch (err)
    {
        console.error("Error in GetAllUsers_mw:", err);
        res.status (500).json ({message: 'Internal server error'});
    }
}

async function UpdateUser_mw(req, res, next)
{
    if (!req.body || !req.params.id)
        return res.status (400).json ({message: 'Request body and User ID in params are required.'});
    
    const {username, email, role} = req.body;
    const userId = req.params.id;

    try
    {
        const userModel = new User ();
        const users = await userModel.UpdateUser (userId, username, email, role);
        return res.json ({message: 'User updated successfully', affectedRows: users.affectedRows});
        next ();
    }
    catch (err)
    {
        console.error("Error in GetAllUsers_mw:", err);
        res.status (500).json ({message: 'Internal server error'});
    }
}

module.exports = {AddUser_mw, GetAllUsers_mw,DeleteUser_mw , UpdateUser_mw};