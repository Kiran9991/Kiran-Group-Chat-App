const Group = require('../models/group');
const User = require('../models/user');
const User_Group = require('../models/user_group');
const InviteLink = require('../models/inviteLink');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const postNewGroup = async(req, res) => {
    try {
        const { groupName } = req.body;
        const name = req.user.name;

        if(isStringInvalid(groupName)) {
            return res.status(400).json({error: "Parameters are missing"});
        }

        const group = await Group.create({ groupName:groupName, createdBy:name, userId:req.user.id });
        const user_group = await User_Group.create({ userId:req.user.id, groupId: group.dataValues.id})

        res.status(202).json({ newGroup:group, message: `Successfully created ${groupName}`, user_group })
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

const getGroups = async(req, res) => {
    try {
        const user_group = await User_Group.findAll({ where:{userId: req.user.id}});
        
        let groupsList = [];
        for(let i=0; i<user_group.length; i++) {
            let group_id = user_group[i].dataValues.groupId;
            if(group_id !== null) {
                const groups = await Group.findByPk(group_id);
                groupsList.push(groups)
            }
        }
        // const groups = await Group.findAll({ where: {userId: req.user.id} });
        const users = await User.findAll();
       
        res.status(201).json({ listOfUsers: users, groupsList})
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
} 

const postRequest = async(req, res) => {
    try{
        const { toUserId, groupId } = req.body;

        const user_group = await User_Group.create({ userId:toUserId, groupId:groupId });

        res.status(202).json({ user_group, message: 'Successfully sended link' })
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong'})
    }
}

const getRequest = async(req, res) => {
    try{
        const userId = req.user.id;
        const links = await InviteLink.findAll({ where: {toUserId: userId } });
        res.status(202).json({ requestLink: links });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong'})
    }
} 

const getGroupLink = async(req, res) => {
    try{
        const groupIds = req.query.groupId;
        console.log(groupIds);
        const groupData = await Group.findOne({ where:{id:groupIds} });
        res.status(202).json({ groupDetails:groupData });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: `Something went wrong`});
    }
}

module.exports = {
    postNewGroup,
    getGroups,
    postRequest,
    getRequest,
    getGroupLink
}