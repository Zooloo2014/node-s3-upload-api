const crypto = require('crypto')

const generateSalt = length => {
  return crypto.randomBytes(Math.ceil(length / 2))
          .toString('hex')
          .slice(0, length)
}

const hashWithSalt = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password);
  const passwordHash = hash.digest('hex');
  return {
      salt,
      passwordHash
  }
}

module.exports = { generateSalt, hashWithSalt }
