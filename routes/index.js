const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/', (req,res) => res.render('Welcome'));

module.exports = router;