const router = require('express').Router();
const Tracking = require('./tracking');
const { requestQuote } = require('./quote');
const Ports = require('./ports');

router.get('/tracking/:id', Tracking);
router.post('/quote', requestQuote);
router.get('/ports', Ports);

module.exports = router;