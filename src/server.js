const dotenv = require('dotenv').config()
const Koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-body')
const uploadFile = require('./fileUpload')

const port = process.env.PORT || 5000

const app = new Koa()

const router = koaRouter()

router.post('/uploads', async ctx => {
    const fileToUpload = ctx.request.files.file
    const { key, url } = await uploadFile({
        fileName: fileToUpload.name,
        filePath: fileToUpload.path,
        fileType: fileToUpload.type
    })
    ctx.body = { key, url }
})

app.use(koaBody({ multipart: true }))

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(port, () => {
    console.info(`Server running on http://localhost:${port}`)
})
