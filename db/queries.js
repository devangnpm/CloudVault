const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new user
async function createUser(username, email, hashed_password) {
  return prisma.user.create({
    data: {
      username: username,
      email: email,
      hashed_password: hashed_password,
    },
  });
}

// Find a user by username
async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: {
      username: username,
    }
  });
}

// Find a user by user ID
async function findUserByID(user_id) {
  return prisma.user.findUnique({
    where: {
      user_id: user_id,
    },
  });
}

// Create a new folder
async function createFolder(user_id,folder_name) {
  return prisma.folder.create({
    data: {
      user_id: user_id,
      folder_name: folder_name,
    },
  });
}

async function getUserFolders(user_id) {
  // Fetch folders and associated files for a specific user
  return await prisma.folder.findMany({
    where: { user_id: user_id },
  })
}

async function getFolderById(folderId, userId) {
  if (!folderId || !userId) {
    throw new Error("folderId and userId are required");
  }
  
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        folder_id: parseInt(folderId, 10), // Using folder_id as the unique identifier
        user_id: userId, // Check if the folder belongs to the user
      },
    });

    if (!folder) {
      throw new Error(`Folder with ID ${folderId} not found or you don't have access`);
    }

    return folder;
  } catch (error) {
    console.error('Error fetching folder by ID:', error);
    throw new Error('Error fetching folder');
  }
}

async function getFilesInFolder(folderId) {
  return await prisma.file.findMany({
    where: {folder_id: parseInt(folderId, 10)},
  });
}

// Save file details to the database
async function saveFileToFolder(fileDetails, folderId) {
  const { filename, filepath } = fileDetails;
  console.log(fileDetails);

  console.log("logfolderid:" + folderId);
  
  try {
    const savedFile = await prisma.file.create({
      data: {
        folder_id: parseInt(folderId, 10), // The folder where the file is being saved
        filename: filename,  // The original filename
        filepath: filepath,  // The path where the file is stored
      },
    });
    
    // Return the saved file object
    return savedFile;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}


async function getFilepath(fileId) {
  return prisma.file.findFirst({
    where: {
      file_id: parseInt(fileId,10)
    }
  });
}

  

// Export the functions
module.exports = {
  createUser,
  findUserByUsername,
  findUserByID,
  createFolder,
  getUserFolders,
  getFilesInFolder,
  saveFileToFolder,
  getFolderById,
  getFilepath,
};
