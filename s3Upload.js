const fs = require('fs')
const aws = require('aws-sdk')
const path = require('path')

const bucketName = process.env.AWS_S3_BUCKET_NAME

const prefix = process.env.AWS_S3_DIRECTORY

if (!bucketName) {
    throw new Error("No bucket specified")
    process.exitCode(1)
}

const distFolder = path.join(__dirname, "dist")


/**
 * Get the ContentType for an extension
 * @param extension
 * @returns {*}
 */
function getContentTypeForExtension(extension) {
    if (extension === 'css') {
        return 'text/css'
    } else if (extension === 'js') {
        return 'application/javascript'
    } else if (extension == 'json') {
	return 'application/json'
    }
}


/**
 * Read all files in dist folder and
 * uploads to se
 */
fs.readdir(distFolder, (err, files) => {
    let s3 = new aws.S3();

    files
        .map((file) => {
            return path.join(distFolder, file);
        })
        .filter((file) => {
            return fs.statSync(file).isFile();
        })
        .forEach((file) => {
            const fileName = path.basename(file)
            const fileType = path.extname(file).split('.').pop()


            fs.readFile(file, (err, fileData) => {

                if (err) {
                    throw err;
                }

                let uploadFileObject = {
                    Bucket: bucketName,
                    Key: prefix ? prefix + '/' + fileName : fileName,
                    Body: fileData,
                    ContentType: getContentTypeForExtension(fileType)
                }
                s3.putObject(uploadFileObject, (err, data) => {
                    if (err) {
                        console.error("Something is fishy for file " + fileName + ": " + err)
                        throw new Error("Failed to upload plugins to AWS")
                    } else {
                        console.log(fileName + " uploaded");
                    }
                })
            })
        })
})
