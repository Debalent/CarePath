# Elastic Beanstalk Deployment Guide

**Stack: Node.js + AWS Elastic Beanstalk**

Elastic Beanstalk is the currently configured deployment platform for this project. All changes from commits since `c980360` should be deployed to show on nextlvltv.com.

## Current EB Configuration

### 1. .ebextensions/ Directory

**01-environment.config**
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: "8080"
    JWT_EXPIRES_IN: 7d
    ALLOWED_ORIGINS: https://staging.d1f9wiu8p11zl1.amplifyapp.com,https://debalent.github.io
```

**02-node-settings.config**
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node dist/server.js"
```

**03-build-deploy.config**
```yaml
container_commands:
  01-build:
    command: "npm run build"
    leader_only: false
  02-prisma-generate:
    command: "npx prisma generate"
    leader_only: false
  03-prisma-deploy:
    command: "npx prisma migrate deploy"
    leader_only: true
```

### 2. Procfile
```
web: node dist/server.js
```

### 3. Deployment Package

**carepath-deploy.zip** (1,548,789 bytes)
- Contains built Next.js frontend (patient/, coordinator/, 404/ directories)
- Includes all static assets and server-side rendering files
- Ready for Elastic Beanstalk deployment

## Deployment Steps

### Option 1: Using EB CLI (Recommended)

```bash
# Install EB CLI
pip install awsebcli

# Configure AWS credentials
eb init

# Create application
eb create carepath \
  --sample \
  --platform "Node.js 20 running on 64bit Amazon Linux 2" \
  --sample-app

# Deploy latest changes
eb deploy

# Open application
eb open
```

### Option 2: Using AWS CLI Directly

```bash
# Create application version
aws elasticbeanstalk create-application-version \
  --application-name carepath \
  --version-label "$(date +%Y%m%d%H%M%S)" \
  --source-bundle S3Bucket="your-bucket",S3Key="carepath-deploy.zip"

# Deploy to environment
aws elasticbeanstalk update-environment \
  --environment-name carepath-env \
  --version-label "$(date +%Y%m%d%H%M%S)"
```

## What Will Be Deployed

All changes from the following commits will be included:
- `c980360` - feat:Expo app enhance login, registration, and ride request screens with improved UI and validation
- `4eac082` - adding admin dashboard and routing and fixing colors and sizing of many pages
- `d931529` - adding admin dashboard and routing and fixing colors and sizing of many pages
- `ae03a3e` - feat: Refactor Intro, Login, Register, and Request Ride screens for improved UX and functionality for Expo
- And all subsequent commits

## Current Issues

1. **Pulumi.yaml vs EB**: The infra/Pulumi.yaml file describes a different stack (Lambda + API Gateway), but .ebextensions shows EB is the intended platform
2. **Deployment Guide vs Reality**: docs/deployment-guide.md describes "Neon (DB) → Render (API) → Vercel (UI)" but the actual platform is EB
3. **Missing GitHub Actions**: No EB deployment workflow in .github/workflows/

## Recommendations

1. **Update docs/deployment-guide.md** to reflect Elastic Beanstalk deployment
2. **Add EB deployment workflow** in .github/workflows/deploy-eb.yml
3. **Remove or migrate** the Pulumi.yaml if EB is the primary deployment platform
4. **Update ALLOWED_ORIGINS** in .ebextensions/01-environment.config to include nextlvltv.com

## Quick EB Deployment Script

Save this as `deploy-eb.sh`:

```bash
#!/bin/bash

echo "Deploying to Elastic Beanstalk..."

# Create deployment package
echo "Building deployment package..."
npm run build
zip -r carepath-deploy.zip dist-lambda package.json package-lock.json .

# Deploy via EB CLI
if command -v eb &> /dev/null; then
    echo "Deploying via EB CLI..."
    eb deploy
else
    echo "EB CLI not found. Please install with: pip install awsebcli"
    exit 1
fi

echo "Deployment complete!"
```

## Environment Variables

Set these in your EB environment:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | production |
| `PORT` | `8080` | 8080 |
| `JWT_EXPIRES_IN` | `7d` | 7d |
| `ALLOWED_ORIGINS` | Vercel URLs | `https://nextlvltv.com,https://staging.d1f9wiu8p11zl1.amplifyapp.com` |
| `DATABASE_URL` | Database connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key | `your-secret-key` |

## Next Steps

1. **Deploy to EB**: Use one of the methods above
2. **Verify deployment**: Check nextlvltv.com for changes
3. **Update documentation**: Fix deployment-guide.md to reflect EB deployment
4. **Add CI/CD**: Create GitHub Actions workflow for EB deployment

The deployment is ready - just needs to be executed through Elastic Beanstalk.