const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

require('dotenv').config();

const sequelize = require('./util/database')

const User = require('./models/user');
const Chats = require('./models/chat');
const Group = require('./models/group');
const InviteLink = require('./models/inviteLink');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');

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

User.hasMany(InviteLink);
InviteLink.belongsTo(User)

User.belongsToMany(Group, { through: 'User_Group' });
Group.belongsToMany(User, { through: 'User_Group' });

User.hasMany(Group)

sequelize.sync().then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})
