# External updates
When changes are made to articles in the article repository,
which in case with Open Content is usually called editorial Open Content,
by an external service the changes would make the article in the
opened Writer to hit an optimistic lock.
This is because there has been changes to the article which the Writer would
know nothing about. To prevent these changes to be lost, the optimistic lock
will stop the article in Writer to be saved.

To make it possible for external services to make changes to articles
in the repository and to make the Writer aware of the changes,
an external update system has been developed. Below is a sequence
diagram showing how external updates are made an by a broadcast:

```{mermaid}
sequenceDiagram
    participant External Service
    participant Article Repository
    participant Infocaster
    participant External Update Plugin
    participant Article
    External Service->>Article Repository: Read article + Original ETag
    External Service->>External Service: Perform updates on article
    External Service->>Article Repository: Store updated article
    Article Repository->>External Service: new ETag for updated article
    External Service->>Infocaster: publish change message
    Infocaster->>External Update Plugin: broadcast change message
    External Update Plugin->>External Update Plugin: Validate message
    External Update Plugin->>Article: Apply changes in message
```
*Sequence diagram for parties involved in external update*

The change message looks like:
```json
{
  "uuid": "858d404c-05c0-48c8-8b7a-b245a830238e",
  "checksums": {
    "replaces": "a55e8ee64dff5bd2b07eba92c28ab29da55e8ee64dff5bd2b07eba92c28ab29d",
    "new": "7a3a1e61be0ac5c701d9ad258c99a9242a6f3d72184ffc7398a8d4afb755c78a"
  },
  "changedBy": {
    "name": "Christopher Changer",
    "email": "chris.changer@example.com",
    "message": "The external service has made changes to your article. Please notice the publication date. Best regards, Chris"
  },
  "changes": [
    {
      "key": "pubStart",
      "op": "set",
      "value": "2018-10-23T13:00:00Z"
    },
    {
      "key": "pubStop",
      "op": "set",
      "value": "2018-10-23T14:00:00Z"
    },
    {
      "key": "pubStatus",
      "op": "set",
      "value": "stat:withheld"
    },
    {
      "key": "edNote",
      "op": "set",
      "value": "Please have a look at this article"
    }
  ]
}
```

The change message should correspond to the changes made to the document in the article repository.

* The `uuid` should match the ID of the document being changes.
* The `checksums` part contains `replaces` which is the ETag for the article before the changes were made, and `new` which is the ETag after storing the
document in the repository.
* the `changedBy` section contains optional information which is displayed to the user. If any field is unset, a default message will be uses for that field.
* the `changes` section specifies what has been changed in the article. It contains the following fields:
  * The `key` field specifies wich part of the article that is updated.
  * The `op` field specifies the operation. `set`, `add` and `remove` are supported.
  * The `value` field dictates what should be set, added or removed, and it's syntax is different for each `key`. Each value is specified
    in the [JSON Schema](external-update-jsonschema.json)


## External Update plugin
This plugin is responsible for applying updates to currently opened articles in the browser, which has been made on the server by an external service.

The plugin listens for updates on articles when all of the prerequisites below are fulfilled:

* The plugin is configured to communicate with the correct Infocaster instance
* The plugin is configured with the correct `publisherId`
* The plugin is configured with a `token` matching the `publisherId`

When a update message, which is specified in a [JSON schema](external-update-jsonschema.json), is broadcasted to the plugin, it applies the updates to the article with the data in the update message, when all the statements above are true:

* The `uuid` in the update message has the same value as the `guid` in the opened article
* The checksum called `replaces` in the update message corresponds to the `ETag` for the opened article.
* The update message validates against the JSON schema

If any of the statements above is false, the user is informed that he/she needs to manually copy the article text and reload the article, since it is not possible to apply the changes.

In the case where all staements are true, the changes are applied and the user is informed that changes has been made.

### Plugin configuration

```json
{
  "id": "se.infomaker.externalupdate",
  "name": "externalupdate",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-externalupdate.js",
  "enabled": true,
  "mandatory": false,
  "data": {
      "token": "[access token]",
      "publisherId": "[publisher id]"
  }
}
```

## External service
The external service should construct and publish a change message, discussed above, after changes has been made to the article in the article repository.
The publish part is done by the Infocaster service, and the communication with it is done via a REST API.

For the external service to be able to publish, it needs a `publisherId` and a `token` with write access. It should do so using a `POST` request to:

```
https://infocaster-domain/v1/publisher/[publisherId]/broadcast/[uuid]/publish?authorization=[token]

```

`[publisherId]` should be replaced by the publisher ID
`[uuid]` is the ID of the article that has been changed
`[token]` should be replaced with the access token


The change message should be put in the body of the POST request.
