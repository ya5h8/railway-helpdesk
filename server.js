// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const { User, Complaint } = require("./dbConnect");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://yashgawande47:ADMIN@cluster2.3zkkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2")
//     .then(() => console.log("✅ MongoDB Connected Successfully!"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // User Registration Route
// app.post("/register", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         // Create new user
//         const newUser = new User({ name, email, password });
//         await newUser.save();

//         res.status(201).json({ success: true, message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // Start Server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const { Complaint } = require("./dbConnect"); // Import the User and Complaint models
// const analyzeComplaint = require("./controllers/aiModel"); // Import the AI model for complaint analysis

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://yashgawande47:ADMIN@cluster2.3zkkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2")
//     .then(() => console.log("✅ MongoDB Connected Successfully!"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // User Registration Route
// app.post("/register", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ success: false, message: "User already exists" });
//         }

//         // Create new user
//         const newUser = new User({ name, email, password });
//         await newUser.save();

//         res.status(201).json({ success: true, message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

// // Complaint Submission Route
// app.post("/submit-complaint", async (req, res) => {
//     try {
//         const { name, email, complaint, images } = req.body;

//         // Analyze the complaint using the AI model
//         const { priority, department } = analyzeComplaint(complaint);

//         // Create a new complaint document
//         const newComplaint = new Complaint({
//             name,
//             email,
//             complaint,
//             priority,
//             department,
//             images: images || [], // Handle case where no images are uploaded
//         });

//         // Save the complaint to the database
//         await newComplaint.save();

//         // Send a success response
//         res.status(201).json({
//             success: true,
//             message: "Complaint submitted successfully",
//             data: newComplaint,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to submit complaint",
//             error: error.message,
//         });
//     }
// });


// // Start the server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// --------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------
// server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const complaintRoutes = require("./routes/complaintRoutes"); // Import the complaint routes

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect("mongodb+srv://yashgawande47:ADMIN@cluster2.3zkkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2")
//     .then(() => console.log("✅ MongoDB Connected Successfully!"))
//     .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // Use the complaint routes
// app.use("/", complaintRoutes);

// // Start the server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));   

// --------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const connectDB = require("./dbConnect");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from "src"
app.use(express.static(path.join(__dirname, "src")));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'src', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only images are allowed!');
    }
  }
});

// Connect to MongoDB
connectDB();

// Define schemas
const mongoose = require("mongoose");

// Complaint schema
const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  complaint: { type: String, required: true },
  priority: {
    type: String,
    enum: ["High Priority", "Medium Priority", "Low Priority"],
    default: "Medium Priority",
  },
  status: {
    type: String,
    enum: ["New", "In Progress", "Resolved", "Closed"],
    default: "New",
  },
  department: {
    type: String,
    enum: ["Cleanliness", "Emergency", "Canteen", "General"],
    default: "General",
  },
  images: [String], // Array of image URLs/paths
  date: { type: Date, default: Date.now },
});

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
  date: { type: Date, default: Date.now },
});

// Department user schema
const departmentUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: {
    type: String,
    enum: ["Cleanliness", "Emergency", "Canteen"],
    required: true,
  },
  date: { type: Date, default: Date.now },
});

// Create models
const Complaint = mongoose.model("Complaint", complaintSchema);
const User = mongoose.model("User", userSchema);
const DepartmentUser = mongoose.model("DepartmentUser", departmentUserSchema);

// Submit a complaint with file upload support
app.post("/submit-complaint", upload.array('images', 5), async (req, res) => {
  try {
    const { name, email, complaint, priority, department } = req.body;

    // Create image paths array
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newComplaint = new Complaint({
      name: name || "Anonymous",
      email: email || "no-email@example.com",
      complaint,
      priority: priority || "Medium Priority",
      department: department || "General",
      images: imagePaths
    });

    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully!",
      data: newComplaint,
    });
  } catch (error) {
    console.error("Complaint submission error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "An error occurred while submitting the complaint" 
    });
  }
});

// Get all complaints
app.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ date: -1 }); // Most recent first
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get complaints by user email
app.get("/user-complaints/:email", async (req, res) => {
  try {
    const complaints = await Complaint.find({ email: req.params.email }).sort({
      date: -1,
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get complaints by department
app.get("/department-complaints/:department", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      department: req.params.department,
    }).sort({ date: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update complaint status
app.put("/complaint/:id", async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedComplaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, data: updatedComplaint });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User registration
app.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create new user
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password (in a real app, use proper password hashing)
    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Department login
app.post("/department-login", async (req, res) => {
  try {
    const { email, password, department } = req.body;

    // Find department user
    const departmentUser = await DepartmentUser.findOne({ email, department });
    if (!departmentUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password (in a real app, use proper password hashing)
    if (departmentUser.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        name: departmentUser.name,
        email: departmentUser.email,
        department: departmentUser.department,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create sample department users (for testing)
app.get("/setup-department-users", async (req, res) => {
  try {
    // Check if department users already exist
    const existingUsers = await DepartmentUser.find();
    if (existingUsers.length > 0) {
      return res.json({
        success: true,
        message: "Department users already set up",
        count: existingUsers.length,
      });
    }

    // Create department users
    const departmentUsers = [
      {
        name: "Cleanliness Department",
        email: "clean@railway.com",
        password: "clean123",
        department: "Cleanliness",
      },
      {
        name: "Emergency Department",
        email: "emergency@railway.com",
        password: "emergency123",
        department: "Emergency",
      },
      {
        name: "Canteen Department",
        email: "canteen@railway.com",
        password: "canteen123",
        department: "Canteen",
      },
    ];1

    await DepartmentUser.insertMany(departmentUsers);

    res.json({
      success: true,
      message: "Department users created successfully",
      data: departmentUsers.map((user) => ({
        name: user.name,
        email: user.email,
        department: user.department,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve index.html for all routes (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));







// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const multer = require("multer");
// const connectDB = require("./dbConnect");
// const jwt = require("jsonwebtoken"); // Add JWT for authentication
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve static files from "src"
// app.use(express.static(path.join(__dirname, "src")));
// app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// // Multer configuration for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, 'src', 'uploads'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
//   fileFilter: (req, file, cb) => {
//     const allowedFileTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedFileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb('Error: Only images are allowed!');
//     }
//   }
// });

// // Connect to MongoDB
// connectDB();

// // Define schemas
// const mongoose = require("mongoose");

// // Complaint schema
// const complaintSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   complaint: { type: String, required: true },
//   priority: {
//     type: String,
//     enum: ["High Priority", "Medium Priority", "Low Priority"],
//     default: "Medium Priority",
//   },
//   status: {
//     type: String,
//     enum: ["New", "In Progress", "Resolved", "Closed"],
//     default: "New",
//   },
//   department: {
//     type: String,
//     enum: ["Cleanliness", "Emergency", "Canteen", ],
//     default: "Emergency",
//   },
//   images: [String], // Array of image URLs/paths
//   date: { type: Date, default: Date.now },
// });

// // User schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["User", "Admin"], default: "User" },
//   date: { type: Date, default: Date.now },
// });

// // Department user schema
// const departmentUserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   department: {
//     type: String,
//     enum: ["Cleanliness", "Emergency", "Canteen"],
//     required: true,
//   },
//   date: { type: Date, default: Date.now },
// });

// // Create models
// const Complaint = mongoose.model("Complaint", complaintSchema);
// const User = mongoose.model("User", userSchema);
// const DepartmentUser = mongoose.model("DepartmentUser", departmentUserSchema);

// // Authentication Middleware
// const authenticateUser = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//     req.user = decoded; // Attach the user's information to the request object
//     next();
//   } catch (error) {
//     res.status(400).json({ success: false, message: "Invalid token." });
//   }
// };

// // Submit a complaint with file upload support
// app.post("/submit-complaint", authenticateUser, upload.array('images', 5), async (req, res) => {
//   try {
//     const { complaint, priority, department } = req.body;

//     // Get the logged-in user's information from the request object
//     const { name, email } = req.user;

//     // Create image paths array
//     const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

//     const newComplaint = new Complaint({
//       name, // Use the logged-in user's name
//       email, // Use the logged-in user's email
//       complaint,
//       priority: priority || "Medium Priority",
//       department: department || "Emergency",
//       images: imagePaths
//     });

//     await newComplaint.save();

//     res.status(201).json({
//       success: true,
//       message: "Complaint submitted successfully!",
//       data: newComplaint,
//     });
//   } catch (error) {
//     console.error("Complaint submission error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || "An error occurred while submitting the complaint" 
//     });
//   }
// });

// // Get all complaints
// app.get("/complaints", async (req, res) => {
//   try {
//     const complaints = await Complaint.find().sort({ date: -1 }); // Most recent first
//     res.json({ success: true, data: complaints });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get complaints by user email
// app.get("/user-complaints/:email", async (req, res) => {
//   try {
//     const complaints = await Complaint.find({ email: req.params.email }).sort({
//       date: -1,
//     });
//     res.json({ success: true, data: complaints });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Get complaints by department
// app.get("/department-complaints/:department", async (req, res) => {
//   try {
//     const complaints = await Complaint.find({
//       department: req.params.department,
//     }).sort({ date: -1 });
//     res.json({ success: true, data: complaints });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Update complaint status
// app.put("/complaint/:id", async (req, res) => {
//   try {
//     const updatedComplaint = await Complaint.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );

//     if (!updatedComplaint) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Complaint not found" });
//     }

//     res.json({ success: true, data: updatedComplaint });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // User registration
// app.post("/register", async (req, res) => {
//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email: req.body.email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });
//     }

//     // Create new user
//     const newUser = new User(req.body);
//     await newUser.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: { name: newUser.name, email: newUser.email, role: newUser.role },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // User login
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     // Check password (in a real app, use proper password hashing)
//     if (user.password !== password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { _id: user._id, name: user.name, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" } // Token expires in 1 hour
//     );

//     res.json({
//       success: true,
//       message: "Login successful",
//       data: { name: user.name, email: user.email, role: user.role, token },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Department login
// app.post("/department-login", async (req, res) => {
//   try {
//     const { email, password, department } = req.body;

//     // Find department user
//     const departmentUser = await DepartmentUser.findOne({ email, department });
//     if (!departmentUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     // Check password (in a real app, use proper password hashing)
//     if (departmentUser.password !== password) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     res.json({
//       success: true,
//       message: "Login successful",
//       data: {
//         name: departmentUser.name,
//         email: departmentUser.email,
//         department: departmentUser.department,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Create sample department users (for testing)
// app.get("/setup-department-users", async (req, res) => {
//   try {
//     // Check if department users already exist
//     const existingUsers = await DepartmentUser.find();
//     if (existingUsers.length > 0) {
//       return res.json({
//         success: true,
//         message: "Department users already set up",
//         count: existingUsers.length,
//       });
//     }

//     // Create department users
//     const departmentUsers = [
//       {
//         name: "Cleanliness Department",
//         email: "clean@railway.com",
//         password: "clean123",
//         department: "Cleanliness",
//       },
//       {
//         name: "Emergency Department",
//         email: "emergency@railway.com",
//         password: "emergency123",
//         department: "Emergency",
//       },
//       {
//         name: "Canteen Department",
//         email: "canteen@railway.com",
//         password: "canteen123",
//         department: "Canteen",
//       },
//     ];

//     await DepartmentUser.insertMany(departmentUsers);

//     res.json({
//       success: true,
//       message: "Department users created successfully",
//       data: departmentUsers.map((user) => ({
//         name: user.name,
//         email: user.email,
//         department: user.department,
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // Serve index.html for all routes (for client-side routing)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "src", "index.html"));
// });

// // Start server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));