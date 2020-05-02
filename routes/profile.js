const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// route POST api/profiles/
// @desc create profile
// @access private

router.post('/', auth, async (req, res) => {
  const authid = req.user.id;
  try {
    //Check if profile already exists
    let profile = await pool.query(
      'SELECT authid FROM profile WHERE authid=$1',
      [authid]
    );
    if (profile.rows.length)
      return res
        .status(401)
        .json({ errors: { profile: 'Profile already exists!' } });

    // Create new profile
    const { first_name, last_name, avatar, github, cohort } = req.body;

    let userProfile = await pool.query(
      'Insert into profile(authid, first_name, last_name, avatar, github, cohort) values ($1, $2, $3, $4, $5, $6) RETURNING *',
      [authid, first_name, last_name, avatar, github, cohort]
    );
    userProfile = userProfile.rows[0];
    res.json(userProfile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ errors: error });
  }
});

//@route GET api/profiles/self
// @desc get profile data of the logged in user
// @access private
router.get('/', auth, async (req, res) => {
  try {
    const authid = req.user.id;
    let loggedInUser = await pool.query(
      'Select first_name, last_name, avatar, github, cohort from profile where authid = $1',
      [authid]
    );

    if (!loggedInUser.rows.length) {
      return res
        .status(404)
        .json({ errors: { login: 'Profile not available' } });
    }
    res.json(loggedInUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error });
  }
});

module.exports = router;
