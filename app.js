const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: '.env'});

const sequelize = require('./util/database')

const User = require('./models/user');
const Chats = require('./models/chat');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(express.json());

app.use('/user', userRoutes);
app.use('/chat-app', chatRoutes);

User.hasMany(Chats);
Chats.belongsTo(User);

sequelize.sync().then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})
