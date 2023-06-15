const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const sequelize = require('./util/database')

const User = require('./models/user');

const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(express.json());

app.use('/user', userRoutes);

sequelize.sync().then(result => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
})
