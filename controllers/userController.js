const bcryptjs = require('bcryptjs');
const db = require("../db/queries")

async function createUser(req,res) {
    const {username,email,password} = req.body;
    console.log(`Request body: ${JSON.stringify(req.body)}`);

    try {
        const hashed_password = await bcryptjs.hash(password,10);
        await db.createUser(username,email,hashed_password);
        res.status(200).render('signup-success', {username: username});
    } catch (error) {
        console.log(error)
        next(error);
    }
}


async function getUserFoldersAndFiles(user_id) {
    const userData = await db.getUserFoldersAndFiles(user_id);
    return userData;
}


module.exports = {
    createUser,
    getUserFoldersAndFiles,
}