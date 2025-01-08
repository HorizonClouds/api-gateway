import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { sendSuccess, sendError } from './standardResponse.js';

const router = express.Router();
router.use(express.json());

export const users = [
    {
        id: "user1",
        password: 'password1',
        roles: ['admin', 'user'],
        name: 'John Doe',
        photo: 'photo1.jpg',
        biography: 'Lorem ipsum dolor sit amet.',
        registrationDate: '2021-01-01',
        accountStatus: 'active',
        friendRequestStatus: 'none',
        verifiedEmail: true,
        plan: 'pro',
        addons: ['all']
    },
    {
        id: "user2",
        password: 'password2',
        roles: ['user'],
        name: 'Jane Smith',
        photo: 'photo2.jpg',
        biography: 'Consectetur adipiscing elit.',
        registrationDate: '2021-02-01',
        accountStatus: 'active',
        friendRequestStatus: 'pending',
        verifiedEmail: true,
        plan: 'basic',
        addons: ["addon1"]
    },
    {
        id: "user3",
        password: 'password3',
        roles: ['user'],
        name: 'Alice Johnson',
        photo: 'photo3.jpg',
        biography: 'Sed do eiusmod tempor incididunt.',
        registrationDate: '2021-03-01',
        accountStatus: 'inactive',
        friendRequestStatus: 'accepted',
        verifiedEmail: false,
        plan: 'pro',
        addons: ['addon1', 'addon2']
    }
];

router.post('/', (req, res) => {
    const { userId, password } = req.body;
    console.log('Received login request:', userId, password);
    const user = users.find(u => u.id === userId && u.password === password);
    if (!user) {
        console.log('Invalid credentials, user:', user);
        return sendError(res, {
            statusCode: 401,
            message: 'Invalid credentials',
            appCode: 'UNAUTHORIZED'
        });
    }

    const tokenPayload = {
        user: {
            userId: user.id,
            roles: user.roles,
            plan: user.plan,
            addons: user.addons,
            name: user.name,
            verifiedEmail: user.verifiedEmail,
        }
    };

    const token = jwt.sign(tokenPayload, config.jwtSecret,{ expiresIn: '3h' });

    console.log(`User ${user.userId} authenticated successfully`);
    console.log(`Token: ${token}, secret: ${config.jwtSecret}, payload: ${JSON.stringify(tokenPayload)}`);
    return sendSuccess(res, {
        message: 'Authentication successful',
        data: { token, secret: config.jwtSecret, expiresIn: '3h', payload: tokenPayload, otherUsers: users }
    });
});

export default router;
