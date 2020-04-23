const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// route POST api/profiles/
// @desc create profile
// @access private

router.post('/', auth, async (req, res) => {
  const authid = req.user.id;
  const { first_name, last_name, avatar, github, cohort } = req.body;

  let userProfile = await pool.query(
    'Insert into profile(authid, first_name, last_name, avatar, github, cohort)     values ($1, $2, $3, $4, $5, $6) RETURNING *',
    [authid, first_name, last_name, avatar, github, cohort]
  );
  userProfile = userProfile.rows[0];
  res.json(userProfile);
});

//@route GET api/profiles/self
// @desc get profile data of the logged in user
// @access private

module.exports = router;
