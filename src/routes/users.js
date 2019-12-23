const jwt = require('jsonwebtoken')
const repository = require('../datastore/repository')

async function register (ctx) {
  const payload = JSON.parse(ctx.request.body)
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

  repository.saveUserDetails({
    firstName,
    lastName,
    userName,
    password,
    email
  })

  ctx.response.status = 201
}

async function login (ctx) {
  const { userName, password } = ctx.request.body
  if (!userName) ctx.throw(422, 'Username required.')
  if (!password) ctx.throw(422, 'Password required.')

  const userDetails = await repository.authenticateUser(userName, password)
  if (!userDetails) {
    ctx.throw(401, 'Not authorised.')
  }

  const payload = { sub: userDetails.username }
  const secret = process.env.JWT_SECRET || 'secret'
  const token = jwt.sign(payload, secret);
  ctx.body = token
}

module.exports = { register, login }
