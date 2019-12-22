require('dotenv').config()

const AWS = require('aws-sdk')

const ID = process.env.ACCESS_KEY
const SECRET = process.env.SECRET_ACCESS_KEY
const BUCKET_NAME = 'test-bucket-47578585'

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
})

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint: "eu-west-1"
    }
}

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack)
    else console.log('Bucket Created Successfully', data.Location)
})
