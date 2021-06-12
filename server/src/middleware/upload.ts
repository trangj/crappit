// uploading to aws
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: "us-east-2",
});
const s3 = new AWS.S3({ apiVersion: "latest" });

export const upload = multer({
	storage: multerS3({
		s3,
		bucket: "crappit-images",
		acl: "public-read",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: (req, file, cb) => {
			cb(null, Date.now().toString() + path.extname(file.originalname));
		},
	}),
});

export const deleteFile = (Key: string) => {
	s3.deleteObject(
		{
			Bucket: "crappit-images",
			Key,
		},
		(err, data) => {
			if (err) throw Error(err.message);
		}
	);
};
