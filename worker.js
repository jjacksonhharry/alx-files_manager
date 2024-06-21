const Bull = require('bull');
const { MongoClient, ObjectId } = require('mongodb');
const { promisify } = require('util');

// Create a queue named 'userQueue'
const userQueue = new Bull('userQueue');
// Create a queue named 'fileQueue'
const fileQueue = new Bull('fileQueue');

// MongoDB setup
const url = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const dbName = 'files_manager';
let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  db = client.db(dbName);
});

// Process userQueue
userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) {
    return done(new Error('Missing userId'));
  }

  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ _id: ObjectId(userId) });

  if (!user) {
    return done(new Error('User not found'));
  }

  console.log(`Welcome ${user.email}!`);

  done();
});

// Process fileQueue
fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId) {
    return done(new Error('Missing fileId'));
  }

  if (!userId) {
    return done(new Error('Missing userId'));
  }

  const filesCollection = db.collection('files');
  const file = await filesCollection.findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });

  if (!file) {
    return done(new Error('File not found'));
  }

  const filePath = path.join('/tmp/files_manager', file.localPath);

  try {
    // Generate thumbnails
    const sizes = [500, 250, 100];
    for (const width of sizes) {
      const thumbnail = await imageThumbnail(filePath, { width });
      const thumbnailPath = `${filePath}_${width}`;
      fs.writeFileSync(thumbnailPath, thumbnail);
    }

    done();
  } catch (error) {
    done(error);
  }
});
