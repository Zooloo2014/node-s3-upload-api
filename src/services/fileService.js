const aws = require('aws-sdk')
const fs = require('fs')

let s3

const getS3Ref = () => {
  if (!s3) {
    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    })

    s3 = new aws.S3({
      apiVersion: '2006-03-01'
    })
  }
}

const setTags = async (key, tags) => {
  return new Promise((resolve, reject) => {
    getS3Ref()
    const params = {
      Bucket: process.env.BUCKET,
      Key: key,
      Tagging: {
        TagSet: tags
      }
    }

    s3.putObjectTagging(params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const getTags = async key => {
  return new Promise((resolve, reject) => {
    getS3Ref()
    const params = {
      Bucket: process.env.BUCKET,
      Key: key
    }

    s3.getObjectTagging(params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const uploadFile = async ({ fileName, filePath, fileType }) => {
  return new Promise((resolve, reject) => {
    getS3Ref()
    const stream = fs.createReadStream(filePath)
    stream.on('error', err => {
        reject(err)
    })

    s3.upload({
      Bucket: process.env.BUCKET,
      Body: stream,
      Key: fileName, 
      ContentType: fileType
    },
    (err, data) => {
      if (err) {
        reject(err)
      } else if (data) {
        resolve({
            key: data.Key,
            url: data.Location
        })
      }
    })
  })
}

const downloadAllowed = async (fileName, userName) => {
  const tags = await getTags(fileName)
  return (tags.TagSet.filter((tag) => (tag.Key == 'username') && (tag.Value == userName))).length == 1
}

const downloadFile = async fileName => {
  return new Promise((resolve, reject) => {
    getS3Ref()
    s3.getObject({
      Bucket: process.env.BUCKET,
      Key: fileName
    },
    (err, data) => {
      if (err) {
        reject(err)
      } else if (data) {
        resolve(data)
      }
    })
  })
}

module.exports = { uploadFile, downloadAllowed, downloadFile, setTags, getTags }
