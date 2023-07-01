const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');

const userChats = async(req, res) => {
    try {
        const { textMessage, groupId } = req.body;

        let name = req.user.name;
        const chats = await Chat.create({ message:textMessage, sender: name, groupId:groupId, userId: req.user.id });
        
        res.status(201).json({ textMessage: chats, message: 'Successfully sended message' })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const getNewMessage = async(req, res) => {
    try{
        const lastMsgId = req.query.lastMsgId;
        const groupId = req.query.groupId;
        const textMessages = await Chat.findAll({ where:{id:lastMsgId}, where:{groupId: groupId}});
        if(textMessages.length > 0) {
            return res.status(202).json({ latestChats: textMessages })
        }else {
            return res.status(202).json({ latestChats: 'no messages' })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err});
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
    userChats,
    getNewMessage,
    getGroupLink
}