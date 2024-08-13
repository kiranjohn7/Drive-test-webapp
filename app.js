// Packages
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("connect-flash")

// Controllers
const loginController = require("./controllers/loginController");
const signupController = require("./controllers/signupController");
const g2updateController = require("./controllers/g2updateController");
const g2detailsController = require("./controllers/g2detailsController");
const homepageController = require("./controllers/homepageController");
const gpageController = require("./controllers/gpageController");
const g2pageController = require("./controllers/g2pageController");
const loginpageController = require("./controllers/loginpageController");
const logoutController = require("./controllers/logoutController");
const examinerController = require("./controllers/examinerController");
const { renderG2Page, bookAppointment } = require("./controllers/g2pageController");
const { renderAppointmentPage, addAppointment, resultController, postresult } = require("./controllers/appointmentController");

// Initialize express
const app = new express();
app.use(express.static("public"));
app.use(flash());

// Middleware
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");
const accessMiddleware = require("./middleware/accessMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const driverMiddleware = require("./middleware/driverMiddleware");
const examinerMiddleware = require("./middleware/examinerMiddleware");

// API Routes
const apiRoutes = require('./routes/api');

// Set templating engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "ronaldo",
    resave: false,
  })
);

// For connection
mongoose.connect(
  "mongodb+srv://kiranjohn1940:admin@drivetest.plyscbc.mongodb.net/drive_Test?retryWrites=true&w=majority&appName=drivetest"
);

// Global Variable
global.loggedIn = null;
global.userType = null;

app.use("*", (req, res, next) => {
  if (req.session.user) {
    loggedIn = req.session.user;
    res.locals.loggedIn = loggedIn;
    res.locals.userType = userType;
  }
  next();
});

// Home page
app.get("/", homepageController);
// G page
app.get("/g", authMiddleware, driverMiddleware, accessMiddleware, gpageController);
// G2 page
app.get("/g2", authMiddleware, driverMiddleware, accessMiddleware, renderG2Page);
app.post("/g2/details", g2detailsController);
app.post("/g2/update", g2updateController);
// Login
app.get("/login", redirectIfAuthenticatedMiddleware, loginpageController);
app.post("/login", loginController);
app.post("/signup", signupController);
// Logout
app.get("/logout", logoutController);
// Appointment
app.get("/appointment", authMiddleware, adminMiddleware, renderAppointmentPage);
app.post("/appointment", authMiddleware, adminMiddleware, addAppointment);
// Examiner
app.get("/examiner", authMiddleware, examinerMiddleware, examinerController.getExaminerPage);
app.post("/updateDriverStatus", authMiddleware, examinerMiddleware, examinerController.updateDriverStatus);
// Book Appointment
app.post("/book-appointment", authMiddleware, bookAppointment);

app.get("/result", authMiddleware, adminMiddleware, resultController);
app.post("/result", authMiddleware, adminMiddleware, postresult);



// Use API routes
app.use('/api', apiRoutes);

app.listen(4000, () => {
  console.log("App is listening at port 4000");
});
