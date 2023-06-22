const Chat = require('../models/chat');
const User = require('../models/user');

const userChats = async(req, res) => {
    try {
        const { textMessage } = req.body;

        let name = req.user.name;
        const chats = await Chat.create({ message:textMessage, sender: name, userId: req.user.id });
        
        res.status(201).json({ textMessage: chats, message: 'Successfully sended message' })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const getNewMessage = async(req, res) => {
    try{
        const lastMsgId = req.query.lastMsgId;
        console.log(lastMsgId);
        const textMessages = await Chat.findAll({ where:{id:lastMsgId}});
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

module.exports = {
    userChats,
    getNewMessage
}