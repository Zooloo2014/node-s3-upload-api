const jwt = require('jsonwebtoken')

function login (ctx) {
  const { username, password } = ctx.request.body
  if (!username) ctx.throw(422, 'Username required.')
  if (!password) ctx.throw(422, 'Password required.')

  // TODO Check that user is bona fide

  const payload = { sub: username }
  const secret = process.env.JWT_SECRET || 'secret'
  const token = jwt.sign(payload, secret);
  ctx.body = token
}

module.exports = { login }
