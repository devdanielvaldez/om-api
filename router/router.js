const router = require('express').Router();
const Tracking = require('./tracking');
const { requestQuote } = require('./quote');

router.get('/tracking/:id', Tracking);
router.post('/quote', requestQuote);

module.exports = router;