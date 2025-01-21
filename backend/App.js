// This code assumes the use of Node.js with Express for the backend and MongoDB as the database.
// You will need Mongoose for MongoDB schema definitions and queries.

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//models
const User = require('./models/User');
const Report =require('./models/Reports');
const ServiceAdmin=require('./models/Admin');


// middleware
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Replace this with your MongoDB connection string
mongoose.connect('mongodb://localhost:27017',{ useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'ServiceDesk'})
.then(()=>{
    console.log("database connected");
});



const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'f101456e0383446f7893944e49b4fa937e907ba826dfabfdb4785fa27b116a83'); // Replace 'your-secret-key' with your JWT secret
    req.user = decoded; // Add user info from token to request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware for authentication
// const authenticate = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return res.status(401).send('Access denied. No token provided.');

//   try {
//     const decoded = jwt.verify(token, 'f101456e0383446f7893944e49b4fa937e907ba826dfabfdb4785fa27b116a83');
//     req.user = decoded;
//     next();
//   } catch (ex) {
//     res.status(400).send('Invalid token.');
//   }
// };

// Routes

// User signup
app.post('/signup', async (req, res) => {
  const { username, password, name, department, location, email,contact } = req.body;

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = new User({
      username,
      password: hashedPassword,
      name,
      department,
      location,
      email,
      contact
    });
    await user.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// User login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid username or password.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid username or password.');

    const token = jwt.sign({ _id: user._id }, 'f101456e0383446f7893944e49b4fa937e907ba826dfabfdb4785fa27b116a83');
    res.status(200).json({ message: 'Login successful', username: user.username, contact:user.contact,token ,id :user._id});  } catch (error) {
    res.status(500).send('Server error.');
  }
});

// Create a report
app.post('/reports', async (req, res) => {
  console.log('Received data:', req.body);
  const { username,complaint, department, location,contact } = req.body;
 
  // Validate the incoming data
  if (!username||!complaint || !department || !location|| !contact) {
    return res.status(400).send('Missing required fields:username, complaint, department, or location or contact.');
  }

  try {
   
    // Create a new report document
    const report = new Report({
      username, 
      complaint,
      department,
      location,
      contact,
      
    });

    // Save the report to the database
    await report.save();

    // Respond with success
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).send('An error occurred while saving the report.');
  }
});
//get all reports
app.get('/Greports', async (req, res) => {
  try {
    const complaints = await Report.find(); // Fetch all complaints
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'An error occurred while fetching complaints.' });
  }
});
//get all reports (paginated)
app.get('/Greports_2', async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = status ? { status: new RegExp(`^${status}$`, 'i') } : {};

  const complaints = await Report.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalComplaints = await Report.countDocuments(filter);
  res.json({
    complaints,
    totalPages: Math.ceil(totalComplaints / limit),
  });
});

//get reports based on username
app.get('/Greports/:username',async (req, res) => {
  const { username } = req.params;

  // Filter complaints by username
  const userComplaints = await Report.find({ username });

  if (userComplaints.length > 0) {
    res.status(200).json(userComplaints);
  } else {
    res.status(404).json({ message: 'No complaints found for this user.' });
  }
});

//update status
app.put('/Greports/update-status/:id', async (req, res) => {
  const { id } = req.params; // Get the complaint ID from the URL
  const { status } = req.body; // Get the new status from the request body

  try {
    // Validate the status
    const validStatuses = ['escalated', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Declare fields
    let EscalatedAt = null;
    let completedAt = null;

    // Update timestamps conditionally
    if (status === 'escalated') {
      EscalatedAt = Date.now(); // Set onGoingAt to current timestamp
    } else if (status === 'completed') {
      completedAt = Date.now(); // Set completedAt to current timestamp
    }

    // Build the update object
    const update = {
      status,
      ...(EscalatedAt && { EscalatedAt }), // Include onGoingAt if set
      ...(completedAt && { completedAt }), // Include completedAt if set
    };

    // Find the complaint by ID and update it
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      update, // Use the constructed update object
      { new: true } // Return the updated document
    );

    // Handle case where the report is not found
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Respond with success and the updated report
    res.status(200).json({ message: 'Status updated successfully', report: updatedReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//get all escalated complaints
app.get('/ServiceAdminEscalate/escalated', async (req, res) => {
  try {
    // Query for complaints with status 'escalated'
    const escalatedComplaints = await Report.find({ status:'escalated' });

    if (escalatedComplaints.length > 0) {
      // Return the escalated complaints if found
      res.status(200).json(escalatedComplaints);
    } else {
      // No complaints found
      res.status(404).json({ message: 'No escalated complaints found.' });
    }
  } catch (error) {
    // Catch and handle errors
    console.error('Error fetching escalated complaints:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
//now based on id to view details
app.get('/ServiceAdminEscalate/escalated/:id',async (req, res) => {
  const { id } = req.params; // Extract the complaint ID from the URL

  try {
    // Find the complaint by its ID
    const complaint = await Report.findById(id);

    if (complaint) {
      // If complaint is found, return it
      res.status(200).json(complaint);
    } else {
      // If complaint is not found, return 404
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    // Catch and handle any errors
    console.error('Error fetching complaint by ID:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PUT endpoint to update complaint status and remarks
app.put('/ServiceAdminEscalate/escalated/update/:id', async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  let completedAt = null;

  if(status==='completed'){
    completedAt=Date.now()
  }

  try {
    const complaint = await Report.findByIdAndUpdate(
      id,
      { status, completedAt, remarks },
      { new: true } // Return the updated document
    );

    if (complaint) {
      res.status(200).json({ message: 'Complaint updated successfully', complaint });
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    console.error('Error updating complaint:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
//to update verified status
app.put('/reports/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndUpdate(
      id,
      { verified: true, verifiedAt: new Date() },
      { new: true } // Return the updated document
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.status(200).json({ message: 'Report verified successfully', report });
  } catch (error) {
    console.error('Error verifying report:', error);
    res.status(500).json({ message: 'An error occurred while verifying the report.' });
  }
});

//history of complaints
app.get('/history', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 results per page

  try {
    const history = await Report.find({ status: 'Completed', verified: true })
      .select('username complaint department location contact completedAt verified') // Fetch only necessary fields
      .sort({ completedAt: -1 }) // Sort by completion date (most recent first)
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(parseInt(limit)); // Limit the number of records returned

    const total = await Report.countDocuments({ status: 'Completed', verified: true });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalRecords: total,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'An error occurred while fetching history.' });
  }
});


// Get reports for the logged-in user
// app.get('/reports', authenticate, async (req, res) => {
//   try {
//     const reports = await Report.find({ userId: req.user._id });
//     res.send(reports);
//   } catch (error) {
//     res.status(500).send('Server error.');
//   }
// });

// Start the server
const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
