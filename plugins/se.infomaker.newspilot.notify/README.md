# Newspilot Integration Notify Plugin

## Architecture
NP Integration Notify Plugin (NINP) has a hook/trigger on save in Newspilot Writer.
At the first save a POST is sent to AWS Gateway and Newspilot Integration Service (NIS) for further processing. 
NIS handles the communication with Editor Service and Newspilot.
When the POST request returns the Writer article will be enriched with a Newspilot article id.
A PUT updates the Newspilot article through NIS.

## Plugin configuration
Install this plugin in the writer environment by adding the settings below to your Newspilot Writer `/server/config/writer.json` file.
```json
{
  "id": "se.infomaker.newspilot.notify",
  "name": "Newspilot Notifier",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-newspilot-notify.js",
  "enabled": true,
  "mandatory": true,
  "data": {
    "integrationService": "https://jreu0y7org.execute-api.eu-west-1.amazonaws.com/dev",
    "integrationService-apikey": "xxxxx"
  }
}
```
`integrationService` corresponds to Newspilot Integration Service.

## Output
None.