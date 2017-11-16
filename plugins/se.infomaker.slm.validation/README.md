# Stampen Validation Plugin
Handles validation of an article, e.g. "article is missing author".

## Plugin configuration
No `data` configuration needed.

## Output
None.

## Validation

| Type         | Save    | Publish | Description                     |
|--------------|---------|---------|---------------------------------|
| Headline     | Error   | Error   | Must contain one and only one   |
| Preamble     | Warning | Error   | Only one per article            |
| Main channel | Warning | Error   | Must be set                     |
| Tags         | Warning | Error   | Must contain at least one       |
| Author       | Warning | Error   | Must contain at least one       |
| Category     | Warning | Error   | Must contain at least one       |
| Review grade | Error   | Error   | Must be an integer, 0 through 5 |
| Review       | Warning | Error   | Only one per article            |
| Fact         | Warning | Error   | Only one per article            |
