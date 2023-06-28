const Group = require('../models/group');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const postGroup = async(req, res) => {
    try {
        const { groupName } = req.body;
        const name = req.user.name;

        if(isStringInvalid(groupName)) {
            return res.status(400).json({error: "Parameters are missing"});
        }

        const group = await Group.create({ groupName:groupName, createdBy:name });
        res.status(202).json({ newGroup:group, message: `Successfully created ${groupName}` })
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

const getGroups = async(req, res) => {
    try {
        const groups = await Group.findAll({ where: {createdBy: req.user.name} });
        const users = await User.findAll();
       
        res.status(201).json({ listOfGroups: groups, listOfUsers: users})
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
} 

module.exports = {
    postGroup,
    getGroups
}