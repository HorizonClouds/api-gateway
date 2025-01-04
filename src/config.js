import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import yaml from 'js-yaml';


const nodeEnv = process.env.NODE_ENV || 'development';
const infrastructure = yaml.load(fs.readFileSync(`./infrastructure.${nodeEnv}.yaml`, 'utf8'));

const config = {
    port: process.env.PORT || 6900,
    nodeEnv: nodeEnv,
    infrastructure: infrastructure,
    throttleLimit: process.env.THROTTLE_LIMIT || 100,
    throttleWindow: process.env.THROTTLE_WINDOW || 15,  // in minutes
};

export default config;