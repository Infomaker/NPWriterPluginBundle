# Job plugin for Newspilot
Supports list/dnd of images in Newspilot Job to which article belongs. 

Note that in order for plugin to actually get images to render the article needs to be linked to
Newspilot article, i.e. article has been created in Newspilot. 

## Architecture
![Architecture](npjob-plugin-architecture.png)

NP Job Plugin fetches information of images in newspilot for linked newspilot article using socket api calls
to Newspilot Server. 

When user drags an image from plugin onto article the "main" or ordinary route for uploading images
via URL drop in Newspilot Writer is executed. The NP Job Plugin have constructed an URL that points
to NP Image Server that can handle images in Newspilot regardless of store location (i.e. if 
image is stored in database or on volume).

## Operations information
If Newspilot (and Newspilot image Server) is not in the same network (i.e. AWS ), Newspilot Writer 
needs to be whitelisted in Newspilot network (to allow Newspilot Writer download images) and NP
Job Plugin obviously need access to Newspilot Server API to extract information regarding article
in Newspilot.

Preview and thumb are rendered using Writer server as proxy to access NP Image Server.

## Configuration
```
{
    "id": "se.infomaker.newspilot.job",
    "name": "npjob",
    "url": "http://localhost:5001/im-newspilot-job.js",
    "style": "http://localhost:5001/im-newspilot-job.css",
    "enabled": false,
    "mandatory": false,
    "data": {
        "imageProxyServer": "https://image.proxy.host",
        "newspilotServer": "http://newspilot.host:port"
    }
}
```
`imageProxyServer` corresponds to NP Image Server in image above.


