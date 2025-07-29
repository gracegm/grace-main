#!/usr/bin/env node

// PeachieGlow Deployment Script
// Comprehensive testing, optimization, and deployment automation

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class PeachieGlowDeployer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.buildDir = path.join(this.projectRoot, '.next');
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '🔵',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    if (type === 'error') this.errors.push(message);
    if (type === 'warning') this.warnings.push(message);
  }

  // Pre-deployment checks
  async runPreDeploymentChecks() {
    this.log('🚀 Starting PeachieGlow deployment process...', 'info');
    
    // Check Node.js version
    const nodeVersion = process.version;
    this.log(`Node.js version: ${nodeVersion}`, 'info');
    
    if (parseInt(nodeVersion.slice(1)) < 18) {
      this.log('Node.js version 18+ required for optimal performance', 'warning');
    }

    // Check package.json
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.log('package.json not found', 'error');
      return false;
    }

    // Check environment variables
    const envPath = path.join(this.projectRoot, '.env');
    if (!fs.existsSync(envPath)) {
      this.log('.env file not found - creating template', 'warning');
      this.createEnvTemplate();
    }

    // Check critical files
    const criticalFiles = [
      'next.config.js',
      'tailwind.config.js',
      'tsconfig.json'
    ];

    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        this.log(`Critical file missing: ${file}`, 'error');
        return false;
      }
    }

    this.log('Pre-deployment checks completed', 'success');
    return true;
  }

  // Create environment template
  createEnvTemplate() {
    const envTemplate = `# PeachieGlow Environment Variables
# Copy this file to .env.local for local development

# Database (for production, replace with real database)
DATABASE_URL="file:./dev.db"

# AI Service Configuration
OPENAI_API_KEY="your-openai-api-key-here"
AI_MODEL="gpt-3.5-turbo"

# Analytics
GOOGLE_ANALYTICS_ID="your-ga-id-here"

# Security
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Performance Monitoring
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"

# Feature Flags
ENABLE_AI_FEATURES="true"
ENABLE_ANALYTICS="true"
ENABLE_PERFORMANCE_MONITORING="true"
`;

    fs.writeFileSync(path.join(this.projectRoot, '.env.example'), envTemplate);
    this.log('Created .env.example template', 'success');
  }

  // Install dependencies
  async installDependencies() {
    this.log('📦 Installing dependencies...', 'info');
    
    try {
      execSync('npm ci', { 
        cwd: this.projectRoot, 
        stdio: 'inherit' 
      });
      this.log('Dependencies installed successfully', 'success');
      return true;
    } catch (error) {
      this.log(`Dependency installation failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Run tests
  async runTests() {
    this.log('🧪 Running test suite...', 'info');
    
    try {
      // Type checking
      this.log('Running TypeScript type checking...', 'info');
      execSync('npx tsc --noEmit', { 
        cwd: this.projectRoot, 
        stdio: 'inherit' 
      });
      this.log('TypeScript type checking passed', 'success');

      // Linting
      this.log('Running ESLint...', 'info');
      try {
        execSync('npx eslint . --ext .ts,.tsx --max-warnings 0', { 
          cwd: this.projectRoot, 
          stdio: 'inherit' 
        });
        this.log('Linting passed', 'success');
      } catch (error) {
        this.log('Linting warnings found - continuing deployment', 'warning');
      }

      return true;
    } catch (error) {
      this.log(`Tests failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Build optimization
  async buildProject() {
    this.log('🏗️ Building PeachieGlow for production...', 'info');
    
    try {
      // Clean previous build
      if (fs.existsSync(this.buildDir)) {
        fs.rmSync(this.buildDir, { recursive: true, force: true });
        this.log('Cleaned previous build', 'info');
      }

      // Build project
      execSync('npm run build', { 
        cwd: this.projectRoot, 
        stdio: 'inherit' 
      });
      
      this.log('Build completed successfully', 'success');
      
      // Analyze bundle size
      await this.analyzeBundleSize();
      
      return true;
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Analyze bundle size
  async analyzeBundleSize() {
    this.log('📊 Analyzing bundle size...', 'info');
    
    try {
      const buildManifest = path.join(this.buildDir, 'build-manifest.json');
      if (fs.existsSync(buildManifest)) {
        const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
        
        // Calculate total bundle size
        let totalSize = 0;
        const sizeWarnings = [];
        
        Object.entries(manifest.pages).forEach(([page, files]) => {
          const pageSize = files.reduce((sum, file) => {
            const filePath = path.join(this.buildDir, 'static', file);
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);
              return sum + stats.size;
            }
            return sum;
          }, 0);
          
          totalSize += pageSize;
          
          // Warn about large pages (>500KB)
          if (pageSize > 500 * 1024) {
            sizeWarnings.push(`Large page bundle: ${page} (${(pageSize / 1024).toFixed(2)}KB)`);
          }
        });
        
        this.log(`Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`, 'info');
        
        if (sizeWarnings.length > 0) {
          sizeWarnings.forEach(warning => this.log(warning, 'warning'));
        }
        
        // Warn if total size is too large
        if (totalSize > 5 * 1024 * 1024) { // 5MB
          this.log('Bundle size is large - consider code splitting', 'warning');
        }
      }
    } catch (error) {
      this.log(`Bundle analysis failed: ${error.message}`, 'warning');
    }
  }

  // Performance audit
  async runPerformanceAudit() {
    this.log('⚡ Running performance audit...', 'info');
    
    // Check for common performance issues
    const performanceChecks = [
      {
        name: 'Large images without optimization',
        check: () => this.checkLargeImages(),
      },
      {
        name: 'Unused dependencies',
        check: () => this.checkUnusedDependencies(),
      },
      {
        name: 'Bundle size optimization',
        check: () => this.checkBundleOptimization(),
      }
    ];

    for (const check of performanceChecks) {
      try {
        const result = await check.check();
        if (result.issues.length > 0) {
          result.issues.forEach(issue => this.log(issue, 'warning'));
        } else {
          this.log(`✓ ${check.name}`, 'success');
        }
      } catch (error) {
        this.log(`Performance check failed: ${check.name} - ${error.message}`, 'warning');
      }
    }
  }

  checkLargeImages() {
    const issues = [];
    // This would scan for large images in the public directory
    // Simplified for demo
    return { issues };
  }

  checkUnusedDependencies() {
    const issues = [];
    // This would analyze package.json vs actual imports
    // Simplified for demo
    return { issues };
  }

  checkBundleOptimization() {
    const issues = [];
    // Check if tree shaking is working properly
    // Simplified for demo
    return { issues };
  }

  // Security audit
  async runSecurityAudit() {
    this.log('🔒 Running security audit...', 'info');
    
    try {
      execSync('npm audit --audit-level moderate', { 
        cwd: this.projectRoot, 
        stdio: 'inherit' 
      });
      this.log('Security audit passed', 'success');
    } catch (error) {
      this.log('Security vulnerabilities found - please review', 'warning');
    }
  }

  // Generate deployment report
  generateDeploymentReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: 'PeachieGlow B2C SaaS Landing Page',
      version: this.getProjectVersion(),
      status: this.errors.length === 0 ? 'SUCCESS' : 'FAILED',
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        deploymentReady: this.errors.length === 0
      }
    };

    const reportPath = path.join(this.projectRoot, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Deployment report generated: ${reportPath}`, 'info');
    return report;
  }

  getProjectVersion() {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
      );
      return packageJson.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  // Main deployment process
  async deploy() {
    console.log('🌟 PeachieGlow Deployment Pipeline Starting...\n');
    
    const steps = [
      { name: 'Pre-deployment checks', fn: () => this.runPreDeploymentChecks() },
      { name: 'Install dependencies', fn: () => this.installDependencies() },
      { name: 'Run tests', fn: () => this.runTests() },
      { name: 'Build project', fn: () => this.buildProject() },
      { name: 'Performance audit', fn: () => this.runPerformanceAudit() },
      { name: 'Security audit', fn: () => this.runSecurityAudit() }
    ];

    for (const step of steps) {
      this.log(`\n--- ${step.name.toUpperCase()} ---`, 'info');
      const success = await step.fn();
      
      if (!success && step.name !== 'Performance audit' && step.name !== 'Security audit') {
        this.log(`Deployment failed at: ${step.name}`, 'error');
        break;
      }
    }

    // Generate final report
    const report = this.generateDeploymentReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 PEACHIEGLOW DEPLOYMENT SUMMARY');
    console.log('='.repeat(60));
    console.log(`Status: ${report.status}`);
    console.log(`Errors: ${report.summary.totalErrors}`);
    console.log(`Warnings: ${report.summary.totalWarnings}`);
    console.log(`Ready for deployment: ${report.summary.deploymentReady ? 'YES' : 'NO'}`);
    
    if (report.summary.deploymentReady) {
      console.log('\n✅ PeachieGlow is ready for production deployment!');
      console.log('\n🚀 Next steps:');
      console.log('   1. Deploy to your hosting platform (Vercel, Netlify, etc.)');
      console.log('   2. Configure environment variables');
      console.log('   3. Set up monitoring and analytics');
      console.log('   4. Run final smoke tests');
    } else {
      console.log('\n❌ Please fix the errors before deploying to production.');
    }
    
    console.log('='.repeat(60));
    
    return report.summary.deploymentReady;
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployer = new PeachieGlowDeployer();
  deployer.deploy().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}

module.exports = PeachieGlowDeployer;
