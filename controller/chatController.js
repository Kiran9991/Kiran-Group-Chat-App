const Chat = require('../models/chat');
const User = require('../models/user');

const userChats = async(req, res) => {
    try {
        const { textMessage } = req.body;

        const chats = await Chat.create({ message:textMessage, userId: req.user.id });
        res.status(201).json({ textMessage: chats, message: 'Successfully sended message' })

    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    userChats
}