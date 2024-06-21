const { userQueue } = require('../utils/queue');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userCollection = dbClient.client.db().collection('users');
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const result = await userCollection.insertOne({
      email,
      password: hashedPassword,
    });

    const newUser = result.ops[0];

    // Add job to userQueue for sending welcome email
    await userQueue.add({ userId: newUser._id });

    return res.status(201).json({ id: newUser._id, email: newUser.email });
  }
}

module.exports = UsersController;
