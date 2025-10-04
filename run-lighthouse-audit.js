const fs = require('fs');

async function runLighthouseAudit(url) {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=mobile`;
  
  console.log('🔍 Running Lighthouse audit via PageSpeed Insights API...');
  console.log('URL:', url);
  
  const response = await fetch(apiUrl);
  const data = await response.json();
  
  if (data.error) {
    console.error('Error:', data.error.message);
    return;
  }
  
  const lighthouse = data.lighthouseResult;
  const categories = lighthouse.categories;
  
  console.log('\n📊 LIGHTHOUSE AUDIT RESULTS\n');
  console.log('━'.repeat(50));
  console.log('Performance:    ', Math.round(categories.performance.score * 100), '/100');
  console.log('Accessibility:  ', Math.round(categories.accessibility.score * 100), '/100');
  console.log('Best Practices: ', Math.round(categories['best-practices'].score * 100), '/100');
  console.log('SEO:           ', Math.round(categories.seo.score * 100), '/100');
  console.log('━'.repeat(50));
  
  // Core Web Vitals
  const metrics = lighthouse.audits;
  console.log('\n⚡ CORE WEB VITALS\n');
  console.log('━'.repeat(50));
  console.log('LCP (Largest Contentful Paint):  ', metrics['largest-contentful-paint']?.displayValue || 'N/A');
  console.log('FID/TBT (Interactivity):         ', metrics['total-blocking-time']?.displayValue || 'N/A');
  console.log('CLS (Cumulative Layout Shift):   ', metrics['cumulative-layout-shift']?.displayValue || 'N/A');
  console.log('FCP (First Contentful Paint):    ', metrics['first-contentful-paint']?.displayValue || 'N/A');
  console.log('Speed Index:                     ', metrics['speed-index']?.displayValue || 'N/A');
  console.log('━'.repeat(50));
  
  // Key Opportunities
  console.log('\n🚀 KEY OPPORTUNITIES\n');
  console.log('━'.repeat(50));
  const opportunities = Object.entries(metrics)
    .filter(([key, audit]) => audit.score !== null && audit.score < 0.9 && audit.details?.type === 'opportunity')
    .sort((a, b) => (b[1].numericValue || 0) - (a[1].numericValue || 0))
    .slice(0, 10);
  
  opportunities.forEach(([key, audit]) => {
    console.log(`• ${audit.title}`);
    console.log(`  Impact: ${audit.displayValue || 'N/A'}`);
  });
  
  // Key Diagnostics
  console.log('\n🔧 KEY DIAGNOSTICS\n');
  console.log('━'.repeat(50));
  const diagnostics = Object.entries(metrics)
    .filter(([key, audit]) => audit.score !== null && audit.score < 0.9 && audit.details?.type !== 'opportunity')
    .slice(0, 10);
  
  diagnostics.forEach(([key, audit]) => {
    console.log(`• ${audit.title}`);
    console.log(`  ${audit.description || ''}`);
  });
  
  // Save full report
  const reportData = {
    timestamp: new Date().toISOString(),
    url,
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    },
    coreWebVitals: {
      lcp: metrics['largest-contentful-paint']?.numericValue,
      fid: metrics['max-potential-fid']?.numericValue,
      cls: metrics['cumulative-layout-shift']?.numericValue,
      fcp: metrics['first-contentful-paint']?.numericValue,
      speedIndex: metrics['speed-index']?.numericValue,
      tbt: metrics['total-blocking-time']?.numericValue
    },
    opportunities,
    diagnostics
  };
  
  fs.writeFileSync('lighthouse-audit-before.json', JSON.stringify(reportData, null, 2));
  console.log('\n✅ Full report saved to: lighthouse-audit-before.json');
  
  return reportData;
}

// Run audit
const testUrl = process.argv[2] || 'https://kruthika.fun';
runLighthouseAudit(testUrl)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
