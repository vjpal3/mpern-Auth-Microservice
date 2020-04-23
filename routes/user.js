const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken');
const secret = require('../config/default').secret;

const router = express.Router();

// @route POST /api/users
// @desc Register user
// @access public
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    let { password } = req.body;

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const existingUser = await pool.query(
      'SELECT * from auth where username=$1 or email=$2',
      [username, email]
    );

    if (existingUser.rows.length) {
      res.status(401).json({
        errors: {
          msg:
            existingUser.rows[0].username === username
              ? 'Username taken'
              : 'Email already registered. Please login',
        },
      });
    }

    let newUser = await pool.query(
      'INSERT INTO auth(username, password, email) VALUES($1, $2, $3) RETURNING *',
      [username, password, email]
    );

    newUser = newUser.rows[0];
    res.json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error });
  }
});

// @route POST /login/users/login
// @desc route to authenticate login
// @access public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await pool.query(
      'SELECT authid, username, password from auth where username = $1',
      [username]
    );

    if (!user.rows.length) {
      return res.status(404).json({ errors: { login: 'Invalid login' } });
    }
    user = user.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      pool.query('Update auth set last_login = NOW() where authid = $1', [
        user.authid,
      ]);

      const payload = {
        id: user.authid,
        username: user.username,
      };

      const token = await jwt.sign(payload, secret, {});
      return res.json({ token });
    }

    return res.status(401).json({ errors: { login: 'Invalid login' } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error });
  }
});

module.exports = router;
