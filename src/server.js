require('dotenv').config()
const Koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser')
const fileService = require('./fileService')
const userService = require('./routes/userService')
const port = process.env.PORT || 5000

const app = new Koa()

const router = koaRouter()

router
  .post('/register', bodyParser(), userService.register)
  .post('/uploads', async ctx => {
    const fileToUpload = ctx.request.files.file
    const { key, url } = await fileService.uploadFile({
        fileName: fileToUpload.name,
        filePath: fileToUpload.path,
        fileType: fileToUpload.type
    })
    ctx.body = { key, url }
  })
  .get('/uploads/:id', async ctx => {
    const fileToDownload = ctx.params.id
    const fileData = await fileService.downloadFile(fileToDownload)
    ctx.body = fileData.Body
  })

app
  .use(koaBody({ multipart: true }))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => {
    console.info(`Server running on http://localhost:${port}`)
  })
