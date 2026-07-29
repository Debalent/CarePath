#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Configuration
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'carepath-frontend-static';
const DIST_ID = process.env.CLOUDFRONT_DISTRIBUTION_ID;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Initialize AWS clients
const s3 = new AWS.S3({ region: AWS_REGION });
const cloudfront = new AWS.CloudFront({ region: AWS_REGION });

async function uploadToS3() {
  console.log('🚀 Starting S3 deployment...');
  
  // Check if out/ directory exists (Next.js static export output)
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('❌ Build output directory "out/" not found. Run "npm run build" first.');
  }
  
  console.log('📦 Uploading files to S3...');
  
  // Upload files recursively
  await uploadDirectory(outDir, '');
  
  // Invalidate CloudFront cache
  if (DIST_ID) {
    console.log('🔄 Invalidating CloudFront cache...');
    await invalidateCloudFront();
  }
  
  console.log('✅ Deployment completed successfully!');
  console.log(`📍 Hosted at: https://${BUCKET_NAME}.s3-website.${AWS_REGION}.amazonaws.com`);
}

async function uploadDirectory(localPath, s3Prefix) {
  const items = fs.readdirSync(localPath);
  
  for (const item of items) {
    const localItemPath = path.join(localPath, item);
    const s3Key = s3Prefix ? `${s3Prefix}/${item}` : item;
    
    const stat = fs.statSync(localItemPath);
    
    if (stat.isDirectory()) {
      // Recursively upload directory
      await uploadDirectory(localItemPath, s3Key);
    } else {
      // Upload file
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fs.readFileSync(localItemPath),
        ContentType: getContentType(item),
        CacheControl: getCacheControl(item),
      };
      
      await s3.upload(uploadParams).promise();
      console.log(`  ✅ Uploaded: ${s3Key}`);
    }
  }
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ttf': 'font/ttf',
    '.wasm': 'application/wasm',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
    '.pdf': 'application/pdf',
    '.md': 'text/markdown',
    '.csv': 'text/csv',
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}

function getCacheControl(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  
  // HTML files - cache short for SPAs
  if (ext === '.html') return 'max-age=0, must-revalidate';
  
  // Static assets - cache long
  if (ext === '.css' || ext === '.js' || ext === '.png' || ext === '.jpg' || 
      ext === '.jpeg' || ext === '.gif' || ext === '.svg') {
    return 'max-age=31536000, immutable';
  }
  
  // Other files - cache moderately
  return 'max-age=3600';
}

async function invalidateCloudFront() {
  const invalidationParams = {
    DistributionId: DIST_ID,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ['/*'],
      },
    },
  };
  
  await cloudfront.createInvalidation(invalidationParams).promise();
  console.log('✅ CloudFront cache invalidation initiated');
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Run deployment
uploadToS3().catch((error) => {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
});
