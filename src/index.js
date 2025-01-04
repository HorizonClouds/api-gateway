import config from './config.js';
import express from 'express';
import { throttle } from './middlewares/throttling.js';
import proxy from './middlewares/proxy.js';

const app = express();
const PORT = config.port;

app.use(throttle);
app.use('/api/v1', proxy);

app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway');
});


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});