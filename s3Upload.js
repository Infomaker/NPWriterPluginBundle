const fs = require('fs')
const aws = require('aws-sdk')
const path = require('path')

const bucketName = process.env.AWS_S3_BUCKET_NAME

if(!bucketName) {
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
    }
}


/**
 * Read all files in dist folder and
 * uploads to se
 */
fs.readdir(distFolder, (err, files) => {

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

            let fileStreamJs = fs.createReadStream(file);
            fileStreamJs.on('error', function (err) {
                if (err) {
                    throw err;
                }
            })

            let s3 = new aws.S3();

            let uploadFileObject = {
                Bucket: bucketName,
                Key: fileName,
                Body: fileStreamJs,
                ContentType: getContentTypeForExtension(fileType)
            }

            fileStreamJs.on('open', () => {
                s3.putObject(uploadFileObject, (err) => {
                    if (err) {
                        throw err;
                    }
                })
            })

        })

})