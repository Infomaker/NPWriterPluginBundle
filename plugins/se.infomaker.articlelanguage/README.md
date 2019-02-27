# Article Language Plugin

This plugin is used for setting language and which direction the text is read, right-to-left (rtl) or left-to-right (ltr).

## Dependencies
requires `writer => 4.5.0`

## Currently supported languages
Writer's internal spellcheck and suggestion tool currently has support for the following languages:

* `en_GB` - English (Great Britain)
* `en_US` - English (American)
* `nb_NO` - Norsk Bokmål
* `nn_NO` - Nynorsk
* `nl_NL` - Nederlands
* `sv_SE` - Svenska
* `sv_FI` - Svenska (Finland)
* `pl_PL` - Polskie
* `de_DE` - Deutsch
* `de_AT` - Deutsch (Österreich)
* `de_CH` - Deutsch (Schweiz)
* `fr_FR` - Français
* `is_IS` - Íslensku
* `pt_PT` - Português
* `es_ES` - Spanish (Traditional)

### Integrating your external spellcheck API
It's possible to write your own spellcheck/suggestion API, which the Writer will use if configured.

For more information about integrating your own API: [See this guide](https://infomaker.github.io/NPWriterDevelopers/guides/spellcheck-integration/).

## Plugin Configuration

```json
{
  "id": "se.infomaker.articlelanguage",
  "name": "im-articlelanguage",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-articlelanguage.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-articlelanguage.css",
  "mandatory": false,
  "enabled": true,
  "data": {
    "languages": [
        {
            "label": "Svenska",
            "code": "sv_SE"
        },
        {
            "label": "English",
            "code": "en_GB"
        },
        {
            "label": "Arabic (Egypt)",
            "code": "ar_EG",
            "direction": "rtl"
        },
        {
            "label": "Polskie",
            "code": "pl_PL"
        },
        {
            "label": "Deutsch",
            "code": "de_DE"
        },
        {
            "label": "Deutsch (Österreich)",
            "code": "de_AT"
        },
        {
            "label": "Deutsch (Schweiz)",
            "code": "de_CH"
        },
        {
            "label": "Français",
            "code": "fr_FR"
        },
        {
            "label": "Íslensku",
            "code": "is_IS"
        },
        {
            "label": "Português",
            "code": "pt_PT"
        },
        {
            "label": "Spanish (Traditional)",
            "code": "es_ES"
        }

  }
}
```

### Backwards compatibility for existing articles
Existing articles and templates using two letter language codes on its `idf@xml:lang`-element.
(eg. "sv", "en", "fi"), needs the following object in the writer config to correctly 
map to configured languages.

```
"languageFallbacks": {
  "sv": "sv_SE"
}
```

## Output
The plugin manipulates the idf-element to reflect the language 
of the content(`newsItem > contentSet > inlineXML > idf`).

```xml
<idf xmlns="http://www.infomaker.se/idf/1.0" xml:lang="sv-SE" dir="ltr">
  <!-- ... -->
</idf>
```
