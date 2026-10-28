# Enclave — Applied AI Engineering

Complete website source, including the latest homepage headlines and eight case studies.

## Open the website locally

1. Extract this ZIP.
2. Open the extracted folder in VS Code or another editor.
3. Run this command from the Enclave_Website folder (requires Python 3):

   python3 -m http.server 8000 --directory dist

   On Windows, use `py -m http.server 8000 --directory dist` if needed.

4. Open http://localhost:8000 in your browser.

You can also open dist/index.html directly for a quick look.

## Files

- dist/: ready-to-host HTML, CSS, JavaScript, and project images.
- content/case-studies.json: editable case-study copy.
- scripts/generate-case-studies.py: regenerate case-study pages after changing their copy.
- scripts/check-static-site.py: check local links, assets, and approved case-study content.
- ASSET_SOURCES.md: image provenance and labels.

No build or npm installation is required. Upload the contents of dist/ to a static website host.

The contact form submits via a mailto link: on submit, it opens the visitor's email app with a pre-filled message addressed to the CONTACT_EMAIL constant at the top of the contact-form handler in dist/assets/site.js. Update that constant if the destination address changes.
