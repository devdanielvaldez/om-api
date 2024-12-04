const router = require('express').Router();
const Main = require('./router');

router.use('/om', Main);

module.exports = router;