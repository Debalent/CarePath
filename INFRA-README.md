# CarePath S3 Infrastructure Setup

This project uses Pulumi to deploy the CarePath frontend to AWS S3 with CloudFront CDN for high-performance, secure static website hosting.

## Architecture Overview

- **S3 Bucket**: Static website hosting for frontend files
- **CloudFront CDN**: Global content delivery network with caching
- **Route53 DNS**: Custom domain configuration (requires separate setup)
- **ACM SSL**: HTTPS certificates for security

## Prerequisites

1. **AWS Account** with appropriate IAM permissions
2. **Pulumi CLI** installed locally
3. **Node.js** for deployment scripts

### Pulumi Setup

```bash
# Install Pulumi
curl -fsSL https://www.pulumi.com/pulumi-v3-install | sh

# Authenticate to AWS
pulumi login aws

# Set up your AWS account configuration
export AWS_PROFILE=your-aws-profile
export AWS_REGION=us-east-1
```

## Environment Variables

### Required Variables

```bash
# Pulumi Configuration
export PULUMI_PATH=./infra
export PULUMI_BACKEND_URL=file://./.pulumi/state

# AWS Configuration  
export AWS_DEFAULT_REGION=us-east-1
export AWS_PROFILE=your-aws-profile

# Application Configuration
export S3_BUCKET_NAME=carepath-frontend-static-${AWS_ACCOUNT_ID}
export CLOUDFRONT_DISTRIBUTION_ID=<distribution-id-from-pulumi-output>

# Application URL
export NEXT_PUBLIC_CAREPATH_API_URL=https://api.carepath.dev/api
```

### Optional Variables

```bash
# Custom domain (after SSL setup)
export AWS_HOSTED_ZONE_ID=Z123456EXAMPLE  # Route53 hosted zone ID
export AWS_DOMAIN=carepath.dev  # Your custom domain
```

## Local Development

### 1. Project Setup

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/CarePath.git
cd CarePath

# Navigate to carepath-ui if separate
# cd carepath-ui

# Install dependencies
npm install
```

### 2. Frontend Build

```bash
# Build the Next.js application
npm run build

# Verify build output
ls -la out/
```

### 3. Environment Setup

Create `.env.local` in the carepath-ui directory:

```bash
NEXT_PUBLIC_CAREPATH_API_URL=https://api.carepath.dev/api
```

### 4. Initial Pulumi Deployment

```bash
# Set up the S3 infrastructure
cd infra
pulumi stack init dev
cd ..

# Review planned infrastructure
pulumi preview --cwd infra

# Deploy infrastructure
pulumi up --cwd infra

# The above command will create:
# - S3 bucket for static hosting
# - CloudFront distribution with caching
# - SSL certificates (if domain configured)
```

### 5. Frontend Deployment

```bash
# Upload build artifacts to S3
node deploy-frontend.js

# Check deployment status
# Files should be available at:
# https://your-bucket-name.s3-website.us-east-1.amazonaws.com
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches: [main]
    paths: ['carepath-ui/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: 'carepath-ui/package-lock.json'
        
    - name: Install dependencies
      run: |
        cd carepath-ui
        npm ci
        
    - name: Build application
      run: |
        cd carepath-ui
        npm run build
        
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-region: us-east-1
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        
    - name: Deploy to S3
      run: |
        cd carepath-ui
        node ../../deploy-frontend.js
      env:
        S3_BUCKET_NAME: ${{ secrets.S3_BUCKET_NAME }}
        CLOUDFRONT_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
```

## Environment-Specific Deployment

### Development Environment

```bash
# Create development stack
cd infra
pulumi stack create dev

# Deploy to development
cd ..
pulumi up --cwd infra -s dev

# Update environment variables
export S3_BUCKET_NAME=carepath-frontend-static-dev-xxxx
export CLOUDFRONT_DISTRIBUTION_ID=ED1234567890

# Deploy frontend
cd carepath-ui
node ../../deploy-frontend.js -e dev
```

### Staging Environment

```bash
# Create staging stack  
cd infra
pulumi stack create staging

# Deploy to staging
cd ..
pulumi up --cwd infra -s staging

# Update environment variables
export S3_BUCKET_NAME=carepath-frontend-static-staging-xxxx
export CLOUDFRONT_DISTRIBUTION_ID=ED9876543210

# Deploy frontend
cd carepath-ui
node ../../deploy-frontend.js -e staging
```

### Production Environment

```bash
# Create production stack
cd infra
pulumi stack create prod

# Deploy to production
cd ..
pulumi up --cwd infra -s prod -y

# Update environment variables
export S3_BUCKET_NAME=carepath-frontend-static-prod-xxxx
export CLOUDFRONT_DISTRIBUTION_ID=ED5555555555

# Deploy frontend
cd carepath-ui
node ../../deploy-frontend.js -e prod
```

## DNS Configuration

### Route53 Setup

1. **Create Hosted Zone** in AWS Route53:
   - Name: `carepath.dev`
   - Type: Public Hosted Zone

2. **Create A Records** in the hosted zone:
   ```bash
   # For domain
   carepath.dev → <cloudfront-distribution-id>
   
   # For www subdomain
   www.carepath.dev → <cloudfront-distribution-id>
   ```

3. **Configure SSL Certificate**:
   - Use ACM Certificate with DNS validation
   - Domain: `carepath.dev`
   - Alternative names: `www.carepath.dev`

## Monitoring and Maintenance

### Health Checks

- **S3 Monitoring**: Check bucket access logs and metrics
- **CloudFront Monitoring**: Cache hit/miss ratios and response times
- **Application Health**: Browser-based performance monitoring

### Backup and Recovery

1. **S3 Lifecycle Policies**: Configure object retention and cleanup
2. **CloudFront Caching**: Set appropriate TTL values for different content types
3. **Backup Strategy**: Regular S3 cross-region replication for critical data

### Security Practices

1. **IAM Roles**: Least privilege access for deployment scripts
2. **VPC Endpoints**: Use AWS PrivateLink for S3 access
3. **TLS Configuration**: Enforce HTTPS for all CloudFront distributions
4. **WAF**: AWS Web Application Firewall for additional protection

## Troubleshooting

### Common Issues

**Build Output Not Uploading**

```bash
# Check if out/ directory exists
ls -la carepath-ui/out/

# Ensure build succeeded
npm run build
cd carepath-ui && npm run build
```

**CloudFront Cache Not Updating**

```bash
# Check distribution ID from Pulumi outputs
pulumi stack output --cwd infra -s dev --output json cloudfrontDistribution

# Manually invalidate cache
aws cloudfront create-invalidation
  --distribution-id <distribution-id>
  --paths '/*'
```

**S3 Bucket Access Issues**

```bash
# Verify bucket exists and has correct permissions
aws s3 ls s3://your-bucket-name

# Check bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name
```

### Getting Help

1. **Pulumi Documentation**: https://www.pulumi.com/docs/
2. **AWS S3 Documentation**: https://docs.aws.amazon.com/s3/
3. **CloudFront Documentation**: https://docs.aws.amazon.com/AmazonCloudFront/
4. **Next.js Static Export**: https://nextjs.org/docs/pages/building-your-application/deploying#static-export

## Project Structure

```
 CarePath/
├── infra/
│   ├── Pulumi.yaml              # AWS infrastructure
│   └── pulumi/                  # Pulumi state
│
├── carepath-ui/
│   ├── src/                   # Next.js source code
│   ├── .github/workflows/     # CI/CD pipelines
│   ├── .kilo/                 # Deployment scripts
│   ├── deploy-frontend.js      # S3 deployment script
│   ├── deploy-frontend.sh      # Alternative deployment script
│   ├── next.config.ts          # Next.js configuration
│   ├── package.json            # Dependencies
│   └── out/                    # Build output (generated)
│
└── README.md                  # Project documentation
```

## Additional Resources

- **AWS Well-Architected Framework**: https://wa.aws.amazon.com/
- **Pulumi AWS Provider**: https://www.pulumi.com/registry/packages/aws/
- **Next.js Deployment Guide**: https://nextjs.org/docs/pages/building-your-application/deploying
- **CloudFront Developer Guide**: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html

## Support and Contact

For issues with this project:
1. Check the [README.md](README.md) for setup instructions
2. Review the deployed application at your configured URL
3. Check infrastructure stack outputs with `pulumi stack output`
4. Review GitHub Actions logs in the repository

---

**Last Updated:** 2026-07-29
**Environment:** Production Ready
