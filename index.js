const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('dotenv');
const app = express();
config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v1', require('./router/index.router'));

app.listen(PORT, () => {
    return console.log('AP Runing in PORT --->', PORT);
})