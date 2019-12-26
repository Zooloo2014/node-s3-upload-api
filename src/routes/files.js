const fileService = require('../services/fileService')

async function upload (ctx) {
  const fileToUpload = ctx.request.files.file
  const currentUser = ctx.request.jwtPayload.sub
  const { key, url } = await fileService.uploadFile(fileToUpload)
  await fileService.setTags(key, [{ Key: 'username', Value: `${currentUser}` }])
  ctx.body = { key, url }
}

async function download (ctx) {
  const fileToDownload = ctx.params.id
  const currentUser = ctx.request.jwtPayload.sub
  const allowed = await fileService.downloadAllowed(fileToDownload, currentUser)
  if (!allowed) {
    ctx.throw(404, 'Not found.')
  }

  const fileData = await fileService.downloadFile(fileToDownload)
  ctx.set('Content-Type', fileData.ContentType)
  ctx.body = fileData.Body
}

module.exports = { upload, download }
