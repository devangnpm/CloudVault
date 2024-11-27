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


async function getFilesInFolder(folderId) {
  return await prisma.file.findMany({
    where: {folder_id: parseInt(folderId, 10)},
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
};
