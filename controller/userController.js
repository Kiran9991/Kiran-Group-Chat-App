const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const signup = async(req, res) => {
    try {
        const {name, email, phoneNumber, password} = req.body;

        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phoneNumber) || isStringInvalid(password)) {
            return res.status(400).json({error: "Bad parameters. Something is missing"})
        }

        const user = await User.findOne({ where: { email }});

        if(user) {
            return res.status(400).json({ error: 'User already exist, Please Login'});
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, phoneNumber, password:hash })
        res.status(201).json({ message: 'Successfully created New User Account'})

        console.log('New user id >>>>',newUser.dataValues.id);
    } catch(err) {
        res.status(500).json({error:'Something went wrong'});
        console.log(err);
    }
}

function generateAccessToken(id,name) {
    return jwt.sign({ userId:id, name: name }, process.env.TOKEN_SECRET);
}

const login = async (req, res) => {
    try {
        const { email, password} = req.body;

        if(isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ error: 'Email and password is missing' });
        }

        const user = await User.findAll({ where: { email }});
        if(user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err) {
                    throw new Error('Something went wrong');
                }
                if(result === true) {
                    res.status(200).json({ message: 'User logged in successfully', token: generateAccessToken(user[0].id, user[0].name) })
                }else {
                    return res.status(401).json({ error: 'User not authorized'});
                }
            })
        }else {
            return res.status(404).json({ error: `User not found`})
        }
    } catch(err) {
        res.status(500).json({ error: err });
    }
}

module.exports = {
    signup,
    login
}