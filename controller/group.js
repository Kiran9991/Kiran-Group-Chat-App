const Group = require('../models/group');
const User = require('../models/user');
const User_Group = require('../models/userGroup');
const sequelize = require('../util/database');

// Method for checking string is valid or not
const isStringInvalid = (string) => {
    if(string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

// Adding new group in groups table
const postNewGroup = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { groupName } = req.body;
        const name = req.user.name;

        if(isStringInvalid(groupName)) {
            return res.status(400).json({error: "Parameters are missing"});
        }

        const group = await Group.create({ groupName:groupName, createdBy:name, userId:req.user.id },{ transaction: t});
        const user_group = await User_Group.create({ userId:req.user.id, groupId: group.dataValues.id, isAdmin: true},
        { transaction: t})

        await t.commit();
        res.status(202).json({ newGroup:group, message: `Successfully created ${groupName}`, user_group })
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// Getting groups lists from groups table according to user id
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

// Adding user id to the particular group id in user group table
const addUserToGroup = async(req, res) => {
    const t = await sequelize.transaction();
    try{
        const { toUserId, groupId } = req.body;

        const user_group = await User_Group.create({ userId:toUserId, groupId:groupId, isAdmin:false },{ transaction: t});

        await t.commit();
        res.status(202).json({ user_group, message: 'Successfully added user to your group' })
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: 'Something went wrong'})
    }
} 

// Getting users id from user group according to group id and then getting the users according to user id
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

// Deleting the user group id from the user group table
const deleteGroupMember = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const user_groupId = req.query.user_groupId;
        
        const user_group = await User_Group.destroy({ where:{id: user_groupId } }, { transaction: t});

        await t.commit();
        res.status(200).json({ user_group , message: `Successfully deleted user_group_Id`})
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: `Something went wrong` });
    }
}

// Updating the user group status i.e isAdmin in user group table
const updateIsAdmin = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const user_group_Id = req.query.user_group_Id;
        
        const user_group = await User_Group.findOne({ where:{id: user_group_Id } });

        const updateAdmin = await user_group.update({ isAdmin: true }, { transaction:t });

        await t.commit();
        res.status(202).json({ updateAdmin , message: `Successfully made Admin of Group`});
    } catch(err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ error: `Something went wrong` });
    }
}

module.exports = {
    postNewGroup,
    getGroups,
    addUserToGroup,
    getGroupMembers,
    deleteGroupMember,
    updateIsAdmin
}