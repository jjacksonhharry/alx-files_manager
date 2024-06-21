// FilesController 

const { fileQueue } = require('../utils/queue');

class FilesController {
  static async postUpload(req, res) {
    // Existing code to handle file upload...

    // Add the job to the Bull queue if the file type is 'image'
    if (file.type === 'image') {
      await fileQueue.add({ userId: user._id, fileId: file._id });
    }

    // Return the response
    return res.status(201).json(file);
  }
}

module.exports = FilesController;
