const jwt = require('jsonwebtoken')
const repository = require('../datastore/repository')
const hashingService = require('../services/hashingService')

async function register (ctx) {
  const payload = typeof ctx.request.body == 'string' ? JSON.parse(ctx.request.body) : ctx.request.body
  const {
    firstName,
    lastName,
    userName,
    password,
    email
  } = payload

  const userDetails = await repository.getUserDetails(userName)
  if (userDetails) {
    ctx.throw(409, 'User already exists.')
  }

  const salt = hashingService.generateSalt(16)
  const hashed = hashingService.hashWithSalt(password, salt)

  repository.saveUserDetails({
    firstName,
    lastName,
    userName,
    password: hashed.passwordHash,
    salt: hashed.salt,
    email
  })

  ctx.response.status = 201
}

async function login (ctx) {
  const { userName, password } = ctx.request.body
  if (!userName) ctx.throw(422, 'Username required.')
  if (!password) ctx.throw(422, 'Password required.')

  const userDetails = await repository.getUserDetails(userName)
  if (!userDetails) {
    ctx.throw(401, 'Not authorised.')
  }

  const hashed = hashingService.hashWithSalt(password, userDetails.salt)

  const authed = await repository.authenticateUser(userName, hashed.passwordHash)
  if (!authed) {
    ctx.throw(401, 'Not authorised.')
  }

  const payload = { sub: userDetails.userName }
  const secret = process.env.JWT_SECRET || 'secret'
  const token = jwt.sign(payload, secret);
  ctx.body = token
}

module.exports = { register, login }
