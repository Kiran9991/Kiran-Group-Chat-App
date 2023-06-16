const User = require('../models/user');
const bcrypt = require('bcrypt');

const signup = async(req, res) => {
    try {
        const {name, email, phoneNumber, password} = req.body;

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async(err, hash) => {
            await User.create({ name, email, phoneNumber, password:hash })
            res.status(201).json({ message: 'Successfully created New User Account'})
        })
    } catch(err) {
        res.status(500).json({err:'Something went wrong'});
        console.log(err);
    }
}

module.exports = {
    signup
}