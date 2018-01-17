## Newspilot Writer 3.0 plugin bundle
This package contains plugins for Newspilot writer, created by Infomaker.


### Get started
Install dependencies with NPM (or Yarn)
```
npm install
```

Start a webpack development server running at [http://localhost:5001](localhost:5001)
```
npm run dev
```

Build a dist-folder by running
```
npm run build
```

### Add plugin to Newspilot Writer
In your Newspilot Writer open /server/config/writer.json and add your plugin

### Override plugin tab placement
To override which tab a plugin is added to via config, add a `tab`-property to the plugin's config.
Simplified example:
```json
{
    "id": "se.infomaker.contentrelations",
    "name": "contentrelations",
    "enabled": true,
    "mandatory": false,
    "tab": "Search"
}
```
Will put content relations in a tab called "Search". If the tab does not exist it will be added dynamically.
The `tab`-property only affects plugins which are added to a tab in its `*Package.js`-file

### Release a new version
To bump version in `package.json` and create a new commit. This should be done
as the first commit for every hotfix- and release-branch.
Use the following npm scripts:

#### Major Release
Run `npm run release:major` to create a new major version.  
E.g `4.1.1 -> 5.0.0`

#### Minor Release
Run `npm run release:minor` to create a new minor version.  
E.g `4.1.1 -> 4.2.0`

#### Patch Release
Run `npm run release:patch` to create a new patch release.  
E.g `4.1.1 -> 4.1.2`
