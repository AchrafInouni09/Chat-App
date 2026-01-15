const express = require ('express');
const jwt = require ('jsonwebtoken');
const {User} = require ('../models/users');


const config = require ('../config/config');


async function auth_mw_login (req, res, next) 
{
    
    if (!req.body) {
        return res.status(400).json({message: 'Request body is missing. Check Content-Type header.'});
    }

    const {username, password } = req.body;

    if (!username || !password) 
    {
        return res.status (400).json ({message: 'username and password are required'});
    }

    const usermodel = new User ();

    try
    {
        const user = await usermodel.Find (username, password);


        if (!user)
        {
            return res.status (401).json ({message: 'invalid credentials'});
        }

        const payload = {id: user.id,
                        username: user.username,
                        role: user.role
        };
        console.log (payload);    // ############
        const token = jwt.sign (payload, config.jwt_secret, {expiresIn: '1h'})
        return  res.json ({message: 'Login successful', token})
    }
    catch (err)
    {
        console.error("Auth Middleware Error:", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}



async function auth_mw_register (req, res, next)
{
    if (!req.body)
    {
        return res.status (400).json ({message: 'Request body is missing. Check Content-Type header.'});
    }

    let avatar_url = null;

    if (req.file)
    {
        avatar_url = `images/${req.file.filename}`;
    }

    const {firstname, lastname, username, email, password, role} = req.body;

    if (!firstname || !lastname || !username || !email || !password || !role)
    {
        return res.status (400).json ({message: 'required firstname, lastname, username, email, password, role'});
    }


    const usermodel = new User ();

    try
    {
        const isEmailExist = await usermodel.isEmailExist (email);
        if (isEmailExist)
        {
            return res.status (409).json ({message: 'Email already in use'});
        }

        const isUserNameExist = await usermodel.isUserNameExist (username);
        if (isUserNameExist)
        {
            return res.status (409).json ({message: 'Username already in use'});
        }

        const isNameExist = await usermodel.isNameExist (firstname, lastname);
        if (isNameExist)
        {
            return res.status (409).json ({message: 'User with the same first name and last name already exists'});
        }

        const roles = ['user', 'admin', 'moderator', 'guest'];

        if (!roles.includes (role))
        {
            return res.status (400).json ({message: 'Invalid role specified'});
        }

        await usermodel.register (firstname, lastname, username, email, password, role, avatar_url);
        next ();
    }
    catch (err)
    {
        console.error("Auth register Error:", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

async function auth_mw_token (req, res, next)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
    {
        return res.status (401).json ({message: 'Access token is missing'});
    }

    try
    {
        const decoded = jwt.verify (token, config.jwt_secret);
        req.user = decoded;
        next ();
    }
    catch (err)
    {
        return res.status (403).json ({message: 'Invalid or expired token'});
    }
}

module.exports = {auth_mw_login, auth_mw_register, auth_mw_token};