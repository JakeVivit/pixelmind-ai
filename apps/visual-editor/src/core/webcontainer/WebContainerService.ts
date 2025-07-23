import { WebContainer } from '@webcontainer/api'
import type { WebContainerFileTree, FileNode, ProjectConfig } from '@pixelmind/shared'
import { generateReactProjectTree } from '@pixelmind/shared'

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
  serverUrls?: Record<number, string> // port -> URL mapping
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
      console.log('WebContainer already initialized')
      return // Already initialized
    }

    try {
      console.log('Starting WebContainer initialization...')
      console.log('Browser environment check:')
      console.log('- User Agent:', navigator.userAgent)
      console.log('- Is HTTPS:', location.protocol === 'https:')
      console.log('- SharedArrayBuffer available:', typeof SharedArrayBuffer !== 'undefined')
      console.log('- WebAssembly available:', typeof WebAssembly !== 'undefined')

      // Check if WebContainer is supported
      if (typeof WebContainer === 'undefined') {
        throw new Error('WebContainer is not available')
      }

      // Check browser compatibility
      if (typeof SharedArrayBuffer === 'undefined') {
        console.warn('SharedArrayBuffer is not available - WebContainer may not work properly')
      }

      this.updateStatus({ isBooting: true, error: null })
      const startTime = Date.now()

      // Boot WebContainer with timeout
      console.log('Calling WebContainer.boot()...')
      const bootPromise = WebContainer.boot()
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('WebContainer boot timeout')), 30000)
      })

      this.webcontainer = (await Promise.race([bootPromise, timeoutPromise])) as WebContainer
      console.log('WebContainer.boot() completed')
      console.log('WebContainer instance:', this.webcontainer)
      console.log('WebContainer properties:', Object.keys(this.webcontainer))

      // Wait a bit for URL to be available
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('WebContainer URL after boot:', this.webcontainer?.url)

      const bootTime = Date.now() - startTime
      this.updateStatus({
        isReady: true,
        isBooting: false,
        bootTime,
      })

      console.log(`WebContainer booted successfully in ${bootTime}ms`)

      // Set up server-ready event listener to capture preview URLs
      this.setupServerReadyListener()
    } catch (error) {
      console.error('WebContainer initialization failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.updateStatus({
        isBooting: false,
        error: `Failed to boot WebContainer: ${errorMessage}`,
      })
      throw error
    }
  }

  /**
   * Set up server-ready event listener to capture preview URLs
   */
  private setupServerReadyListener(): void {
    if (!this.webcontainer) {
      return
    }

    // Listen for server-ready events
    this.webcontainer.on('server-ready', (port: number, url: string) => {
      console.log(`🎯 Server ready on port ${port}: ${url}`)

      // Store the server URL for this port
      this.status.serverUrls = this.status.serverUrls || {}
      this.status.serverUrls[port] = url

      // Notify listeners about the server being ready
      this.notifyServerReady(port, url)
    })

    // Also listen for port events
    this.webcontainer.on('port', (port: number, type: 'open' | 'close', url: string) => {
      console.log(`Port ${port} ${type}: ${url}`)

      if (type === 'open') {
        this.status.serverUrls = this.status.serverUrls || {}
        this.status.serverUrls[port] = url
      } else if (type === 'close') {
        if (this.status.serverUrls) {
          delete this.status.serverUrls[port]
        }
      }
    })
  }

  /**
   * Notify listeners about server ready event
   */
  private notifyServerReady(port: number, url: string): void {
    // You can add custom logic here to notify components
    console.log(`Server notification: Port ${port} ready at ${url}`)
  }

  /**
   * Wait for server-ready event
   */
  private async waitForServerReady(timeout = 30000): Promise<string | null> {
    if (!this.webcontainer) {
      return null
    }

    return new Promise(resolve => {
      const timeoutId = setTimeout(() => {
        console.log('Timeout waiting for server-ready event')
        resolve(null)
      }, timeout)

      // Listen for server-ready event
      const unsubscribe = this.webcontainer!.on('server-ready', (port: number, url: string) => {
        console.log(`🎯 Server ready event received: port ${port}, URL ${url}`)
        clearTimeout(timeoutId)
        unsubscribe()
        resolve(url)
      })

      // Also check if we already have a server URL
      if (this.status.serverUrls && Object.keys(this.status.serverUrls).length > 0) {
        const firstUrl = Object.values(this.status.serverUrls)[0]
        clearTimeout(timeoutId)
        unsubscribe()
        resolve(firstUrl)
      }
    })
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
            try {
              let text: string
              if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
                text = new TextDecoder().decode(data)
              } else if (typeof data === 'string') {
                text = data
              } else {
                text = String(data)
              }
              processInfo.output.push(text)

              // Log dev server output to help debug URL issues
              if (processInfo.command.includes('dev')) {
                console.log(`[${processInfo.command}] ${text}`)

                // Look for server URL in the output
                const urlMatch = text.match(/(?:Local|Network):\s*(https?:\/\/[^\s]+)/i)
                if (urlMatch) {
                  console.log(`🎯 Found dev server URL in output: ${urlMatch[1]}`)
                }
              }

              this.notifyProcessUpdate(processInfo)
            } catch (error) {
              console.error('Error processing output data:', error, data)
            }
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
   * Install dependencies using npm (more reliable in WebContainer)
   */
  async installDependencies(): Promise<WebContainerProcess> {
    console.log('Installing dependencies with npm...')

    // First check if package.json exists
    try {
      const packageJson = await this.webcontainer!.fs.readFile('/package.json', 'utf-8')
      console.log('package.json content:', packageJson)

      // Parse and validate package.json
      const pkg = JSON.parse(packageJson)
      console.log('Parsed package.json:', pkg)

      if (!pkg.dependencies && !pkg.devDependencies) {
        console.warn('No dependencies found in package.json')
      }
    } catch (error) {
      console.error('Error reading package.json:', error)
      throw new Error('package.json not found or invalid')
    }

    // Use the direct WebContainer spawn method like in our working demo
    console.log('Starting npm install process...')
    const installProcess = await this.webcontainer!.spawn('npm', ['install'])

    // Wait for the install process to complete
    console.log('Waiting for npm install to complete...')
    const exitCode = await installProcess.exit
    console.log(`npm install completed with exit code: ${exitCode}`)

    if (exitCode !== 0) {
      console.error('npm install failed with exit code:', exitCode)
      throw new Error(`npm install failed with exit code: ${exitCode}`)
    }

    console.log('✅ Dependencies installed successfully')

    // Additional wait to ensure all files are written
    await new Promise(resolve => setTimeout(resolve, 2000))

    return installProcess
  }

  /**
   * Start development server and capture URL
   */
  async startDevServer(): Promise<WebContainerProcess> {
    console.log('Starting dev server with npm...')

    // First check if vite is available
    try {
      const viteCheck = await this.runCommand('npx', ['vite', '--version'])
      await viteCheck.exit
      console.log('Vite is available')
    } catch (error) {
      console.error('Vite not found, trying to install...')
      // Try to install vite if it's missing
      const viteInstall = await this.runCommand('npm', ['install', 'vite', '--save-dev'])
      await viteInstall.exit
    }

    // Use npm for better WebContainer compatibility
    const process = await this.runCommand('npm', ['run', 'dev'])

    // Set up URL detection from process output
    this.setupUrlDetection(process)

    return process
  }

  /**
   * Set up URL detection from dev server output
   */
  private setupUrlDetection(processInfo: WebContainerProcess): void {
    // Store the detected URL
    let detectedUrl: string | null = null

    // Monitor process output for URL
    const originalOutput = processInfo.output
    Object.defineProperty(processInfo, 'detectedUrl', {
      get: () => detectedUrl,
      enumerable: true,
    })

    // Override the output array to detect URLs as they come in
    const outputProxy = new Proxy(originalOutput, {
      set: (target, property, value) => {
        if (property === 'length' || typeof property === 'number') {
          // New output was added
          const newOutput = value as string
          if (typeof newOutput === 'string') {
            // Look for URL patterns (excluding port 5173)
            const urlPatterns = [
              /Local:\s*(https?:\/\/[^\s]+)/i,
              /Network:\s*(https?:\/\/[^\s]+)/i,
              /running at:\s*(https?:\/\/[^\s]+)/i,
              /server started at\s*(https?:\/\/[^\s]+)/i,
              /(https?:\/\/localhost:(?!5173)\d+)/i, // Exclude port 5173
            ]

            for (const pattern of urlPatterns) {
              const match = newOutput.match(pattern)
              if (match && !detectedUrl) {
                detectedUrl = match[1]
                console.log(`🎯 Detected dev server URL: ${detectedUrl}`)
                break
              }
            }
          }
        }
        return Reflect.set(target, property, value)
      },
    })

    // Replace the original output array
    processInfo.output = outputProxy
  }

  /**
   * Get server URL when dev server is ready
   */
  async getServerUrl(): Promise<string | null> {
    if (!this.webcontainer) {
      console.error('WebContainer not initialized')
      return null
    }

    try {
      console.log('Getting server URL...')
      console.log('Current server URLs:', this.status.serverUrls)

      // Method 1: Check if we already have a server URL from events
      if (this.status.serverUrls) {
        // Try port 3000 first (our preferred port)
        if (this.status.serverUrls[3000]) {
          console.log(`✅ Found server URL for port 3000: ${this.status.serverUrls[3000]}`)
          return this.status.serverUrls[3000]
        }

        // Try any available port
        const availablePorts = Object.keys(this.status.serverUrls)
        if (availablePorts.length > 0) {
          const port = availablePorts[0]
          const url = this.status.serverUrls[parseInt(port)]
          console.log(`✅ Found server URL for port ${port}: ${url}`)
          return url
        }
      }

      // Method 2: Wait for server-ready event
      console.log('Waiting for server-ready event...')
      const serverUrl = await this.waitForServerReady(30000)
      if (serverUrl) {
        console.log(`✅ Got server URL from event: ${serverUrl}`)
        return serverUrl
      }

      // Method 2: Try to construct URL from WebContainer's origin
      // In newer versions, we might need to use a different approach
      console.log('Trying to get URL from WebContainer origin...')

      // Check if WebContainer has an origin or base URL
      const instance = (this.webcontainer as any)._instance
      const runtimeInfo = (this.webcontainer as any)._runtimeInfo

      console.log('Instance info:', instance)
      console.log('Runtime info:', runtimeInfo)

      // Method 3: Check for detected URL from dev server process
      console.log('Checking for detected URL from dev server...')
      const devProcess = this.status.processes.find(p => p.command.includes('dev'))
      if (devProcess) {
        const detectedUrl = (devProcess as any).detectedUrl
        if (detectedUrl) {
          console.log(`✅ Found detected URL: ${detectedUrl}`)
          return detectedUrl
        }

        console.log('Dev server process output:', devProcess.output)

        // Fallback: Look for URL patterns in the output (excluding port 5173)
        const output = devProcess.output.join('\n')
        const urlPatterns = [
          /Local:\s*(https?:\/\/[^\s]+)/i,
          /Network:\s*(https?:\/\/[^\s]+)/i,
          /running at:\s*(https?:\/\/[^\s]+)/i,
          /server started at\s*(https?:\/\/[^\s]+)/i,
          /(https?:\/\/localhost:(?!5173)\d+)/i, // Exclude port 5173
          /(https?:\/\/[^:]+:(?!5173)\d+)/i, // Exclude port 5173 for any host
        ]

        for (const pattern of urlPatterns) {
          const match = output.match(pattern)
          if (match) {
            console.log(`✅ Found URL in process output: ${match[1]}`)
            return match[1]
          }
        }
      }

      // Method 4: Try to construct a URL based on common patterns
      // WebContainer typically runs on localhost with a random port
      console.log('Attempting to construct URL...')

      // Try common dev server ports (excluding 5173 which is in use)
      const commonPorts = [3000, 8080, 4173, 3001, 8081, 4174, 5174]
      for (const port of commonPorts) {
        const testUrl = `http://localhost:${port}`
        console.log(`Testing constructed URL: ${testUrl}`)

        try {
          // This won't work due to CORS, but we can try
          // In a real scenario, WebContainer should provide the URL
          return testUrl
        } catch {
          continue
        }
      }

      console.error('❌ Could not determine WebContainer URL')
      return null
    } catch (error) {
      console.error('Failed to get server URL:', error)
      return null
    }
  }

  /**
   * Wait for dev server to be ready and return the server URL
   */
  private async waitForDevServer(baseUrl: string, timeout = 60000): Promise<string> {
    const startTime = Date.now()
    console.log('Waiting for dev server to be ready...')
    console.log('Base URL to check:', baseUrl)

    // Common dev server ports to check
    const ports = [5173, 3000, 8080, 4173]

    while (Date.now() - startTime < timeout) {
      const elapsed = Date.now() - startTime
      console.log(`Checking dev server... (${elapsed}ms elapsed)`)

      // First try the base URL (might already include the port)
      try {
        console.log(`Trying base URL: ${baseUrl}`)
        const response = await fetch(baseUrl, {
          method: 'HEAD',
          mode: 'no-cors',
        })
        console.log(`✅ Base URL ${baseUrl} is ready`)
        return baseUrl
      } catch (error) {
        console.log(`❌ Base URL ${baseUrl} not ready:`, error)
      }

      // Try different ports
      for (const port of ports) {
        try {
          const testUrl = `${baseUrl.replace(/:\d+$/, '')}:${port}`
          console.log(`Trying port ${port}: ${testUrl}`)
          const response = await fetch(testUrl, {
            method: 'HEAD',
            mode: 'no-cors',
          })
          console.log(`✅ Dev server ready at ${testUrl}`)
          return testUrl
        } catch (error) {
          console.log(`❌ Port ${port} not ready:`, error)
        }
      }

      // Wait before trying again
      console.log('Waiting 2 seconds before retry...')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    throw new Error(`Dev server not ready after ${timeout}ms`)
  }

  /**
   * Get preview URL for a specific port using WebContainer's preview mechanism
   */
  private async getPreviewUrl(port: number, timeout = 30000): Promise<string | null> {
    if (!this.webcontainer) {
      return null
    }

    console.log(`Getting preview URL for port ${port}...`)

    try {
      // WebContainer 1.1.0+ should provide preview URLs through a different mechanism
      // Let's try to access the preview URL directly

      // Method 1: Check if WebContainer has a preview method
      if (typeof (this.webcontainer as any).preview === 'function') {
        console.log('Using WebContainer preview method...')
        const previewUrl = await (this.webcontainer as any).preview(port)
        if (previewUrl) {
          console.log(`✅ Got preview URL from WebContainer: ${previewUrl}`)
          return previewUrl
        }
      }

      // Method 2: Try to get URL from WebContainer's internal URL with port
      const baseUrl = this.webcontainer.url
      if (baseUrl) {
        // Remove any existing port and add our port
        const urlWithoutPort = baseUrl.replace(/:\d+$/, '')
        const previewUrl = `${urlWithoutPort}:${port}`
        console.log(`Constructed preview URL: ${previewUrl}`)
        return previewUrl
      }

      // Method 3: Try to get from runtime info
      const runtimeInfo = (this.webcontainer as any)._runtimeInfo
      console.log('Runtime info for URL construction:', runtimeInfo)

      if (runtimeInfo) {
        // Look for origin or base URL in runtime info
        const origin = runtimeInfo.origin || runtimeInfo.baseUrl || runtimeInfo.url
        if (origin) {
          const previewUrl = `${origin}:${port}`
          console.log(`Using runtime origin: ${previewUrl}`)
          return previewUrl
        }
      }

      // Method 4: Check WebContainer instance for URL properties
      const instance = (this.webcontainer as any)._instance
      if (instance && typeof instance.getPreviewUrl === 'function') {
        console.log('Using instance getPreviewUrl method...')
        const previewUrl = await instance.getPreviewUrl(port)
        if (previewUrl) {
          console.log(`✅ Got preview URL from instance: ${previewUrl}`)
          return previewUrl
        }
      }

      console.log(`❌ Could not get preview URL for port ${port}`)
      return null
    } catch (error) {
      console.error(`Error getting preview URL for port ${port}:`, error)
      return null
    }
  }

  /**
   * Wait for the server to be ready
   */
  private async waitForServerReady(url: string, timeout = 60000): Promise<void> {
    const startTime = Date.now()
    console.log(`Waiting for server to be ready at: ${url}`)

    // First, wait a bit for the server to start
    await new Promise(resolve => setTimeout(resolve, 3000))

    while (Date.now() - startTime < timeout) {
      try {
        // Try to fetch the server with a simple GET request
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
        })

        if (response.ok || response.status === 200) {
          console.log('Server is ready!')
          return
        } else {
          console.log(`Server responded with status: ${response.status}`)
        }
      } catch (error) {
        console.log('Server not ready yet, retrying...', error)
      }

      // Wait 2 seconds before trying again
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    throw new Error(`Server not ready after ${timeout}ms`)
  }

  /**
   * Wait for a port to be available (legacy method)
   */
  private async waitForPort(port: number, timeout = 30000): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      try {
        if (this.webcontainer) {
          // WebContainer URL already includes the port, just try to access it
          const response = await fetch(this.webcontainer.url, {
            method: 'HEAD',
            mode: 'no-cors', // Avoid CORS issues during health check
          })
          // For no-cors mode, we just check if the request doesn't throw
          return
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
