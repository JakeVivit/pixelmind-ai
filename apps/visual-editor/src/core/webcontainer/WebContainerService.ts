import { WebContainer } from '@webcontainer/api'
import type {
  WebContainerFileTree,
  FileNode,
  ProjectConfig,
} from '../../../../packages/shared/src/types'
import { generateReactProjectTree } from '../../../../packages/shared/src/webcontainer'

export interface WebContainerProcess {
  id: string
  command: string
  status: 'running' | 'stopped' | 'error'
  output: string[]
  process?: any
}

export interface WebContainerStatus {
  isReady: boolean
  isBooting: boolean
  error: string | null
  bootTime?: number
  processes: WebContainerProcess[]
}

export class WebContainerService {
  private static instance: WebContainerService | null = null
  private webcontainer: WebContainer | null = null
  private status: WebContainerStatus = {
    isReady: false,
    isBooting: false,
    error: null,
    processes: [],
  }
  private listeners: Set<(status: WebContainerStatus) => void> = new Set()
  private processCounter = 0

  private constructor() {}

  static getInstance(): WebContainerService {
    if (!WebContainerService.instance) {
      WebContainerService.instance = new WebContainerService()
    }
    return WebContainerService.instance
  }

  /**
   * Initialize WebContainer
   */
  async initialize(): Promise<void> {
    if (this.webcontainer) {
      return // Already initialized
    }

    try {
      this.updateStatus({ isBooting: true, error: null })
      const startTime = Date.now()

      // Boot WebContainer
      this.webcontainer = await WebContainer.boot()

      const bootTime = Date.now() - startTime
      this.updateStatus({
        isReady: true,
        isBooting: false,
        bootTime,
      })

      console.log(`WebContainer booted successfully in ${bootTime}ms`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.updateStatus({
        isBooting: false,
        error: `Failed to boot WebContainer: ${errorMessage}`,
      })
      throw error
    }
  }

  /**
   * Check if WebContainer is ready
   */
  isReady(): boolean {
    return this.status.isReady && this.webcontainer !== null
  }

  /**
   * Get current status
   */
  getStatus(): WebContainerStatus {
    return { ...this.status }
  }

  /**
   * Subscribe to status changes
   */
  onStatusChange(listener: (status: WebContainerStatus) => void): () => void {
    this.listeners.add(listener)
    // Send current status immediately
    listener(this.getStatus())

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Mount files to WebContainer
   */
  async mountFiles(files: WebContainerFileTree): Promise<void> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized')
    }

    try {
      await this.webcontainer.mount(files)
      console.log('Files mounted successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to mount files: ${errorMessage}`)
    }
  }

  /**
   * Write a single file
   */
  async writeFile(path: string, content: string): Promise<void> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized')
    }

    try {
      await this.webcontainer.fs.writeFile(path, content)
      console.log(`File written: ${path}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to write file ${path}: ${errorMessage}`)
    }
  }

  /**
   * Read a file
   */
  async readFile(path: string): Promise<string> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized')
    }

    try {
      const content = await this.webcontainer.fs.readFile(path, 'utf-8')
      return content
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to read file ${path}: ${errorMessage}`)
    }
  }

  /**
   * List directory contents
   */
  async listDirectory(path: string = '.'): Promise<FileNode[]> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized')
    }

    try {
      const entries = await this.webcontainer.fs.readdir(path, { withFileTypes: true })
      return entries.map(entry => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        path: `${path}/${entry.name}`.replace(/\/+/g, '/').replace(/^\//, ''),
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to list directory ${path}: ${errorMessage}`)
    }
  }

  /**
   * Run a command in WebContainer
   */
  async runCommand(command: string, args: string[] = []): Promise<WebContainerProcess> {
    if (!this.webcontainer) {
      throw new Error('WebContainer not initialized')
    }

    const processId = `process_${++this.processCounter}`
    const processInfo: WebContainerProcess = {
      id: processId,
      command: `${command} ${args.join(' ')}`.trim(),
      status: 'running',
      output: [],
    }

    try {
      const process = await this.webcontainer.spawn(command, args)
      processInfo.process = process

      // Handle process output
      process.output.pipeTo(
        new WritableStream({
          write: data => {
            const text = new TextDecoder().decode(data)
            processInfo.output.push(text)
            this.notifyProcessUpdate(processInfo)
          },
        })
      )

      // Handle process exit
      process.exit.then(exitCode => {
        processInfo.status = exitCode === 0 ? 'stopped' : 'error'
        this.notifyProcessUpdate(processInfo)
      })

      // Add to processes list
      this.status.processes.push(processInfo)
      this.notifyStatusChange()

      console.log(`Started process: ${processInfo.command}`)
      return processInfo
    } catch (error) {
      processInfo.status = 'error'
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      processInfo.output.push(`Error: ${errorMessage}`)
      throw new Error(`Failed to run command: ${errorMessage}`)
    }
  }

  /**
   * Install dependencies using npm
   */
  async installDependencies(): Promise<WebContainerProcess> {
    return this.runCommand('npm', ['install'])
  }

  /**
   * Start development server
   */
  async startDevServer(): Promise<WebContainerProcess> {
    return this.runCommand('npm', ['run', 'dev'])
  }

  /**
   * Get server URL when dev server is ready
   */
  async getServerUrl(): Promise<string | null> {
    if (!this.webcontainer) {
      return null
    }

    try {
      // Wait for server to be ready (usually on port 5173 for Vite)
      await this.waitForPort(5173)
      return this.webcontainer.url
    } catch (error) {
      console.error('Failed to get server URL:', error)
      return null
    }
  }

  /**
   * Wait for a port to be available
   */
  private async waitForPort(port: number, timeout = 30000): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      try {
        if (this.webcontainer) {
          // Try to access the port
          const response = await fetch(`${this.webcontainer.url}:${port}`)
          if (response.ok) {
            return
          }
        }
      } catch {
        // Port not ready yet
      }

      // Wait 500ms before trying again
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    throw new Error(`Port ${port} not available after ${timeout}ms`)
  }

  /**
   * Create a React project
   */
  async createReactProject(projectName: string): Promise<void> {
    const projectFiles = generateReactProjectTree(projectName)
    await this.mountFiles(projectFiles)
  }

  /**
   * Kill a process
   */
  async killProcess(processId: string): Promise<void> {
    const processIndex = this.status.processes.findIndex(p => p.id === processId)
    if (processIndex === -1) {
      throw new Error(`Process not found: ${processId}`)
    }

    const processInfo = this.status.processes[processIndex]
    if (processInfo.process && processInfo.status === 'running') {
      processInfo.process.kill()
      processInfo.status = 'stopped'
      this.notifyProcessUpdate(processInfo)
    }
  }

  /**
   * Clear all processes
   */
  clearProcesses(): void {
    this.status.processes = []
    this.notifyStatusChange()
  }

  /**
   * Update status and notify listeners
   */
  private updateStatus(updates: Partial<WebContainerStatus>): void {
    this.status = { ...this.status, ...updates }
    this.notifyStatusChange()
  }

  /**
   * Notify all listeners of status change
   */
  private notifyStatusChange(): void {
    const currentStatus = this.getStatus()
    this.listeners.forEach(listener => {
      try {
        listener(currentStatus)
      } catch (error) {
        console.error('Error in status change listener:', error)
      }
    })
  }

  /**
   * Notify listeners of process update
   */
  private notifyProcessUpdate(processInfo: WebContainerProcess): void {
    // Update the process in the list
    const index = this.status.processes.findIndex(p => p.id === processInfo.id)
    if (index !== -1) {
      this.status.processes[index] = processInfo
      this.notifyStatusChange()
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.webcontainer) {
      // Kill all running processes
      for (const process of this.status.processes) {
        if (process.status === 'running' && process.process) {
          try {
            process.process.kill()
          } catch (error) {
            console.error('Error killing process:', error)
          }
        }
      }

      this.webcontainer = null
      this.status = {
        isReady: false,
        isBooting: false,
        error: null,
        processes: [],
      }
      this.notifyStatusChange()
    }
  }
}
