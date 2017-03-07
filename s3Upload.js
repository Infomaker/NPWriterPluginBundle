const fs = require('fs')
const aws = require('aws-sdk')
const path = require('path')
var http = require("http");

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
    } else if (extension === 'json') {
        return 'application/json'
    }
}


let pluginFiles = []
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
            pluginFiles.push(file)

        })
    start()
})

function start() {

    const next = pluginFiles.pop()
    if (next) {
        upload(next)
            .then((done) => {
                console.log("Done upload", done);
                start()
            })
    }

}

function upload(file) {
    const fileName = path.basename(file)
    const fileType = path.extname(file).split('.').pop()
    return new Promise((resolve, reject) => {

        let s3 = new aws.S3();
        const pluginsUrl = 'https://plugins.writer.infomaker.io'

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

                const options = {
                    host: "localhost",
                    path: "/api/v1/plugins/url",
                    port: "3001",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                if (err) {
                    console.error("Something is fishy for file " + fileName + ": " + err)
                } else {
                    console.log(fileName + " uploaded");

                    if (fileType === 'js') {
                        let req = http.request(options, function (res) {

                            res.on("data", function (data) {
                            });
                            res.on("end", function () {
                                resolve()
                                // print to console when response ends
                            });
                        });
                        const url = {
                            url: pluginsUrl + '/' + prefix + '/' + fileName
                        }
                        req.write(JSON.stringify(url));
                        req.end();
                    } else {
                        resolve()
                    }


                    // console.log("URL",pluginsUrl+'/'+prefix+'/'+fileName);
                }
            })
        })
    })
}
