# S3 Frontend Deployment

This workflow deploys the CarePath UI static export to S3 + CloudFront.

## Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ROLE_TO_ASSUME` | IAM role ARN for GitHub Actions to assume (OIDC) |
| `S3_FRONTEND_BUCKET` | Name of the S3 bucket (e.g., `carepath-frontend-xxxxx`) |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `NEXT_PUBLIC_CAREPATH_API_URL` | (Optional) API URL for the frontend |

## Getting the values

After running `pulumi up` in the `infra/` directory, the outputs will include:
- `frontendBucketName` — use as `S3_FRONTEND_BUCKET`
- `frontendUrl` — the CloudFront URL

