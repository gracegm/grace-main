// Testing Utilities for PeachieGlow Components

export interface TestResult {
  componentName: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    renderTime: number;
    memoryUsage?: number;
  };
}

export class ComponentTester {
  private static instance: ComponentTester;
  private testResults: TestResult[] = [];

  static getInstance(): ComponentTester {
    if (!ComponentTester.instance) {
      ComponentTester.instance = new ComponentTester();
    }
    return ComponentTester.instance;
  }

  // Test component rendering
  async testComponentRender(
    componentName: string,
    testFunction: () => Promise<boolean>
  ): Promise<TestResult> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let passed = false;

    try {
      passed = await testFunction();
    } catch (error) {
      errors.push(`Render test failed: ${error}`);
      passed = false;
    }

    const renderTime = performance.now() - startTime;

    // Performance warnings
    if (renderTime > 100) {
      warnings.push(`Slow render time: ${renderTime.toFixed(2)}ms`);
    }

    const result: TestResult = {
      componentName,
      passed,
      errors,
      warnings,
      performance: { renderTime }
    };

    this.testResults.push(result);
    return result;
  }

  // Test API integration
  async testAPIIntegration(endpoint: string, testData: any): Promise<{
    success: boolean;
    responseTime: number;
    errors: string[];
  }> {
    const startTime = performance.now();
    const errors: string[] = [];

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const responseTime = performance.now() - startTime;

      if (!response.ok) {
        errors.push(`API returned ${response.status}: ${response.statusText}`);
        return { success: false, responseTime, errors };
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        errors.push('Invalid response format');
        return { success: false, responseTime, errors };
      }

      return { success: true, responseTime, errors };

    } catch (error) {
      const responseTime = performance.now() - startTime;
      errors.push(`Network error: ${error}`);
      return { success: false, responseTime, errors };
    }
  }

  // Test accessibility
  testAccessibility(element: HTMLElement): {
    passed: boolean;
    issues: string[];
    score: number;
  } {
    const issues: string[] = [];
    let score = 100;

    // Check for alt text on images
    const images = element.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        issues.push(`Image ${index + 1} missing alt text`);
        score -= 10;
      }
    });

    // Check for proper heading hierarchy
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        issues.push(`Heading level skip detected at heading ${index + 1}`);
        score -= 5;
      }
      lastLevel = level;
    });

    // Check for button accessibility
    const buttons = element.querySelectorAll('button');
    buttons.forEach((button, index) => {
      if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
        issues.push(`Button ${index + 1} missing accessible text`);
        score -= 8;
      }
    });

    // Check for form labels
    const inputs = element.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = id ? element.querySelector(`label[for="${id}"]`) : null;
      if (!label && !input.getAttribute('aria-label')) {
        issues.push(`Form input ${index + 1} missing label`);
        score -= 8;
      }
    });

    return {
      passed: issues.length === 0,
      issues,
      score: Math.max(0, score)
    };
  }

  // Test responsive design
  testResponsiveDesign(element: HTMLElement): {
    passed: boolean;
    breakpoints: { width: number; issues: string[] }[];
  } {
    const breakpoints = [
      { width: 320, name: 'Mobile' },
      { width: 768, name: 'Tablet' },
      { width: 1024, name: 'Desktop' },
      { width: 1440, name: 'Large Desktop' }
    ];

    const results = breakpoints.map(bp => {
      const issues: string[] = [];
      
      // Simulate viewport width (simplified)
      const computedStyle = window.getComputedStyle(element);
      
      // Check for horizontal overflow
      if (element.scrollWidth > bp.width) {
        issues.push(`Horizontal overflow at ${bp.name} (${bp.width}px)`);
      }

      // Check for minimum touch target size (44px)
      const clickableElements = element.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
      clickableElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          issues.push(`Touch target ${index + 1} too small at ${bp.name}: ${rect.width}x${rect.height}px`);
        }
      });

      return { width: bp.width, issues };
    });

    return {
      passed: results.every(r => r.issues.length === 0),
      breakpoints: results
    };
  }

  // Generate comprehensive test report
  generateTestReport(): {
    summary: {
      totalTests: number;
      passed: number;
      failed: number;
      warnings: number;
    };
    results: TestResult[];
    recommendations: string[];
  } {
    const totalTests = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = totalTests - passed;
    const warnings = this.testResults.reduce((sum, r) => sum + r.warnings.length, 0);

    const recommendations: string[] = [];

    // Performance recommendations
    const slowComponents = this.testResults.filter(r => r.performance.renderTime > 100);
    if (slowComponents.length > 0) {
      recommendations.push(`Optimize ${slowComponents.length} slow-rendering components`);
    }

    // Error pattern analysis
    const commonErrors = this.getCommonErrors();
    if (commonErrors.length > 0) {
      recommendations.push(`Address common error patterns: ${commonErrors.join(', ')}`);
    }

    return {
      summary: { totalTests, passed, failed, warnings },
      results: this.testResults,
      recommendations
    };
  }

  private getCommonErrors(): string[] {
    const errorCounts: Record<string, number> = {};
    
    this.testResults.forEach(result => {
      result.errors.forEach(error => {
        const errorType = error.split(':')[0];
        errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
      });
    });

    return Object.entries(errorCounts)
      .filter(([_, count]) => count > 1)
      .map(([error, count]) => `${error} (${count}x)`);
  }

  // Clear test results
  clearResults(): void {
    this.testResults = [];
  }
}

// API Testing Suite
export class APITester {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  // Test all PeachieGlow API endpoints
  async testAllEndpoints(): Promise<{
    glowbot: boolean;
    skinAnalysis: boolean;
    skinForecast: boolean;
    habits: boolean;
    userStats: boolean;
    achievements: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    const testUserId = 'user-1';

    // Test GlowBot chat
    let glowbot = false;
    try {
      const response = await fetch(`${this.baseUrl}/api/glowbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Test message',
          userId: testUserId
        })
      });
      glowbot = response.ok;
      if (!response.ok) errors.push(`GlowBot API failed: ${response.status}`);
    } catch (error) {
      errors.push(`GlowBot API error: ${error}`);
    }

    // Test Skin Analysis
    let skinAnalysis = false;
    try {
      const response = await fetch(`${this.baseUrl}/api/skin/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testUserId })
      });
      skinAnalysis = response.ok;
      if (!response.ok) errors.push(`Skin Analysis API failed: ${response.status}`);
    } catch (error) {
      errors.push(`Skin Analysis API error: ${error}`);
    }

    // Test Skin Forecast
    let skinForecast = false;
    try {
      const response = await fetch(`${this.baseUrl}/api/skin/forecast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: testUserId })
      });
      skinForecast = response.ok;
      if (!response.ok) errors.push(`Skin Forecast API failed: ${response.status}`);
    } catch (error) {
      errors.push(`Skin Forecast API error: ${error}`);
    }

    // Test Habits
    let habits = false;
    try {
      const response = await fetch(`${this.baseUrl}/api/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          taskId: 'test-task',
          taskTitle: 'Test Task',
          category: 'morning',
          completed: true
        })
      });
      habits = response.ok;
      if (!response.ok) errors.push(`Habits API failed: ${response.status}`);
    } catch (error) {
      errors.push(`Habits API error: ${error}`);
    }

    // Test User Stats
    let userStats = false;
    try {
      const response = await fetch(`${this.baseUrl}/api/user/stats?userId=${testUserId}`);
      userStats = response.ok;
      if (!response.ok) errors.push(`User Stats API failed: ${response.status}`);
    } catch (error) {
      errors.push(`User Stats API error: ${error}`);
    }

    // Test Achievements
    let achievements = false;
    try {
      const response = await fetch(`${this.baseUrl}/api/achievements?userId=${testUserId}`);
      achievements = response.ok;
      if (!response.ok) errors.push(`Achievements API failed: ${response.status}`);
    } catch (error) {
      errors.push(`Achievements API error: ${error}`);
    }

    return {
      glowbot,
      skinAnalysis,
      skinForecast,
      habits,
      userStats,
      achievements,
      errors
    };
  }
}

// Export singleton instances
export const componentTester = ComponentTester.getInstance();
