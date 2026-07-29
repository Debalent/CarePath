# CarePath Deployment Migration & Driver Dashboard Enhancement

## Part 1: Migrate from Amplify to S3
- [ ] 1a. Update Pulumi infra (`infra/index.ts`) - Add S3 bucket + CloudFront for frontend hosting
- [ ] 1b. Create S3 deploy GitHub workflow (`.github/workflows/deploy-s3-ui.yml`)
- [ ] 1c. Remove/archive Amplify files (`amplify.yml`, `deploy-frontend.js`, `upload-url.txt`, `deploy.zip`, `upload-deploy.js`)
- [ ] 1d. Remove old GitHub Pages workflow (`deploy-gh-pages-ui.yml`)

## Part 2: Enhanced Driver Dashboard
- [ ] 2a. Rewrite `/driver/dashboard/page.tsx` with enhanced UI, live API integration, earnings, ride history
- [ ] 2b. Test build to ensure static export works

## Part 3: Push to GitHub
- [ ] 3a. Commit and push all changes to GitHub

