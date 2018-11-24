// This is an AWS S3 module
// Load config
const config = require('../config.js');
// Load the SDK for JS
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: config.AWS.region});

const path = require('path');

// Create S3 service object
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

module.exports = {

        uploadFile: (filestream, filename, s3Path) => {
                const params = {
                        Bucket: config.AWS.S3.BucketName,
                        Key: s3Path,
                        Body: filestream
                }

                s3.upload(params, (err, data) => {
                        if (err) {
                                console.log(err);
                        } else {
                                console.log("Uploaded", filename, "to S3 location:", data.Location);
                        }
                });
	}

}
