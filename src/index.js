import config from './config.js';
import express from 'express';
import { throttle } from './middlewares/throttling.js';
import proxy from './middlewares/proxy.js';
import fakeAuth from './utils/fakeAuth.js';
import { users } from './utils/fakeAuth.js';
import fs from 'fs';
import yaml from 'js-yaml';
import cors from 'cors';

const app = express();
const PORT = config.port;

app.use(throttle);
app.use(cors());
//-------------------------------------------------------------
// This should be deleted when the authentication service is ready in users microservice
app.use('/api/v1/users/api/v1/login', fakeAuth);
app.get('/api/v1/users/api/v1/users', (req, res) => {
    res.json(users);
});
//-------------------------------------------------------------
app.get('/api/v1/infrastructure', (req, res) => {
    let env = req.query.env;
    if(!env){
        env = config.nodeEnv;
    }
    try {
        let infrastructure = yaml.load(fs.readFileSync(`./infrastructure.${env}.yaml`, 'utf8'));
        return res.json(infrastructure);
    } catch(err) {
        console.log("Failed to load infrastructure file, defaulting to loaded configuration");
        return res.json(config.infrastructure);
    }
});
    
app.use('/api/v1', proxy);

app.get('/', (req, res) => {
    res.send('Welcome to the API Gateway of Horizon Clouds!');
});


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});