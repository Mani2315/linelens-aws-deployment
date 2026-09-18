# LineLens Deployment Validation

Validation date: September 18, 2026

## Source selected

The security and testing submission was selected as the deployment source
because it contains the complete original application plus the later request
validation, sensitive-data screening, rate limiting, secure headers, tests, and
accessibility improvements.

## Deployment changes

- Replaced the Cloudflare-specific development runner with standard Next.js
  development, build, and production commands.
- Configured the production server to bind to `0.0.0.0` and the App Runner
  `PORT` value, defaulting to port 8080.
- Added `apprunner.yaml` for the App Runner Node.js 22 managed runtime.
- Added App Runner-compatible forwarded-client address handling for rate
  limiting.
- Added explicit API response typing and safe JSON request handling.
- Updated Next.js and its lint configuration to version 16.3.5 to address the
  vulnerabilities reported against the uploaded version.

## Verification results

| Check | Result |
| --- | --- |
| Embedded-secret scan | Passed; no credential patterns or secret-bearing files found |
| Automated tests | Passed; 6 of 6 tests |
| ESLint | Passed; no lint errors |
| Production build | Passed; static home page and dynamic `/api/chat` route generated |
| Production dependency audit | Passed; 0 vulnerabilities |
| Production server | Passed; listened on `0.0.0.0:8080` |
| Home-page smoke test | Passed; HTTP 200 and correct LineLens title |
| Valid chat request | Passed; HTTP 200 with grounded answer, citations, and confidence |
| Sensitive-data rejection | Passed; HTTP 400 with a safe validation message |

## AWS service constraint

The project is technically ready for an App Runner source deployment. AWS no
longer accepts new App Runner customers after April 30, 2026, so service
creation may be blocked for a newer account even when the application and
configuration are valid. If AWS rejects creation, preserve the AWS error as
evidence and request permission to use the current AWS-recommended replacement.
