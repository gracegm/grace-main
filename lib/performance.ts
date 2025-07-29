// Performance Optimization Utilities for PeachieGlow

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render times
  startTimer(componentName: string): void {
    this.metrics.set(`${componentName}_start`, performance.now());
  }

  endTimer(componentName: string): number {
    const startTime = this.metrics.get(`${componentName}_start`);
    if (!startTime) return 0;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    this.metrics.set(`${componentName}_duration`, duration);
    
    // Log slow components (>100ms)
    if (duration > 100) {
      console.warn(`Slow component render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  // Track API call performance
  async trackAPICall<T>(
    endpoint: string, 
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      this.metrics.set(`api_${endpoint}_duration`, duration);
      
      // Log slow API calls (>2000ms)
      if (duration > 2000) {
        console.warn(`Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.metrics.set(`api_${endpoint}_error_duration`, duration);
      console.error(`API call failed: ${endpoint} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  // Get performance report
  getPerformanceReport(): {
    componentMetrics: Record<string, number>;
    apiMetrics: Record<string, number>;
    recommendations: string[];
  } {
    const componentMetrics: Record<string, number> = {};
    const apiMetrics: Record<string, number> = {};
    const recommendations: string[] = [];

    for (const [key, value] of this.metrics.entries()) {
      if (key.includes('_duration')) {
        if (key.startsWith('api_')) {
          apiMetrics[key] = value;
          if (value > 2000) {
            recommendations.push(`Optimize ${key.replace('api_', '').replace('_duration', '')} API call (${value.toFixed(2)}ms)`);
          }
        } else {
          componentMetrics[key] = value;
          if (value > 100) {
            recommendations.push(`Optimize ${key.replace('_duration', '')} component render (${value.toFixed(2)}ms)`);
          }
        }
      }
    }

    return { componentMetrics, apiMetrics, recommendations };
  }
}

// Image optimization utilities
export const ImageOptimizer = {
  // Generate responsive image sizes
  generateSrcSet(baseUrl: string, sizes: number[]): string {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  // Lazy loading intersection observer
  createLazyLoader(): IntersectionObserver {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
  },

  // Preload critical images
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }
};

// Bundle size analyzer
export const BundleAnalyzer = {
  // Analyze component bundle impact
  analyzeComponentSize(componentName: string): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0) {
        const navigation = entries[0] as PerformanceNavigationTiming;
        console.log(`Bundle analysis for ${componentName}:`, {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize
        });
      }
    }
  },

  // Check for unused dependencies
  checkUnusedDependencies(): string[] {
    const warnings: string[] = [];
    
    // Check for common unused dependencies
    const potentiallyUnused = [
      'lodash', 'moment', 'jquery', 'bootstrap'
    ];
    
    potentiallyUnused.forEach(dep => {
      try {
        require.resolve(dep);
        warnings.push(`Potentially unused dependency detected: ${dep}`);
      } catch {
        // Dependency not found, which is good
      }
    });
    
    return warnings;
  }
};

// Memory leak detector
export const MemoryLeakDetector = {
  private listeners: Map<string, EventListener[]> = new Map(),
  private timers: Set<number> = new Set(),
  private intervals: Set<number> = new Set(),

  // Track event listeners
  trackEventListener(element: string, event: string, listener: EventListener): void {
    const key = `${element}_${event}`;
    const existing = this.listeners.get(key) || [];
    existing.push(listener);
    this.listeners.set(key, existing);
  },

  // Track timers
  trackTimeout(id: number): void {
    this.timers.add(id);
  },

  trackInterval(id: number): void {
    this.intervals.add(id);
  },

  // Cleanup all tracked resources
  cleanup(): void {
    // Clear timers
    this.timers.forEach(id => clearTimeout(id));
    this.intervals.forEach(id => clearInterval(id));
    
    // Clear listeners (would need actual DOM elements to remove)
    console.log(`Cleanup: ${this.listeners.size} listener types, ${this.timers.size} timers, ${this.intervals.size} intervals`);
    
    this.listeners.clear();
    this.timers.clear();
    this.intervals.clear();
  },

  // Get memory usage report
  getMemoryReport(): { 
    listenerCount: number; 
    timerCount: number; 
    intervalCount: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    if (this.listeners.size > 50) {
      recommendations.push('High number of event listeners detected - consider cleanup');
    }
    
    if (this.timers.size > 20) {
      recommendations.push('High number of active timers - ensure proper cleanup');
    }
    
    if (this.intervals.size > 10) {
      recommendations.push('High number of active intervals - ensure proper cleanup');
    }
    
    return {
      listenerCount: this.listeners.size,
      timerCount: this.timers.size,
      intervalCount: this.intervals.size,
      recommendations
    };
  }
};

// Export singleton instances
export const performanceMonitor = PerformanceMonitor.getInstance();
