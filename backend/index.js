const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./config/db'); // We'll use this later

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('TrustScore API is running!');
});

app.use('/api/users', require('./routes/userRoutes'));

app.use('/api/stores', require('./routes/storeRoutes'));

app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/owner', require('./routes/storeOwnerRoutes'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);


});