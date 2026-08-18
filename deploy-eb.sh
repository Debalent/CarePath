#!/bin/bash
# Elastic Beanstalk Deployment Script for CarePath

set -e

echo "🚀 Starting Elastic Beanstalk deployment for CarePath..."

echo "📋 Environment: $(date)"
echo "📁 Working directory: $(pwd)"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first: https://aws.amazon.com/cli/"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Check for EB CLI (optional but recommended)
if command -v eb &> /dev/null; then
    echo "✅ EB CLI is available"
else
    echo "⚠️  EB CLI not found. Install with: pip install awsebcli"
fi

# Check for deployment package
if [ ! -f "carepath-deploy.zip" ]; then
    echo "❌ Deployment package 'carepath-deploy.zip' not found"
    echo "   Please run 'npm run build' in carepath-ui first, then create the deployment package"
    exit 1
fi

# Check for EB configuration
if [ ! -d ".ebextensions" ]; then
    echo "❌ .ebextensions directory not found"
    exit 1
fi

# Update ALLOW_ORIGINS in .ebextensions/01-environment.config
sed -i 's|ALLOWED_ORIGINS:.*|ALLOWED_ORIGINS: https://staging.d1f9wiu8p11zl1.amplifyapp.com,https://debalent.github.io,https://nextlvltv.com|' .ebextensions/01-environment.config
echo "✅ Updated ALLOWED_ORIGINS to include nextlvltv.com"

# Show current EB configuration
echo "📄 Current EB configuration:"
cat .ebextensions/01-environment.config

# Create application version (using AWS CLI)
VERSION_LABEL="carepath-$(date +%Y%m%d%H%M%S)"

echo "🏷️  Creating application version: $VERSION_LABEL"

# Check if application exists
if aws elasticbeanstalk describe-applications --application-names carepath &> /dev/null; then
    echo "✅ Application 'carepath' exists"
    
    # Create application version
    echo "📦 Creating application version from carepath-deploy.zip..."
    aws elasticbeanstalk create-application-version \
        --application-name carepath \
        --version-label "$VERSION_LABEL" \
        --source-bundle S3Bucket="carepath-deployment-artifacts",S3Key="carepath-deploy.zip" \
        --description "Deployment from GitHub Actions"
    
    # Find the environment
    ENVIRONMENT_NAME=$(aws elasticbeanstalk describe-environments \
        --application-names carepath \
        --query "Environments[?contains(EnvironmentName, 'env')].EnvironmentName" \
        --output text | head -1)
    
    if [ -z "$ENVIRONMENT_NAME" ]; then
        echo "❌ No environment found. Creating new environment..."
        aws elasticbeanstalk create-environment \
            --application-name carepath \
            --environment-name "carepath-env" \
            --solution-stack-name "64bit Amazon Linux 2 v5.9.6 running Node.js 20" \
            --version-label "$VERSION_LABEL" \
            --option-settings file://.ebextensions/01-environment.config \
            --option-settings file://.ebextensions/02-node-settings.config \
            --option-settings file://.ebextensions/03-build-deploy.config
        ENVIRONMENT_NAME="carepath-env"
    else
        echo "🔄 Updating existing environment: $ENVIRONMENT_NAME"
        aws elasticbeanstalk update-environment \
            --environment-name "$ENVIRONMENT_NAME" \
            --version-label "$VERSION_LABEL"
    fi
    
else
    echo "📝 Creating new application 'carepath'...
    aws elasticbeanstalk create-application \
        --application-name carepath \
        --description "CarePath application deployed via Elastic Beanstalk"
    
    # Create application version
    echo "📦 Creating application version from carepath-deploy.zip..."
    aws elasticbeanstalk create-application-version \
        --application-name carepath \
        --version-label "$VERSION_LABEL" \
        --source-bundle S3Bucket="carepath-deployment-artifacts",S3Key="carepath-deploy.zip" \
        --description "Initial deployment from GitHub Actions"
    
    # Create environment
    echo "🌱 Creating Elastic Beanstalk environment..."
    aws elasticbeanstalk create-environment \
        --application-name carepath \
        --environment-name "carepath-env" \
        --solution-stack-name "64bit Amazon Linux 2 v5.9.6 running Node.js 20" \
        --version-label "$VERSION_LABEL" \
        --option-settings file://.ebextensions/01-environment.config \
        --option-settings file://.ebextensions/02-node-settings.config \
        --option-settings file://.ebextensions/03-build-deploy.config
    
    ENVIRONMENT_NAME="carepath-env"
fi

echo "⏳ Deployment initiated!"
echo "📊 You can monitor the deployment at:"
echo "   https://console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/environment/$ENVIRONMENT_NAME/dashboard"

echo "✅ Deployment script completed successfully!"
