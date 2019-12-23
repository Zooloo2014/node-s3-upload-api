const fileService = require('../services/fileService')

async function upload (ctx) {
  const fileToUpload = ctx.request.files.file
  const { key, url } = await fileService.uploadFile({
      fileName: fileToUpload.name,
      filePath: fileToUpload.path,
      fileType: fileToUpload.type
  })
  ctx.body = { key, url }
}

async function download (ctx) {
  const fileToDownload = ctx.params.id
  const fileData = await fileService.downloadFile(fileToDownload)
  ctx.body = fileData.Body
}

module.exports = { upload, download }
