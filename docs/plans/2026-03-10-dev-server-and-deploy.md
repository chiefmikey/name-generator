# Plan: Dev Server + S3/CloudFront Deployment to name.hullowurld.com

_Status: COMPLETED_
_LastCompletedStep: 5_
_TotalSteps: 5_
_Completed: 2026-03-10_
_Summary: Added webpack-dev-server, favicon, deployed to S3+CloudFront at name.hullowurld.com with ACM cert and Route53 DNS._

## Goal

Add local dev server for development workflow, fix missing favicon, deploy static site to S3 + CloudFront at name.hullowurld.com, and clean up leftover files.

## Steps

### Step 1: Add webpack-dev-server + fix favicon
- Install webpack-dev-server
- Add `dev` script to package.json
- Update webpack.config.js devServer (use `static` not deprecated `contentBase`)
- Create a simple favicon.ico in public/assets/
- Update index.html favicon reference if needed
- **Verify**: `npm run dev` starts and serves the app on localhost

### Step 2: Clean up leftover files
- Add .playwright-mcp/ and *.png screenshots to .gitignore
- Remove stale webpack config references (url-loader, @svgr/webpack rules)
- Add `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` to DefinePlugin
- **Verify**: Build compiles, lint passes

### Step 3: AWS infrastructure — S3 bucket + ACM cert
- Create S3 bucket `name-hullowurld-com` with static website hosting
- Request ACM certificate for `name.hullowurld.com` in us-east-1
- Add DNS validation CNAME record to Route53
- Wait for cert validation
- **Verify**: Cert status is ISSUED, S3 bucket serves index.html

### Step 4: CloudFront distribution + DNS
- Create CloudFront distribution with S3 origin
- Attach ACM cert, set alternate domain name.hullowurld.com
- Add Route53 A record (alias) pointing to CloudFront
- Configure SPA fallback (403/404 -> /index.html)
- **Verify**: `curl -I https://name.hullowurld.com` returns 200

### Step 5: Deploy + final verification
- Upload built assets to S3
- Create CloudFront invalidation
- Visual browser test on name.hullowurld.com
- Commit all changes and push
- **Verify**: Site loads, name generation works, emo mode works

## Verification Plan
- Build compiles without errors
- Lint passes (0 errors)
- Local dev server starts and serves the app
- S3 bucket has correct static website config
- CloudFront distribution is deployed
- name.hullowurld.com resolves and loads the site
- Name generation and emo mode work in browser

## Risks
- ACM cert validation can take up to 30 minutes (usually 2-5 min with DNS validation)
- CloudFront distribution deployment takes 5-15 minutes
- S3 bucket name may be taken — use alternative if needed

## Execution Journal
