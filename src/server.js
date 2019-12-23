require('dotenv').config()
const Koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const authentication = require('./middleware/authentication')
const userRoutes = require('./routes/users')
const fileRoutes = require('./routes/files')
const port = process.env.PORT || 5000

const app = new Koa()

const router = koaRouter()

router
  .post('/login', bodyParser(), userRoutes.login)
  .post('/uploads', authentication, fileRoutes.upload)
  .get('/uploads/:id', authentication, fileRoutes.download)

app
  .use(koaBody({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.info(`Server running on http://localhost:${port}`)
  })
