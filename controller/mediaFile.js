const Chats = require('../models/chat');
const S3service = require('../services/S3services'); 

// Posting file url in the Chats table 
const postMediaFile = async(req, res) => {
    try {
        const groupId = req.query.groupId;
        const userId = req.user.id;
        const file = req.file.buffer;
        const fileName = `${userId} ${req.file.originalname}`;
        const name = req.user.name

        const fileUrl = await S3service.uploadToS3(file, fileName);

        const postFile = await Chats.create({ message: fileUrl, sender: name, groupId:Number(groupId), userId});
        
        res.status(202).json({ files:postFile , message: `file sended successfully `});
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: `Something went wrong` });
    }
}

module.exports = {
    postMediaFile
}