const Chat = require('../models/chat');
 
// Posting text Message to Chata table
const postMessage = async(req, res) => {
    try {
        const { textMessage, groupId } = req.body;

        const name = req.user.name;
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

// Getting old messages from Chats table according to groupId
const getOldMessages = async(req, res) => {
    try{
        const groupId = req.query.groupId;
        const textMessages = await Chat.findAll({ where:{groupId} });
        if(textMessages.length > 0) {
            return res.status(202).json({ textMessages })
        }else {
            return res.status(201).json({ message: 'there are no previous messages' })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    postMessage,
    getOldMessages,
}