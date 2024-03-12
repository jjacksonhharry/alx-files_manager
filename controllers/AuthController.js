// controllers/AuthController.js

const uuidv4 = require('uuid').v4;
const { redisClient } = require('../utils/redis');

const AuthController = {
  getConnect: (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString();
    const [email, password] = decodedCredentials.split(':');

    // Assuming you have some function to find the user based on email and hashed password
    const user = findUserByEmailAndPassword(email, hash(password));

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;

    redisClient.set(key, user.id, 'EX', 86400); // Expire in 24 hours

    return res.status(200).json({ token });
  },

  getDisconnect: (req, res) => {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;

    redisClient.del(key);

    return res.status(204).send();
  }
};

module.exports = AuthController;
