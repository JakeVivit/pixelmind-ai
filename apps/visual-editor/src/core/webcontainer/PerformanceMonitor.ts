// Performance monitoring utilities for WebContainer

export interface PerformanceMetrics {
  // Timing metrics
  bootTime: number | null
  lastOperationTime: number | null
  totalOperations: number
  averageOperationTime: number
  
  // Memory metrics (estimated)
  estimatedMemoryUsage: number
  
  // Process metrics
  activeProcesses: number
  totalProcessesStarted: number
  
  // Error metrics
  totalErrors: number
  errorRate: number
  
  // Timestamps
  startTime: number
  lastUpdateTime: number
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    bootTime: null,
    lastOperationTime: null,
    totalOperations: 0,
    averageOperationTime: 0,
    estimatedMemoryUsage: 0,
    activeProcesses: 0,
    totalProcessesStarted: 0,
    totalErrors: 0,
    errorRate: 0,
    startTime: Date.now(),
    lastUpdateTime: Date.now()
  }
  
  private operationTimes: number[] = []
  private maxOperationHistory = 100 // Keep last 100 operations for average calculation

  /**
   * Record boot time
   */
  recordBootTime(bootTime: number): void {
    this.metrics.bootTime = bootTime
    this.updateTimestamp()
  }

  /**
   * Record operation time
   */
  recordOperation(operationTime: number): void {
    this.metrics.lastOperationTime = operationTime
    this.metrics.totalOperations++
    
    // Add to operation times history
    this.operationTimes.push(operationTime)
    
    // Keep only recent operations
    if (this.operationTimes.length > this.maxOperationHistory) {
      this.operationTimes.shift()
    }
    
    // Calculate average
    this.metrics.averageOperationTime = 
      this.operationTimes.reduce((sum, time) => sum + time, 0) / this.operationTimes.length
    
    this.updateTimestamp()
  }

  /**
   * Record process start
   */
  recordProcessStart(): void {
    this.metrics.activeProcesses++
    this.metrics.totalProcessesStarted++
    this.updateTimestamp()
  }

  /**
   * Record process end
   */
  recordProcessEnd(): void {
    this.metrics.activeProcesses = Math.max(0, this.metrics.activeProcesses - 1)
    this.updateTimestamp()
  }

  /**
   * Record error
   */
  recordError(): void {
    this.metrics.totalErrors++
    this.metrics.errorRate = this.metrics.totalErrors / Math.max(1, this.metrics.totalOperations)
    this.updateTimestamp()
  }

  /**
   * Update estimated memory usage
   */
  updateMemoryUsage(estimatedUsage: number): void {
    this.metrics.estimatedMemoryUsage = estimatedUsage
    this.updateTimestamp()
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    overall: 'excellent' | 'good' | 'fair' | 'poor'
    bootPerformance: 'excellent' | 'good' | 'fair' | 'poor'
    operationPerformance: 'excellent' | 'good' | 'fair' | 'poor'
    reliability: 'excellent' | 'good' | 'fair' | 'poor'
    recommendations: string[]
  } {
    const { bootTime, averageOperationTime, errorRate } = this.metrics
    
    // Evaluate boot performance
    let bootPerformance: 'excellent' | 'good' | 'fair' | 'poor' = 'good'
    if (bootTime !== null) {
      if (bootTime < 1000) bootPerformance = 'excellent'
      else if (bootTime < 3000) bootPerformance = 'good'
      else if (bootTime < 5000) bootPerformance = 'fair'
      else bootPerformance = 'poor'
    }
    
    // Evaluate operation performance
    let operationPerformance: 'excellent' | 'good' | 'fair' | 'poor' = 'good'
    if (averageOperationTime < 500) operationPerformance = 'excellent'
    else if (averageOperationTime < 1500) operationPerformance = 'good'
    else if (averageOperationTime < 3000) operationPerformance = 'fair'
    else operationPerformance = 'poor'
    
    // Evaluate reliability
    let reliability: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent'
    if (errorRate < 0.01) reliability = 'excellent'
    else if (errorRate < 0.05) reliability = 'good'
    else if (errorRate < 0.1) reliability = 'fair'
    else reliability = 'poor'
    
    // Overall performance
    const scores = [bootPerformance, operationPerformance, reliability]
    const scoreValues = scores.map(score => {
      switch (score) {
        case 'excellent': return 4
        case 'good': return 3
        case 'fair': return 2
        case 'poor': return 1
        default: return 2
      }
    })
    const averageScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
    
    let overall: 'excellent' | 'good' | 'fair' | 'poor' = 'good'
    if (averageScore >= 3.5) overall = 'excellent'
    else if (averageScore >= 2.5) overall = 'good'
    else if (averageScore >= 1.5) overall = 'fair'
    else overall = 'poor'
    
    // Generate recommendations
    const recommendations: string[] = []
    
    if (bootPerformance === 'poor') {
      recommendations.push('WebContainer boot time is slow. Try refreshing the page or checking your internet connection.')
    }
    
    if (operationPerformance === 'poor') {
      recommendations.push('Operations are running slowly. Consider closing other browser tabs or applications.')
    }
    
    if (reliability === 'poor') {
      recommendations.push('High error rate detected. Check browser console for detailed error messages.')
    }
    
    if (this.metrics.activeProcesses > 5) {
      recommendations.push('Many processes are running. Consider stopping unused processes to improve performance.')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('WebContainer is performing well! All metrics are within acceptable ranges.')
    }
    
    return {
      overall,
      bootPerformance,
      operationPerformance,
      reliability,
      recommendations
    }
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = {
      bootTime: null,
      lastOperationTime: null,
      totalOperations: 0,
      averageOperationTime: 0,
      estimatedMemoryUsage: 0,
      activeProcesses: 0,
      totalProcessesStarted: 0,
      totalErrors: 0,
      errorRate: 0,
      startTime: Date.now(),
      lastUpdateTime: Date.now()
    }
    this.operationTimes = []
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      ...this.metrics,
      performanceSummary: this.getPerformanceSummary(),
      exportTime: new Date().toISOString()
    }, null, 2)
  }

  private updateTimestamp(): void {
    this.metrics.lastUpdateTime = Date.now()
  }
}
