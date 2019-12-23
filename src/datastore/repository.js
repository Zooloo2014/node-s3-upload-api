
let users
let api

async function dbClient(connection) {
  if (users) {
    return
  }

  try {
    api = await connection.db(process.env.DB_NAMESPACE)
    users = await api.collection(process.env.DB_COLLECTION)
  } catch (e) {
    console.error(`Unable to establish a collection handle to apiUsers: ${e}`)
  }
}

async function saveUserDetails(userDetails) {
  try {
    await users.insertOne(userDetails, { w: 'majority' })
    return { success: true }
  } catch (e) {
    if (String(e).startsWith("MongoError: E11000 duplicate key error")) {
      return { error: "A user with that id already exists." }
    }
    console.error(`Error occurred while adding new user, ${e}.`)
    return { error: e }
  }
}

async function getUserDetails(userName) {
  return await users.findOne({ "userName": userName.toLowerCase() })
}

async function authenticateUser(userName, password) {
  const userDetails = await users.findOne({ "userName": userName.toLowerCase(), "password": password })
  if (userDetails) {
    return true
  }
  return false
}

module.exports = { dbClient, saveUserDetails, getUserDetails, authenticateUser }
