const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const secret = require('./config/default').secret;
const users = require('./routes/user');
const profiles = require('./routes/profile');

app.use(cors());
app.use(express.json());

app.use('/api/users', users);
app.use('/api/profiles', profiles);

const port = process.env.PORT || 6010;

app.listen(port, () => console.log(`app listening on port ${port}`));
