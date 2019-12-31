require('dotenv').config()
const fs = require('fs')
const path = require('path')
const https = require('https')
const Koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const authorisation = require('./middleware/authorisation')
const userRoutes = require('./routes/users')
const fileRoutes = require('./routes/files')
const repository = require('./datastore/repository')
const MongoClient = require('mongodb').MongoClient
const apiVersion = '/v1'

MongoClient
  .connect(`${process.env.DB_URL}`, { useNewUrlParser: true })
  .catch(err => console.error(err.stack))
  .then(client => repository.dbClient(client))

const router = koaRouter()

router
  .post(apiVersion + '/register', bodyParser(), userRoutes.register)
  .post(apiVersion + '/login', bodyParser(), userRoutes.login)
  .post(apiVersion + '/uploads', authorisation, fileRoutes.upload)
  .get(apiVersion + '/uploads/:id', authorisation, fileRoutes.download)

const app = new Koa()

app
  .use(koaBody({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods())

const config = {
  domain: process.env.DOMAIN,
  https: {
    port: process.env.PORT || 5000,
    options: {
      key: fs.readFileSync(path.resolve(process.cwd(), `${process.env.CA_KEY}`), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), `${process.env.CA_CERT}`), 'utf8').toString()
    }
  }
}

https
  .createServer(config.https.options, app.callback())
  .listen(config.https.port, err => {
    if (!!err) {
      console.error('HTTPS server failed to start ', err, (err && err.stack))
    } else {
      console.log(`HTTPS server running at https://${config.domain}:${config.https.port}`)
    }
  })
