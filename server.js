// server.js

import express from 'express';
import router from './routes/index';

const app = express();
const PORT = process.env.PORT || 5000; // Use process.env.PORT if available, otherwise use port 5000

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
