# History plugin
Plugin handles saving local versions of articles and possibility to open an unsaved local copy of an article in
the Writer.

The focus of the plugin is to minimize the risk of a reporter losing content in the document.
As long as 'normal' editing is being done, the local backup is being overwritten with the
latest changes. Should a substancial amount of text be deleted, about 30 characters, a new version
is generated in the history.

To restore a text the user may click the history icon, after which a list of local
backups of articles is presented. When clicking on an article, a time line of
article versions is displayed, together with a preview component showing the
text content for a selected version.

## Plugin configuration
No `data` configuration needed.

## Output
None.