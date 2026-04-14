const express = require('express');
const { execFile } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const EMPLOYEES_FILE = path.join(__dirname, 'employees.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize employees file if it doesn't exist
async function initializeEmployeesFile() {
  try {
    await fs.access(EMPLOYEES_FILE);
  } catch {
    await fs.writeFile(EMPLOYEES_FILE, JSON.stringify([]));
  }
}

// Helper function to read employees
async function readEmployees() {
  try {
    const data = await fs.readFile(EMPLOYEES_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper function to write employees
async function writeEmployees(employees) {
  await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
}

// Mock user for demonstration (in production, use a proper User model)
const mockUser = {
  username: 'admin',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // 'password' hashed
};

// Initialize on startup
initializeEmployeesFile();

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check credentials (in production, query database)
    if (username === mockUser.username && await bcrypt.compare(password, mockUser.password)) {
      const token = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// JWT verification middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token required' });
  }

  // Remove 'Bearer ' prefix if present
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(tokenValue, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Protected routes
app.post('/employees', verifyToken, async (req, res) => {
  try {
    const employees = await readEmployees();
    const newEmployee = {
      _id: Date.now().toString(),
      name: req.body.name,
      department: req.body.department,
      salary: req.body.salary
    };
    employees.push(newEmployee);
    await writeEmployees(employees);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/employees', verifyToken, async (req, res) => {
  try {
    const employees = await readEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/employees/:id', verifyToken, async (req, res) => {
  try {
    const employees = await readEmployees();
    const employee = employees.find(emp => emp._id === req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/employees/:id', verifyToken, async (req, res) => {
  try {
    const employees = await readEmployees();
    const index = employees.findIndex(emp => emp._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    employees[index] = { ...employees[index], ...req.body };
    await writeEmployees(employees);
    res.json(employees[index]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/employees/:id', verifyToken, async (req, res) => {
  try {
    const employees = await readEmployees();
    const index = employees.findIndex(emp => emp._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    employees.splice(index, 1);
    await writeEmployees(employees);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * C++ Integration Endpoint
 * Calls the compiled analytics.exe with salary as an argument.
 * This demonstrates Node.js and C++ interoperability.
 */
app.post('/api/cpp-calculate', verifyToken, (req, res) => {
  const { salary } = req.body;
  
  if (salary === undefined) {
    return res.status(400).json({ message: 'Salary is required' });
  }

  const exePath = path.join(__dirname, 'analytics.exe');

  execFile(exePath, [salary.toString()], (error, stdout, stderr) => {
    if (error) {
      console.error(`C++ Execution Error: ${error}`);
      return res.status(500).json({ message: 'C++ Analytics Engine failed', error: stderr });
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: 'Invalid output from C++ Engine' });
    }
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Note: This demo uses file-based storage. For production, install MongoDB and update the connection string.');
});
