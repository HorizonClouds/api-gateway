import rateLimit from 'express-rate-limit';
import config from '../config.js';

export const throttle = rateLimit({
    windowMs: config.throttleWindow * 60 * 1000, // 15 minutes
    max: config.throttleLimit, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

export default { throttle };