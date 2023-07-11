require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server,{
    cors: {
      origin: "*"
    }
});

const port = process.env.PORT || 3000

const sequelize = require('./util/database')

const User = require('./models/user');
const Chats = require('./models/chat');
const Group = require('./models/group');
const User_Group = require('./models/user_group');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/chat-app', chatRoutes);
app.use('/user-groups', groupRoutes);

User.hasMany(Chats);
Chats.belongsTo(User);

Group.hasMany(Chats);
Chats.belongsTo(Group);

User.belongsToMany(Group, { through: User_Group });
Group.belongsToMany(User, { through: User_Group });

// Socket io
io.on("connect", (socket) => {

    socket.on('user', () => {
        console.log(`user is connected`);
    })

    socket.on('joined-group', group => {
         socket.join(group);
    })

    socket.on('send-message', message => {
        socket.to(message.groupId).emit('received-message', message);
    })

    socket.on('disconnect', () => {
        console.log(`user is disconnected`);
    })
});

sequelize.sync().then(result => {
    server.listen(port);
    console.log('server is running');
}).catch(err => {
    console.log(err);
})

