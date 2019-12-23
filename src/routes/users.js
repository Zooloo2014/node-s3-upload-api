const jwt = require('jsonwebtoken')
const repository = require('../datastore/repository')

function register (ctx) {
  const {
    firstName,
    lastName,
    userName,
    password,
    email
  } = ctx.request

  repository.saveUserDetails({
    firstName,
    lastName,
    userName,
    password,
    email
  })
}

function login (ctx) {
  const { username, password } = ctx.request.body
  if (!username) ctx.throw(422, 'Username required.')
  if (!password) ctx.throw(422, 'Password required.')

  const userDetails = repository.authenticateUser(username, password) 
  if (!userDetails) {
    ctx.throw(err.status || 401, err.text)
  }

  const payload = { sub: userDetails.username }
  const secret = process.env.JWT_SECRET || 'secret'
  const token = jwt.sign(payload, secret);
  ctx.body = token
}

module.exports = { register, login }
