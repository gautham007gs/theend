
// A/B Testing Framework for Optimizing User Experience
export class ABTestingFramework {
  private static experiments: Map<string, { variant: string; startTime: number }> = new Map();

  static getVariant(experimentName: string, variants: string[]): string {
    const userId = localStorage.getItem('kruthika_user_id') || 'anonymous';
    const hash = this.hashCode(userId + experimentName);
    const index = Math.abs(hash) % variants.length;
    
    const variant = variants[index];
    this.experiments.set(experimentName, { variant, startTime: Date.now() });
    
    return variant;
  }

  static trackConversion(experimentName: string, conversionType: string) {
    const experiment = this.experiments.get(experimentName);
    if (!experiment) return;
    
    // Send to analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'ab_test_conversion',
        experiment: experimentName,
        variant: experiment.variant,
        conversion: conversionType,
        timeToConvert: Date.now() - experiment.startTime
      })
    });
  }

  private static hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  // Example experiments
  static getGreetingStyle(): 'casual' | 'romantic' | 'enthusiastic' {
    return this.getVariant('greeting_style', ['casual', 'romantic', 'enthusiastic']) as any;
  }
}
