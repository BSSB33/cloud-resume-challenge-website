# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend content for three static sites hosted on AWS (S3 + CloudFront), all under `vitraigabor.eu`. There is **no build step** — plain HTML/CSS/JS deployed as-is.

| Directory | Site | S3 Bucket |
|-----------|------|-----------|
| repo root (`index.html`, `styles.css`, `script.js`, `resources/`) | `resume.vitraigabor.eu` — resume/CV with view counter | `vitraiaws-cloud-resume-challenge` |
| `ik/` | `ik.vitraigabor.eu` — university portfolio (Hungarian) | `vitraiaws-ik-website` |
| `gallery/` | `gallery.vitraigabor.eu` — photo gallery app (behind HTTP Basic Auth at CloudFront) | `vitraiaws-photos-backup-thumbnails` |

The AWS infrastructure (S3, CloudFront, Route53, Lambda, DynamoDB, the gallery Basic Auth function) is managed separately with Terraform in the `cloud-resume-challenge-iac` repository.

## Local Development

Open `index.html` (or `gallery/index.html`, `ik/index.html`) directly in a browser. The resume's view counter calls the live Lambda endpoint. The gallery needs a `/manifest.json` at the site root, which only exists in the deployed bucket, so it shows an error locally unless you stub one.

Validation (same as CI):
```bash
npx html-validate "*.html"          # config in .htmlvalidate.json
npx eslint "*.js" --no-eslintrc --env browser,es6
```

## Site Details

### Resume site (root)
- `script.js` — typing animation, scroll effects, project detail toggles, and the **view counter**: POSTs to the Lambda Function URL with `{increment: bool}`; `sessionStorage.visitor_counted` ensures one increment per browser session (the backend additionally rate-limits to 1/hour/IP and only counts requests from the resume origin).
- `robots.txt` — allows Googlebot/Bingbot/DuckDuckBot, disallows all other crawlers.

### IK site (`ik/`)
- Single-page app powered by [Gumdrop](https://github.com/vimtaai/gumdrop) (loaded from jsDelivr CDN): `index.html` shell + markdown pages in `ik/pages/` + JSON data in `ik/data/`.
- CDN dependencies in `ik/index.html` are pinned to exact versions/commits with SRI `integrity` hashes — when upgrading them, recompute the hash (`curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`).
- Everything under `ik/` is **publicly reachable**, including `pages/private_subjects/` — the name is historical (the old ELTE Apache hosting had Basic Auth there; its `.htaccess`/`.htpasswd` files were removed and do nothing on S3/CloudFront). Don't put anything sensitive here.

### Gallery (`gallery/`)
- Static SPA (`app.js`) that fetches `/manifest.json` (a listing of the thumbnails bucket generated at deploy time), builds a folder tree, and renders grids + a lightbox. Images are served from the same distribution, so everything sits behind the CloudFront Basic Auth function.
- The photos/thumbnails themselves are **not in this repo** — they live in the S3 bucket, uploaded by a separate backup process.

## Deployment (`.github/workflows/deploy.yml`)

Push to `main` runs tests then deploys all three sites. PRs and other branches run tests only.

1. **Resume**: `aws s3 sync . <bucket> --delete` (excludes `.git`, `.github`, `README.md`, `ik/*`, `gallery/*`), then re-uploads key files with cache headers: HTML 5 min, CSS/JS 1 week, images 1 year. Full CloudFront invalidation.
2. **IK**: `aws s3 sync ik/ <bucket> --delete` excluding `.htaccess`/`.htpasswd`/`.DS_Store`. Full invalidation.
3. **Gallery**: generates `manifest.json` by listing the thumbnails bucket (image extensions only, skips app files), then `aws s3 sync gallery/ <bucket>` — **deliberately WITHOUT `--delete`**, because the bucket contains the photos, which are not in this repo. Adding `--delete` here would wipe the entire photo collection. Uploads the manifest (5 min cache) and invalidates only the app files + manifest.

Secrets used: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and the three `*_CLOUDFRONT_DISTRIBUTION_ID` values.

## Conventions

- Keep HTML passing `html-validate` with the rules in `.htmlvalidate.json` (attribute quotes, close order, void style are errors).
- Avoid `console.log` in production JS (CI warns on it).
- When adding new static assets to the resume site, consider whether the workflow's cache-header step needs a matching entry.
- New top-level files at the repo root will be synced to the resume bucket unless excluded in the workflow.
