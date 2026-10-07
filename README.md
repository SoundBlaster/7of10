# 7 of 10

Public website for the 7 of 10 photo compression app.

## Website deployment

The static pages live in `website/7of10/` and publish to
`https://egormerkushev.ru/7of10/` from the `main` branch. The GitHub Actions
workflow uses an environment named `FTP` and uploads over FTPS on port 21. It
does not delete files from the hosting directory.

Configure these environment values in the repository's `FTP` environment:

- `FTP_HOST`
- `FTP_PORT` (`21`)
- `FTP_USER`
- `FTP_REMOTE_ROOT` (`/www/egormerkushev.ru/7of10`)

Store the account password as the `FTP_PASSWORD` environment secret. The
optional `FTPS_ALLOW_UNVERIFIED_CERT` variable defaults to certificate
verification enabled; only set it to `true` if the hosting endpoint's
certificate cannot be validated.

A push that changes `website/7of10/` deploys the site and checks the landing,
privacy, and support URLs. A deployment can also be started manually from the
Actions tab.

## Local preview

No build step or dependencies are required:

```sh
python3 -m http.server 8794 --bind 127.0.0.1 --directory website
```

Open `http://127.0.0.1:8794/7of10/`. The landing page uses `landing.css` and
`landing.js`; the support and privacy pages retain their shared `styles.css`.
RU/EN switches all landing copy and can be linked with `?lang=en`. Without the
parameter the page uses the visitor's last choice, then the browser language
(Russian for ru/be/uk/kk, English otherwise). `assets/og-image.jpg` is the
link-preview card; regenerate it if the hero headline changes.

The interactive comparison encodes the supplied portrait to JPEG locally in the
browser. Its file sizes and reduction percentages come from the actual source
and generated blobs; they are a browser demonstration, not a benchmark of the
native compression engine. Three presets change dimensions and JPEG quality.
Without JavaScript or canvas support, the original image and landing content
remain available. App screenshots are supplied project assets, displayed with
CSS framing; the Shortcuts action currently handles one image per run.

App Store availability is intentionally shown as “coming soon” until a verified
product URL is available. Update both language variants when the app launches.
