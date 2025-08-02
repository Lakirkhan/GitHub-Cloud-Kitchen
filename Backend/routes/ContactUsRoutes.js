const express = require('express');
const router = express.Router();
const contactus = require('../controllers/contactUsController')

router.post('/contactUs',contactus.Contact);
module.exports = router;