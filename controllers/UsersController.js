// controllers/UsersController.js

import dbClient from '../utils/db';
import { redisClient } from '../utils/redis'; // Import redisClient
import sha1 from 'sha1';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if email already exists
    const existingUser = await dbClient.getUser({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create a new user
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Save the new user in the collection
    const result = await dbClient.insertUser(newUser);

    // Return the new user with only email and id
    const { _id, ...user } = result.ops[0];
    return res.status(201).json({ id: _id, email: user.email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;

    redisClient.get(key, (err, userId) => {
      if (err || !userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Assuming you have some function to find the user by ID
      const user = findUserById(userId);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Returning only necessary fields (id and email)
      return res.status(200).json({ id: user.id, email: user.email });
    });
  }
}

export default UsersController;
