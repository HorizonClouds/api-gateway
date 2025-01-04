import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../config.js';
import standardResponse from '../utils/standardResponse.js';
import { NotFoundError } from '../utils/customErrors.js';

const services = config.infrastructure.services;
const proxy = (req, res, next) => {
    console.log('Incoming request:', req.method, req.originalUrl);
    const pathParts = req.path.split('/');
    console.log('Path parts:', pathParts);
    const serviceName = pathParts[1];
    console.log('Service name:', serviceName);
    console.log('Service:', services?.[serviceName]);

    if (!services?.[serviceName]) {
        console.log(`Service not found: ${serviceName}`);
        return standardResponse.sendError(res, new NotFoundError(`Service not found: ${serviceName}`));
    }

    const serviceUrl = services?.[serviceName].url;
    console.log('Service URL:', serviceUrl);


    createProxyMiddleware({
        target: serviceUrl,
        changeOrigin: true,
        pathRewrite: {
        // Remove the service name from the path
            [`^/${serviceName}`]: '',
        },
        on: {
            error: (err, req, res) => {
                console.log('Proxy error:', err);
                err.target = serviceUrl;
                standardResponse.sendError(res, err);
            }
        }
    })(req, res, next);
};

export default proxy;