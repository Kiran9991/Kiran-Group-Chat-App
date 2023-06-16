const User = require('../models/user');
const bcrypt = require('bcrypt');

const signup = async(req, res) => {
    try {
        const {name, email, phoneNumber, password} = req.body;

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

module.exports = {
    signup
}