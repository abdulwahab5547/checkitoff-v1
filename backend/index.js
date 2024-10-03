import express, { Router, json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import User, { findOne} from './models/user.model.js';
import cors from 'cors';
const app = express();
const router = Router();
import pkg from 'body-parser';
const { json: _json } = pkg;
import token from 'jsonwebtoken';
const { sign, verify } = token;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware

app.use(json());

app.use(cors({
    origin: ["https://checkitoff-frontend-v2.vercel.app", "http://localhost:3000"],
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.user = user;
      next();
  });
}




// Routes
router.post('/signup', async (req, res) => {
  const { username, password} = req.body;
  try {
    const newUser = new User({ username, password});
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Today tasks

app.get('/api/today-tasks', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ tasks: user.todayTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/today-tasks', authenticateToken, async (req, res) => {
  try {
      const { tasks } = req.body;

      // Validate the structure of tasks and subtasks
      if (!Array.isArray(tasks) || !tasks.every(task => 
          typeof task.text === 'string' &&
          typeof task.completed === 'boolean'
      )) {
          return res.status(400).json({ message: 'Invalid task format' });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.todayTasks = tasks;
      await user.save();

      res.json({ message: 'Tasks saved successfully', tasks: user.todayTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Upcoming tasks

app.get('/api/upcoming-tasks', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ tasks: user.upcomingTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/upcoming-tasks', authenticateToken, async (req, res) => {
  try {
      const { tasks } = req.body;

      if (!Array.isArray(tasks) || !tasks.every(task => 
          typeof task.text === 'string' &&
          typeof task.completed === 'boolean'
      )) {
          return res.status(400).json({ message: 'Invalid task format' });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.upcomingTasks = tasks;
      await user.save();

      res.json({ message: 'Tasks saved successfully', tasks: user.upcomingTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// imp tasks

app.get('/api/imp-tasks', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ tasks: user.impTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/imp-tasks', authenticateToken, async (req, res) => {
  try {
      const { tasks } = req.body;

      if (!Array.isArray(tasks) || !tasks.every(task => 
          typeof task.text === 'string' &&
          typeof task.completed === 'boolean'
      )) {
          return res.status(400).json({ message: 'Invalid task format' });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.impTasks = tasks;
      await user.save();

      res.json({ message: 'Tasks saved successfully', tasks: user.impTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// weekly tasks

app.get('/api/weekly-tasks', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ tasks: user.weeklyTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/weekly-tasks', authenticateToken, async (req, res) => {
  try {
      const { tasks } = req.body;

      if (!Array.isArray(tasks) || !tasks.every(task => 
          typeof task.text === 'string' &&
          typeof task.completed === 'boolean'
      )) {
          return res.status(400).json({ message: 'Invalid task format' });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.weeklyTasks = tasks;
      await user.save();

      res.json({ message: 'Tasks saved successfully', tasks: user.weeklyTasks });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Goals

app.get('/api/long-term-goals', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.json({ goals: user.longTermGoals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  });
  
  app.post('/api/long-term-goals', authenticateToken, async (req, res) => {
    try {
        const { tasks } = req.body;
  
        if (!Array.isArray(tasks) || !tasks.every(task => 
            typeof task.text === 'string' &&
            typeof task.completed === 'boolean'
        )) {
            return res.status(400).json({ message: 'Invalid goal format' });
        }
  
        const user = await User.findById(req.user.id);
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        user.longTermGoals = tasks;
        await user.save();
  
        res.json({ message: 'Goals saved successfully', tasks: user.longTermGoals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  });

// Notes

app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ notes: user.notes });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
      const { notes } = req.body;

      if (!Array.isArray(notes) || !notes.every(note => 
          typeof note.title === 'string' &&
          typeof note.content === 'string'
      )) {
          return res.status(400).json({ message: 'Invalid task format' });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Append the new note(s) to the existing notes
      user.notes.push(...notes);
      await user.save();

      res.json({ message: 'Tasks saved successfully', notes: user.notes });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.put('/api/notes/:title', authenticateToken, async (req, res) => {
  try {
      const { title, content } = req.body;  // Extract title and content from request body
      const { title: oldTitle } = req.params;  // Extract the current title from request params

      // Validate input
      if (typeof title !== 'string' || typeof content !== 'string') {
          return res.status(400).json({ message: 'Invalid input format' });
      }

      // Find the user
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Find the note by its title
      const note = user.notes.find(note => note.title === oldTitle);

      if (!note) {
          return res.status(404).json({ message: 'Note not found' });
      }

      // Update the note's title and content
      note.title = title;
      note.content = content;

      // Save the updated user data
      await user.save();

      res.json({ message: 'Note updated successfully', notes: user.notes });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.delete('/api/notes/:title', authenticateToken, async (req, res) => {
  try {
      const { title } = req.params; // Get note title from request parameters

      if (!title) {
          return res.status(400).json({ message: 'Title is required' });
      }

      // Find user by ID and remove the note with the matching title
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Filter out the note with the matching title
      user.notes = user.notes.filter(note => note.title !== title);

      await user.save();

      res.json({ message: 'Note successfully deleted', notes: user.notes });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
      const { id } = req.params; // Get note ID from request parameters

      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid note ID' });
      }

      // Find user by ID and remove the note
      const user = await User.findById(req.user.id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Filter out the note with the matching ID
      user.notes = user.notes.filter(note => note.id !== id);

      await user.save();

      res.json({ message: 'Note successfully deleted', notes: user.notes });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/add-note', authenticateToken, async (req, res) => {
  try {

    const title = 'first note ever';
    const content = 'content for first note';

    const newNote = new Note({
      title,
      content
    });

    await newNote.save();

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notes.push(newNote._id);
    await user.save();

    res.status(201).json({ message: 'Note added successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Account details

app.get('/api/account-settings', authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id, 'username password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ username: user.username, password: user.password });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

app.put('/api/account-settings', authenticateToken, async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (username) user.username = username;
      if (password) user.password = password;  
  
      await user.save();
  
      res.json({ message: 'Account settings updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


// Example routes
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/something', (req, res) => res.send('Hello something something!'));

// Final middleware: mount the router
app.use('/api', router);

// Generatetoken function
function generateToken(user) {
    return sign({ id: user.id}, SECRET_KEY, {
        expiresIn: '14d',
    });
}

// Connect to MongoDB and start server
const uri = process.env.MONGODB_URL;
mongoose.connect(uri, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server running on port ${port}`));