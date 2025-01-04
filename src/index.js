import config from './config.js';
import express from 'express';
import { throttle } from './middlewares/throttling.js';
import proxy from './middlewares/proxy.js';
import fakeAuth from './utils/fakeAuth.js';
import { users } from './utils/fakeAuth.js';

const app = express();
const PORT = config.port;

app.use(throttle);
//-------------------------------------------------------------
// This should be deleted when the authentication service is ready in users microservice
app.use('/api/v1/users/api/v1/login', fakeAuth);
app.get('/api/v1/users/api/v1/users', (req, res) => {
    res.json(users);
});
//-------------------------------------------------------------
app.use('/api/v1', proxy);

app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway of Horizon Clouds!');
});


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});