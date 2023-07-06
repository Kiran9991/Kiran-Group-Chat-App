const Group = require('../models/group');
const User = require('../models/user');
const User_Group = require('../models/user_group');

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
        const user_group = await User_Group.create({ userId:req.user.id, groupId: group.dataValues.id, isAdmin: true})

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
            const groups = await Group.findByPk(group_id);
            groupsList.push(groups)
        }
        const users = await User.findAll();
       
        res.status(201).json({ listOfUsers: users, groupsList, user_group})
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
} 

const postRequest = async(req, res) => {
    try{
        const { toUserId, groupId } = req.body;

        const user_group = await User_Group.create({ userId:toUserId, groupId:groupId, isAdmin:false });

        res.status(202).json({ user_group, message: 'Successfully sended link' })
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong'})
    }
} 

const getGroupMembers = async(req, res) => {
    try{
        const groupId = req.query.groupId;
        const usersDetails = [];
        const user_group = await User_Group.findAll({ where:{groupId}})
        for(let i=0; i<user_group.length; i++) {
            let user_id = user_group[i].dataValues.userId;
            const user = await User.findByPk(user_id)
            usersDetails.push(user)
        }
        res.status(201).json({ usersDetails, user_group });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: `Something went wrong `})
    }
}

const deleteGroupMember = async(req, res) => {
    try {
        const user_groupId = req.query.user_groupId;
        
        const user_group = await User_Group.destroy({ where:{id: user_groupId } });
        res.status(200).json({ user_group , message: `Successfully deleted user_group_Id`})

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: `Something went wrong` });
    }
}

const updateIsAdmin = async(req, res) => {
    try {
        const user_group_Id = req.query.user_group_Id;
        
        const user_group = await User_Group.findOne({ where:{id: user_group_Id } });

        const updateAdmin = await user_group.update({ isAdmin: true });

        res.status(202).json({ updateAdmin , message: `Successfully made Admin of Group`});
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: `Something went wrong` });
    }
}

module.exports = {
    postNewGroup,
    getGroups,
    postRequest,
    getGroupMembers,
    deleteGroupMember,
    updateIsAdmin
}