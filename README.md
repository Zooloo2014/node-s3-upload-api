# node-s3-upload-api

A simple API to securely upload files to an AWS S3 bucket (and retrieve them again)


## Run locally

Update env with appropriate values and copy/rename to .env

- DOMAIN=`localhost`
- PORT=`5000`
- CA_KEY=`certs/server.key`
- CA_CERT=`certs/server.cert`
- DB_URL=`mongodb://localhost:27017/apiUsers`
- DB_NAMESPACE=`api`
- DB_COLLECTION=`apiUsers`
- JWT_SECRET=`<Random string to encode JWT token>`
- BUCKET=`<Name S3 bucket to hold files>`
- ACCESS_KEY=`<AWS access key/user>`
- SECRET_ACCESS_KEY=`<AWS secret>`


To run: `docker-compose -f docker-local.yml up`

Access the API: 

- POST `https://localhost:5000/register`
- POST `https://localhost:5000/login`
- POST `https://localhost:5000/uploads`
- GET `https://localhost:5000/uploads/<filename>`