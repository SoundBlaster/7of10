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
