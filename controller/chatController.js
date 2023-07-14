const Chat = require('../models/chat');

const postMessage = async(req, res) => {
    try {
        const { textMessage, groupId } = req.body;

        let name = req.user.name;
        const chats = await Chat.create({ 
            message:textMessage, 
            sender: name, 
            groupId:groupId, 
            userId: req.user.id 
        });
        
        res.status(201).json({ textMessage: chats, message: 'Successfully sended message' })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

const getNewMessage = async(req, res) => {
    try{
        const lastMsgId = req.query.lastMsgId;
        const textMessages = await Chat.findAll({ where:{id:lastMsgId} });
        if(textMessages.length > 0) {
            return res.status(202).json({ textMessages })
        }else {
            return res.status(202).json({ latestChats: 'no messages' })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    postMessage,
    getNewMessage,
}