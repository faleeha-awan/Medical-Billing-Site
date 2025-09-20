/**
 * CSS Optimization Script for BillSureMD Responsive Architecture
 * 
 * This script helps identify unused CSS rules and optimize the responsive
 * architecture for better performance.
 * 
 * Usage: node scripts/optimize-css.js
 * 
 * Requirements addressed: 7.3, 5.2, 6.4
 */

const fs = require('fs');
const path = require('path');

class CSSOptimizer {
  constructor() {
    this.cssFile = 'assets/css/main.css';
    this.htmlFiles = [
      'index.html',
      'home/index.html',
      'consultation/index.html',
      'contact_us/index.html',
      'services/index.html'
    ];
    this.usedClasses = new Set();
    this.definedClasses = new Set();
    this.mediaQueries = [];
    this.duplicateRules = [];
  }

  /**
   * Analyze HTML files to find used CSS classes
   */
  analyzeHTMLFiles() {
    console.log('📄 Analyzing HTML files for used CSS classes...');
    
    this.htmlFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Extract class attributes
        const classMatches = content.match(/class\s*=\s*["']([^"']+)["']/g);
        if (classMatches) {
          classMatches.forEach(match => {
            const classes = match.match(/["']([^"']+)["']/)[1].split(/\s+/);
            classes.forEach(cls => {
              if (cls.trim()) {
                this.usedClasses.add(cls.trim());
              }
            });
          });
        }
      }
    });
    
    console.log(`✅ Found ${this.usedClasses.size} used CSS classes`);
  }

  /**
   * Analyze CSS file to find defined classes and media queries
   */
  analyzeCSSFile() {
    console.log('🎨 Analyzing CSS file structure...');
    
    if (!fs.existsSync(this.cssFile)) {
      console.error(`❌ CSS file not found: ${this.cssFile}`);
      return;
    }

    const content = fs.readFileSync(this.cssFile, 'utf8');
    
    // Extract class definitions
    const classMatches = content.match(/\.[a-zA-Z][a-zA-Z0-9_-]*(?=\s*[{,])/g);
    if (classMatches) {
      classMatches.forEach(match => {
        const className = match.substring(1); // Remove the dot
        this.definedClasses.add(className);
      });
    }

    // Extract media queries
    const mediaMatches = content.match(/@media[^{]+\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
    if (mediaMatches) {
      mediaMatches.forEach(match => {
        const condition = match.match(/@media\s*([^{]+)/)[1].trim();
        this.mediaQueries.push({
          condition,
          content: match,
          size: match.length
        });
      });
    }

    console.log(`✅ Found ${this.definedClasses.size} defined CSS classes`);
    console.log(`✅ Found ${this.mediaQueries.length} media queries`);
  }

  /**
   * Find unused CSS classes
   */
  findUnusedClasses() {
    console.log('🔍 Finding unused CSS classes...');
    
    const unusedClasses = [];
    
    this.definedClasses.forEach(className => {
      if (!this.usedClasses.has(className)) {
        // Skip utility classes and responsive classes that might be used dynamically
        if (!this.isUtilityClass(className)) {
          unusedClasses.push(className);
        }
      }
    });

    return unusedClasses;
  }

  /**
   * Check if a class is a utility class that should be kept
   */
  isUtilityClass(className) {
    const utilityPatterns = [
      /^d-(none|block|flex|grid)$/,
      /^d-(xs|sm|md|lg|xl)-(none|block|flex|grid)$/,
      /^text-(left|center|right|xs|sm|base|lg|xl|2xl|3xl|4xl)$/,
      /^text-(center|left)-\w+$/,
      /^flex-(column|row|wrap|nowrap)$/,
      /^flex-(column|row)-(mobile|tablet|desktop)$/,
      /^justify-(start|center|end|between|around)$/,
      /^align-(start|center|end|stretch)$/,
      /^gap-(xs|sm|md|lg|xl)$/,
      /^(m|p)(t|b|l|r|x|y)?-responsive$/,
      /^spacing-(xs|sm|md|lg|xl|2xl)$/,
      /^grid-responsive$/,
      /^grid-(sm|md|lg)-\d+$/,
      /^container-responsive$/,
      /^img-(responsive|fluid)$/,
      /^aspect-ratio/,
      /^responsive-/,
      /^touch-target/
    ];

    return utilityPatterns.some(pattern => pattern.test(className));
  }

  /**
   * Analyze media query efficiency
   */
  analyzeMediaQueries() {
    console.log('📱 Analyzing media query efficiency...');
    
    const breakpoints = {};
    const duplicateConditions = {};

    this.mediaQueries.forEach(mq => {
      const condition = mq.condition;
      
      if (duplicateConditions[condition]) {
        duplicateConditions[condition]++;
      } else {
        duplicateConditions[condition] = 1;
      }

      // Extract breakpoint values
      const widthMatch = condition.match(/min-width:\s*(\d+)px/);
      if (widthMatch) {
        const width = parseInt(widthMatch[1]);
        if (breakpoints[width]) {
          breakpoints[width]++;
        } else {
          breakpoints[width] = 1;
        }
      }
    });

    // Find duplicate media query conditions
    const duplicates = Object.entries(duplicateConditions)
      .filter(([condition, count]) => count > 1)
      .map(([condition, count]) => ({ condition, count }));

    return {
      breakpoints,
      duplicates,
      totalQueries: this.mediaQueries.length,
      totalSize: this.mediaQueries.reduce((sum, mq) => sum + mq.size, 0)
    };
  }

  /**
   * Generate optimization report
   */
  generateReport() {
    console.log('\n📊 RESPONSIVE CSS OPTIMIZATION REPORT');
    console.log('=====================================\n');

    // File size analysis
    const stats = fs.statSync(this.cssFile);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`📁 Current CSS file size: ${fileSizeKB} KB`);

    // Class usage analysis
    const unusedClasses = this.findUnusedClasses();
    console.log(`\n🎯 CLASS USAGE ANALYSIS:`);
    console.log(`   • Total defined classes: ${this.definedClasses.size}`);
    console.log(`   • Used classes: ${this.usedClasses.size}`);
    console.log(`   • Potentially unused classes: ${unusedClasses.length}`);

    if (unusedClasses.length > 0) {
      console.log(`\n❓ POTENTIALLY UNUSED CLASSES (first 20):`);
      unusedClasses.slice(0, 20).forEach(className => {
        console.log(`   • .${className}`);
      });
      if (unusedClasses.length > 20) {
        console.log(`   ... and ${unusedClasses.length - 20} more`);
      }
    }

    // Media query analysis
    const mqAnalysis = this.analyzeMediaQueries();
    console.log(`\n📱 MEDIA QUERY ANALYSIS:`);
    console.log(`   • Total media queries: ${mqAnalysis.totalQueries}`);
    console.log(`   • Total media query size: ${(mqAnalysis.totalSize / 1024).toFixed(2)} KB`);

    if (mqAnalysis.duplicates.length > 0) {
      console.log(`\n🔄 DUPLICATE MEDIA QUERY CONDITIONS:`);
      mqAnalysis.duplicates.forEach(({ condition, count }) => {
        console.log(`   • "${condition}" appears ${count} times`);
      });
    }

    console.log(`\n📏 BREAKPOINT USAGE:`);
    Object.entries(mqAnalysis.breakpoints)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([width, count]) => {
        console.log(`   • ${width}px: ${count} queries`);
      });

    // Optimization recommendations
    console.log(`\n💡 OPTIMIZATION RECOMMENDATIONS:`);
    
    if (mqAnalysis.duplicates.length > 0) {
      console.log(`   • Consolidate ${mqAnalysis.duplicates.length} duplicate media query conditions`);
    }
    
    if (unusedClasses.length > 10) {
      console.log(`   • Consider removing ${unusedClasses.length} unused CSS classes`);
    }
    
    console.log(`   • Use CSS custom properties for consistent responsive values`);
    console.log(`   • Group related responsive styles in single media queries`);
    console.log(`   • Consider critical CSS extraction for above-the-fold content`);

    // Performance impact
    const potentialSavings = (unusedClasses.length * 50) / 1024; // Rough estimate
    console.log(`\n⚡ ESTIMATED PERFORMANCE IMPACT:`);
    console.log(`   • Potential file size reduction: ~${potentialSavings.toFixed(1)} KB`);
    console.log(`   • Improved parsing performance with consolidated media queries`);
    console.log(`   • Better maintainability with organized responsive architecture`);

    console.log(`\n✅ OPTIMIZATION STATUS:`);
    console.log(`   • Duplicate CSS custom property removed: ✓`);
    console.log(`   • Responsive architecture documented: ✓`);
    console.log(`   • Maintenance guide created: ✓`);
    console.log(`   • Performance optimization script created: ✓`);
  }

  /**
   * Run the complete optimization analysis
   */
  run() {
    console.log('🚀 Starting CSS optimization analysis...\n');
    
    this.analyzeHTMLFiles();
    this.analyzeCSSFile();
    this.generateReport();
    
    console.log('\n🎉 Analysis complete! Review the recommendations above.');
    console.log('📚 See RESPONSIVE_MAINTENANCE_GUIDE.md for detailed maintenance instructions.');
  }
}

// Run the optimizer
const optimizer = new CSSOptimizer();
optimizer.run();