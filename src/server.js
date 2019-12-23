require('dotenv').config()
const Koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const authorisation = require('./middleware/authorisation')
const userRoutes = require('./routes/users')
const fileRoutes = require('./routes/files')
const repository = require('./datastore/repository')
const MongoClient = require('mongodb').MongoClient

const port = process.env.PORT || 5000

MongoClient
  .connect(`${process.env.DB_URL}`, { useNewUrlParser: true })
  .catch(err => {
    console.error(err.stack)
  })
  .then(client => {
    repository.dbClient(client)
  })

const app = new Koa()
const router = koaRouter()

router
  .post('/register', bodyParser(), userRoutes.register)
  .post('/login', bodyParser(), userRoutes.login)
  .post('/uploads', authorisation, fileRoutes.upload)
  .get('/uploads/:id', authorisation, fileRoutes.download)

app
  .use(koaBody({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.info(`Server running on http://localhost:${port}`)
  })
