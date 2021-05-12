// uploading to aws
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: "us-east-2",
});
const s3 = new AWS.S3({ apiVersion: "latest" });

const upload = multer({
	storage: multerS3({
		s3,
		bucket: "crappit-images",
		acl: "public-read",
		metadata: (req, file, cb) => {
			cb(null, { fieldName: "Image" });
		},
		key: (req, file, cb) => {
			cb(null, Date.now().toString() + path.extname(file.originalname));
		},
	}),
});

module.exports = upload;
