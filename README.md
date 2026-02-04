# Northstar Travel Today

A static, front-end–only site that renders Northstar Travel Today articles from JSON. There is **no backend connection** or database. All content is loaded in the browser and parsed dynamically from the two JSON files in json/.

## How it works
- The UI is driven by script.js, which fetches and renders data at runtime.
- Data sources:
  - json/Northstar.json — the articles list.
  - json/brand-icons.json — a map of brand name → icon path.
- If a brand does not have a matching icon, the UI shows a default placeholder with initials.

## Run locally
You can open index.html directly in a browser, or run the simple static server:

- Start the server (Node required):
  - node server.js
- Then open:
  - http://localhost:3301/

## Manage content
### Update articles (json/Northstar.json)
Options:
1) Edit the JSON file directly in json/Northstar.json.
2) Use the admin helper page:
   - Open admin.html in a browser.
   - Paste new article JSON (single object or array).
   - Click “Merge Articles”.
   - A new Northstar.json file is downloaded.
   - Replace json/Northstar.json with the downloaded file and refresh the site.

Each article object must include:
- title
- url
- brand
- blurb

Optional fields:
- image_url (string or null)
- date (YYYY-MM-DD)

### Update brand icons (json/brand-icons.json + icons/)
1) Add the icon file to icons/.
2) Add or update the brand mapping in json/brand-icons.json, using the same brand name as in the article data.

Example mapping:
"Travel Weekly": "icons/TravelWeekly.svg"

## File map
- index.html — main site
- admin.html — admin helper for merging articles
- script.js — front-end logic and rendering
- styles.css — site styles
- admin-script.js — admin helper logic
- admin-styles.css — admin styles
- json/Northstar.json — article data
- json/brand-icons.json — brand icon mappings
- icons/ — brand icon images
- server.js — local static server
