// utils/db.js
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const {
      DB_HOST = 'localhost',
      DB_PORT = 27017,
      DB_DATABASE = 'files_manager',
    } = process.env;

    this.client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}`, {
      useUnifiedTopology: true,
    });

    this.dbName = DB_DATABASE;

    this.connect(); // Connect immediately when the instance is created
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error}`);
    }
  }

  isAlive() {
    return this.client && this.client.topology.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.client.db(this.dbName).collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const filesCollection = this.client.db(this.dbName).collection('files');
    return filesCollection.countDocuments();
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();

export default dbClient;
