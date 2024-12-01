const express = require("express");
const asyncHandler = require("express-async-handler");
const { validateUser } = require("../utils/userValidator");
const { createUser} = require("../controllers/userController");
const {getFilepath} = require("../db/queries")
const passport = require("../utils/passportConfig");
const { getUserFolders, findUserByID, getFilesInFolder, getFolderById, saveFileToFolder, deleteFileRecord, createFolder, getfilePathFromDB } = require("../db/queries");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage engine for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname; // Unique file name
    cb(null, uniqueName);
  },
});

// Initialize multer with the storage engine
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
    }
    cb(null, true);
  },
});

const userRouter = express.Router();

// Redirect to /login for unmatched routes or when `/` is accessed directly
userRouter.get("/", (req, res) => {
  res.redirect("/login");
});

userRouter.get("/login", asyncHandler(async (req, res) => {
  res.render("login");
}));

userRouter.post("/login", passport.authenticate("local", {
  failureMessage: "Invalid username or password",
}), (req, res) => {
  const user_id = req.user.user_id;
  const sid = req.sessionID;
  console.log(`User ${user_id} logged in with session ID: ${sid}`);
  res.redirect("/folders");
});

userRouter.get("/signup", asyncHandler(async (req, res) => {
  res.render("signup");
}));

userRouter.post("/signup", validateUser, createUser);

// Dashboard Route
userRouter.get("/folders", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  try {
    const userId = req.user.user_id;
    const { username } = await findUserByID(userId);
    const folders = await getUserFolders(userId);
    res.render("folders", { folders, username, userId });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal Server Error");
  }
});

userRouter.get("/folder/:folder_id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  try {
    const folderId = req.params.folder_id;
    const userId = req.user.user_id;
    const folder = await getFolderById(folderId, userId);
    const files = await getFilesInFolder(folderId);
    res.render("files", { folder, files });
  } catch (error) {
    console.error("Error fetching folder data:", error);
    res.status(500).send("Internal Server Error");
  }
});

// File upload route
userRouter.post("/files/upload/:folder_id", upload.array("files", 10), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const folderId = req.params.folder_id;
    const filesDetailsArray = req.files.map((file) => {
      const safeFilename = path.basename(file.originalname);
      return { filename: safeFilename, filepath: file.path };
    });

    await saveFileToFolder(filesDetailsArray, folderId);

    const referer = req.get("Referrer");
    res.redirect(referer);  // Redirect to the previous page
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// File delete route
userRouter.delete("/files/delete/:file_id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const fileId = req.params.file_id;
    const { filepath } = await getFilepath(fileId);

    // Deleting the file from the uploads folder
    fs.unlink(filepath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).send("Error deleting file");
      }
    });

    // Deleting the file record from the DB
    await deleteFileRecord(fileId);

    const referer = req.get("Referrer");
    res.redirect(referer);  // Redirect to the previous page
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Folder creation route
userRouter.post("/folders/create/:userId", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }

  const { folder_name } = req.body;
  const userId = req.params.userId;

  try {
    await createFolder(userId, folder_name);
    res.redirect("/folders");  // Redirect to the folders page
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).send("Internal Server Error");
  }
});

// File download route
userRouter.get("/files/download/:filename", async (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);

  try {
    const { filepath } = await getfilePathFromDB(safeFilename);
    const filePath = path.join(__dirname, "../", filepath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found on the server.");
    }

    // Send the file for download
    res.download(filePath, safeFilename, (err) => {
      if (err) {
        console.error("Error during file download:", err);
        return res.status(500).send("Error downloading the file.");
      }
    });
  } catch (error) {
    console.error("Error fetching file path:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = userRouter;
