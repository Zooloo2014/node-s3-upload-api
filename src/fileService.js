const aws = require('aws-sdk')
const fs = require('fs')

const uploadFile = async ({ fileName, filePath, fileType }) => {
    return new Promise((resolve, reject) => {
        aws.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        })

        const s3 = new aws.S3({
            apiVersion: '2006-03-01'
        })

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

const downloadFile = async fileName => {
    return new Promise((resolve, reject) => {
        aws.config.update({
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        })

        const s3 = new aws.S3({
            apiVersion: '2006-03-01'
        })

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

module.exports = { uploadFile, downloadFile }
