// controllers/UsersController.jsi

import dbClient from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
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
}

export default UsersController;
