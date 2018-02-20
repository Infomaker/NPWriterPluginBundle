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
    "integrationService-apikey": "xxxxx", 
    "filter": {
      "query":"/wr:newsItem/wr:itemMeta/wr:itemMetaExtProperty[@type='imext:originalUrl']/@value",                  
      "type":"EQUALS",
      "value":"noje-kultur/arvingarna-husband-i-breaking-news-65875"
    }
  }
}
```

`integrationService` corresponds to Newspilot Integration Service.
### Filterering
`filter` is used to filter documents to be sent to the Newspilot Integration Service. If the filter matches the criterias the article will be sent to the Newspilot Integration Service
* `query` is an xpath telling what in the newsItem to filter on.The xpath HAS to have a namspace prefix for the default namespace (like `wr` above) and use the ils prefix for http://www.infomaker.se/lookupservice.
* `type` is the kind of comparison to filter with. The possible values are `EXISTS`, `NOT_EXISTS`, `EQUALS`, `NOT_EQUALS`, `DATE_OLDER_THAN`, `DATE_YOUNGER_THAN`.
* `value` is the value to compare the value with if `EQUALS` or `NOT_EQUALS` is used or the number of days if `DATE_OLDER_THAN` or `DATE_YOUNGER_THAN` is used.

#### Examples
Only send articles with a pubstart not older than 30 days:
```json
"filter": {
      "query":"/wr:newsItem/wr:itemMeta/wr:itemMetaExtProperty[@type='imext:pubstart']/@value",                  
      "type":"DATE_YOUNGER_THAN",
      "value":"30"
}
```

Only send articles that does not have originalUrl set:
```json 
"filter": {
      "query":"/wr:newsItem/wr:itemMeta/wr:itemMetaExtProperty[@type='imext:originalUrl']/@value",                  
      "type":"NOT_EXISTS",      
    }
```

Only send articles that has originalUrl set to a specific value:
```json 
"filter": {
      "query":"/wr:newsItem/wr:itemMeta/wr:itemMetaExtProperty[@type='imext:originalUrl']/@value",                  
      "type":"EQUALS",
      "value":"noje-kultur/arvingarna-husband-i-breaking-news-65875"
    }
```
