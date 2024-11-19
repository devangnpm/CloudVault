const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function createUser(username,email, hashed_password) {
  return await prisma.user.create({
    data: {
      username : username,
      email : email,
      hashed_password: hashed_password,
    }
  });
}

export async function findUserByUsername(username) {
  return await prisma.user.findUnique({
    where: {
      username: username,
    }
  });
}

export async function findUserByID(user_id) {
  return await prisma.user.findUnique({
    where: {
      user_id: user_id,
    }
  });
}




export async function createFolder(params) {
  return await prisma.folder.create({
    data: {
      folder_name : folder_name,
      
    }
  })
}

