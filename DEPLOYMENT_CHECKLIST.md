# LineLens AWS App Runner Deployment Checklist

## Before deployment

- Confirm `aws sts get-caller-identity` succeeds in the AI IDE terminal.
- Confirm GitHub authentication succeeds with `gh auth status`.
- Run `npm ci`, `npm test`, `npm run lint`, and `npm run build`.
- Run `PORT=8080 npm start` and verify `http://localhost:8080`.
- Confirm no `.env` files, AWS credentials, access keys, or GitHub tokens are in the repository.

## GitHub repository

1. Create a private repository named `linelens-aws-deployment`.
2. Initialize Git in this folder and commit the deployment-ready source.
3. Push the main branch to GitHub.
4. Capture a screenshot of the repository page showing the project files.

## AWS App Runner attempt

1. Open AWS App Runner in `us-east-1`.
2. Choose **Create service** and **Source code repository**.
3. Connect the GitHub repository and select the main branch.
4. Choose **Use a configuration file** so App Runner reads `apprunner.yaml`.
5. Enable automatic deployment.
6. Use the smallest available CPU and memory configuration.
7. Create the service and wait for the deployment status.

If AWS rejects service creation because this account became an App Runner
customer after April 30, 2026, capture the full AWS message. Do not fabricate a
Running status or public URL. The error screenshot documents the current AWS
service restriction and supports a request to use the AWS-recommended
replacement.

## Evidence to capture after a successful deployment

- App Runner service page showing **Running**.
- Live LineLens page with the complete `awsapprunner.com` URL visible.
- Successful test of the password, refund, and support questions.
- GitHub repository page with `apprunner.yaml` visible.
- App Runner deployment logs showing a successful build and start.
- AWS Budget page showing the existing $5 alert.
- Mobile browser view of the live application.

Pause the App Runner service after collecting evidence to limit charges.
