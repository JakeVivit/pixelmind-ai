import { useState, useEffect, useCallback, useRef } from 'react'
import {
  WebContainerService,
  type WebContainerStatus,
  type WebContainerProcess,
} from './WebContainerService'
import { PerformanceMonitor, type PerformanceMetrics } from './PerformanceMonitor'
import { useAppStore } from '@core/store/useAppStore'

export interface UseWebContainerReturn {
  // Status
  status: WebContainerStatus
  isReady: boolean
  isBooting: boolean
  error: string | null
  serverUrl: string | null

  // Actions
  initialize: () => Promise<void>
  createProject: (projectName: string) => Promise<void>
  installDependencies: () => Promise<void>
  startDevServer: () => Promise<void>
  writeFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
  runCommand: (command: string, args?: string[]) => Promise<WebContainerProcess>
  killProcess: (processId: string) => Promise<void>
  clearProcesses: () => void
  cleanup: () => Promise<void>

  // File system
  listDirectory: (path?: string) => Promise<any[]>

  // Performance metrics
  bootTime: number | null
  lastOperationTime: number | null
  performanceMetrics: PerformanceMetrics
  performanceSummary: ReturnType<PerformanceMonitor['getPerformanceSummary']>
}

export const useWebContainer = (): UseWebContainerReturn => {
  const [status, setStatus] = useState<WebContainerStatus>({
    isReady: false,
    isBooting: false,
    error: null,
    processes: [],
  })
  const [serverUrl, setServerUrl] = useState<string | null>(null)
  const [bootTime, setBootTime] = useState<number | null>(null)
  const [lastOperationTime, setLastOperationTime] = useState<number | null>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
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
    lastUpdateTime: Date.now(),
  })
  const [performanceSummary, setPerformanceSummary] = useState(
    new PerformanceMonitor().getPerformanceSummary()
  )

  const serviceRef = useRef<WebContainerService>()
  const performanceMonitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor())
  const { setWebContainerReady, setWebContainerError } = useAppStore()

  // Initialize service
  useEffect(() => {
    serviceRef.current = WebContainerService.getInstance()

    // Subscribe to status changes
    const unsubscribe = serviceRef.current.onStatusChange(newStatus => {
      setStatus(newStatus)
      setWebContainerReady(newStatus.isReady)
      setWebContainerError(newStatus.error)

      if (newStatus.bootTime) {
        setBootTime(newStatus.bootTime)
      }
    })

    return unsubscribe
  }, [setWebContainerReady, setWebContainerError])

  // Update performance metrics
  const updatePerformanceMetrics = useCallback(() => {
    const monitor = performanceMonitorRef.current
    const metrics = monitor.getMetrics()
    const summary = monitor.getPerformanceSummary()

    setPerformanceMetrics(metrics)
    setPerformanceSummary(summary)

    // Update estimated memory usage (rough estimation)
    const estimatedMemory = Math.round(
      metrics.activeProcesses * 50 + // 50MB per process
        metrics.totalOperations * 0.1 + // 0.1MB per operation
        Math.random() * 20 +
        30 // Base usage + some variance
    )
    monitor.updateMemoryUsage(estimatedMemory)
  }, [])

  // Wrapper function to measure operation time
  const withTiming = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      const startTime = Date.now()
      const monitor = performanceMonitorRef.current

      try {
        const result = await operation()
        const operationTime = Date.now() - startTime

        setLastOperationTime(operationTime)
        monitor.recordOperation(operationTime)
        updatePerformanceMetrics()

        return result
      } catch (error) {
        const operationTime = Date.now() - startTime

        setLastOperationTime(operationTime)
        monitor.recordOperation(operationTime)
        monitor.recordError()
        updatePerformanceMetrics()

        throw error
      }
    },
    [updatePerformanceMetrics]
  )

  const initialize = useCallback(async () => {
    if (!serviceRef.current) return

    try {
      await withTiming(async () => {
        await serviceRef.current!.initialize()

        // Record boot time in performance monitor
        const currentStatus = serviceRef.current!.getStatus()
        if (currentStatus.bootTime) {
          performanceMonitorRef.current.recordBootTime(currentStatus.bootTime)
          setBootTime(currentStatus.bootTime)
        }
      })
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error)
      throw error
    }
  }, [withTiming])

  const createProject = useCallback(
    async (projectName: string) => {
      if (!serviceRef.current) throw new Error('WebContainer service not available')

      try {
        await withTiming(() => serviceRef.current!.createReactProject(projectName))
      } catch (error) {
        console.error('Failed to create project:', error)
        throw error
      }
    },
    [withTiming]
  )

  const installDependencies = useCallback(async () => {
    if (!serviceRef.current) throw new Error('WebContainer service not available')

    try {
      await withTiming(() => serviceRef.current!.installDependencies())
    } catch (error) {
      console.error('Failed to install dependencies:', error)
      throw error
    }
  }, [withTiming])

  const startDevServer = useCallback(async () => {
    if (!serviceRef.current) throw new Error('WebContainer service not available')

    try {
      await withTiming(async () => {
        await serviceRef.current!.startDevServer()
        // Wait a bit for server to start, then get URL
        setTimeout(async () => {
          const url = await serviceRef.current!.getServerUrl()
          setServerUrl(url)
        }, 2000)
      })
    } catch (error) {
      console.error('Failed to start dev server:', error)
      throw error
    }
  }, [withTiming])

  const writeFile = useCallback(
    async (path: string, content: string) => {
      if (!serviceRef.current) throw new Error('WebContainer service not available')

      try {
        await withTiming(() => serviceRef.current!.writeFile(path, content))
      } catch (error) {
        console.error('Failed to write file:', error)
        throw error
      }
    },
    [withTiming]
  )

  const readFile = useCallback(
    async (path: string): Promise<string> => {
      if (!serviceRef.current) throw new Error('WebContainer service not available')

      try {
        return await withTiming(() => serviceRef.current!.readFile(path))
      } catch (error) {
        console.error('Failed to read file:', error)
        throw error
      }
    },
    [withTiming]
  )

  const listDirectory = useCallback(
    async (path?: string) => {
      if (!serviceRef.current) throw new Error('WebContainer service not available')

      try {
        return await withTiming(() => serviceRef.current!.listDirectory(path))
      } catch (error) {
        console.error('Failed to list directory:', error)
        throw error
      }
    },
    [withTiming]
  )

  const runCommand = useCallback(
    async (command: string, args: string[] = []) => {
      if (!serviceRef.current) throw new Error('WebContainer service not available')

      try {
        return await withTiming(() => serviceRef.current!.runCommand(command, args))
      } catch (error) {
        console.error('Failed to run command:', error)
        throw error
      }
    },
    [withTiming]
  )

  const killProcess = useCallback(async (processId: string) => {
    if (!serviceRef.current) throw new Error('WebContainer service not available')

    try {
      await serviceRef.current.killProcess(processId)
    } catch (error) {
      console.error('Failed to kill process:', error)
      throw error
    }
  }, [])

  const clearProcesses = useCallback(() => {
    if (!serviceRef.current) return
    serviceRef.current.clearProcesses()
  }, [])

  const cleanup = useCallback(async () => {
    if (!serviceRef.current) return

    try {
      await serviceRef.current.cleanup()
      setServerUrl(null)
      setBootTime(null)
      setLastOperationTime(null)
    } catch (error) {
      console.error('Failed to cleanup WebContainer:', error)
      throw error
    }
  }, [])

  return {
    // Status
    status,
    isReady: status.isReady,
    isBooting: status.isBooting,
    error: status.error,
    serverUrl,

    // Actions
    initialize,
    createProject,
    installDependencies,
    startDevServer,
    writeFile,
    readFile,
    runCommand,
    killProcess,
    clearProcesses,
    cleanup,

    // File system
    listDirectory,

    // Performance metrics
    bootTime,
    lastOperationTime,
    performanceMetrics,
    performanceSummary,
  }
}
