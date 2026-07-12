import express from 'express';
import { DatabaseGateway } from './gateway';
import { connectRedis } from './redis';

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await DatabaseGateway.createUser(name, email);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await DatabaseGateway.getUserById(userId);
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

const PORT = process.env.PORT || 3000;

async function start() {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Mahashankh Gateway running on port ${PORT}`);
  });
}

start();