import type { CreateProjectData, Project, ProjectIndex } from '../types/project'
import { FileSystemService } from './FileSystemService'
import { PromptGenerator } from './PromptGenerator'
import { AIChatService } from './AIChatService'
import { PROJECT_CONFIG } from '../utils/constants'
import { generateProjectFiles } from '@pixelmind/shared'

export class ProjectManager {
  private static instance: ProjectManager | null = null
  private baseDirectoryHandle: FileSystemDirectoryHandle | null = null
  private projectsIndex: ProjectIndex | null = null
  private baseDirectoryPath: string | null = null

  private constructor() {
    // 尝试从本地存储恢复基础目录路径
    this.loadBaseDirectoryFromStorage()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ProjectManager {
    if (!ProjectManager.instance) {
      ProjectManager.instance = new ProjectManager()
    }
    return ProjectManager.instance
  }

  /**
   * 从本地存储加载基础目录路径
   */
  private loadBaseDirectoryFromStorage(): void {
    try {
      const storedPath = localStorage.getItem('pixelmind-base-directory')
      if (storedPath) {
        this.baseDirectoryPath = storedPath
      }
    } catch (error) {
      console.warn('加载基础目录路径失败:', error)
    }
  }

  /**
   * 保存基础目录路径到本地存储
   */
  private saveBaseDirectoryToStorage(path: string): void {
    try {
      localStorage.setItem('pixelmind-base-directory', path)
      this.baseDirectoryPath = path
    } catch (error) {
      console.warn('保存基础目录路径失败:', error)
    }
  }

  /**
   * 检查是否已设置基础目录
   */
  hasBaseDirectory(): boolean {
    return this.baseDirectoryHandle !== null || this.baseDirectoryPath !== null
  }

  /**
   * 检查是否有文件系统访问权限
   */
  hasFileSystemAccess(): boolean {
    return this.baseDirectoryHandle !== null
  }

  /**
   * 获取基础目录名称
   */
  getBaseDirectoryName(): string | null {
    return this.baseDirectoryHandle?.name || null
  }

  /**
   * 获取基础目录完整路径
   */
  getBaseDirectoryPath(): string | null {
    return this.baseDirectoryPath
  }

  /**
   * 获取基础目录句柄
   */
  getBaseDirectoryHandle(): FileSystemDirectoryHandle | null {
    return this.baseDirectoryHandle
  }

  /**
   * 获取项目文件内容
   */
  async getProjectFiles(projectId: string): Promise<Record<string, string>> {
    if (!this.baseDirectoryHandle) {
      throw new Error('基础目录未设置')
    }

    try {
      // 根据项目 ID 找到项目信息
      const projects = await this.getProjects()
      const project = projects.find(p => p.id === projectId)

      if (!project) {
        throw new Error('项目未找到')
      }

      // 获取项目目录
      const projectDir = await this.baseDirectoryHandle.getDirectoryHandle(project.path)

      // 递归读取所有文件
      const files: Record<string, string> = {}
      await this.readDirectoryRecursively(projectDir, '', files)

      return files
    } catch (error) {
      console.error('读取项目文件失败:', error)
      throw error
    }
  }

  /**
   * 递归读取目录中的所有文件
   */
  private async readDirectoryRecursively(
    dirHandle: FileSystemDirectoryHandle,
    basePath: string,
    files: Record<string, string>
  ): Promise<void> {
    for await (const [name, handle] of dirHandle.entries()) {
      const fullPath = basePath ? `${basePath}/${name}` : name

      if (handle.kind === 'file') {
        try {
          const fileHandle = handle as FileSystemFileHandle
          const file = await fileHandle.getFile()
          const content = await file.text()
          files[fullPath] = content
        } catch (error) {
          console.warn(`读取文件失败 ${fullPath}:`, error)
        }
      } else if (handle.kind === 'directory') {
        // 跳过 node_modules 和其他不需要的目录
        if (!this.shouldSkipDirectory(name)) {
          const dirHandle = handle as FileSystemDirectoryHandle
          await this.readDirectoryRecursively(dirHandle, fullPath, files)
        }
      }
    }
  }

  /**
   * 判断是否应该跳过某个目录
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.next',
      '.nuxt',
      'coverage',
      '.nyc_output',
      '.cache',
    ]
    return skipDirs.includes(dirName)
  }

  /**
   * 重新请求目录访问权限（用于页面刷新后恢复）
   */
  async requestDirectoryAccess(): Promise<boolean> {
    if (this.baseDirectoryHandle) {
      return true // 已经有访问权限
    }

    if (!this.baseDirectoryPath) {
      return false // 没有保存的路径
    }

    try {
      console.log('尝试重新获取目录访问权限...')
      const dirHandle = await FileSystemService.selectDirectory()
      if (!dirHandle) return false

      // 验证目录权限
      const hasPermission = await FileSystemService.verifyPermissions(dirHandle)
      if (!hasPermission) {
        throw new Error('没有目录写入权限')
      }

      this.baseDirectoryHandle = dirHandle
      await this.loadOrCreateIndex()

      console.log('目录访问权限恢复成功')
      return true
    } catch (error) {
      console.error('重新获取目录访问权限失败:', error)
      return false
    }
  }

  /**
   * 设置基础目录（只能设置一次）
   */
  async setBaseDirectory(
    forceReselect: boolean = false
  ): Promise<{ success: boolean; path?: string }> {
    if (this.baseDirectoryHandle && !forceReselect) {
      return {
        success: true,
        path: this.baseDirectoryPath || this.baseDirectoryHandle.name,
      }
    }

    // 如果有保存的路径但没有 handle，尝试重新获取访问权限
    if (this.baseDirectoryPath && !this.baseDirectoryHandle && !forceReselect) {
      const restored = await this.requestDirectoryAccess()
      if (restored) {
        return { success: true, path: this.baseDirectoryPath }
      }
    }

    try {
      const dirHandle = await FileSystemService.selectDirectory()
      if (!dirHandle) return { success: false }

      // 验证目录权限
      const hasPermission = await FileSystemService.verifyPermissions(dirHandle)
      if (!hasPermission) {
        throw new Error('没有目录写入权限')
      }

      this.baseDirectoryHandle = dirHandle

      // 尝试获取完整路径（如果浏览器支持）
      let fullPath = dirHandle.name
      try {
        // 某些浏览器可能支持获取完整路径
        if ('getDirectoryHandle' in navigator && 'resolve' in dirHandle) {
          // 这是一个实验性功能，可能不被所有浏览器支持
          fullPath = dirHandle.name
        }
      } catch {
        // 如果获取完整路径失败，使用目录名
        fullPath = dirHandle.name
      }

      this.saveBaseDirectoryToStorage(fullPath)
      await this.loadOrCreateIndex()

      return { success: true, path: fullPath }
    } catch (error) {
      console.error('设置基础目录失败:', error)
      throw error
    }
  }

  /**
   * 加载或创建项目索引
   */
  private async loadOrCreateIndex(): Promise<void> {
    if (!this.baseDirectoryHandle) {
      throw new Error('基础目录未设置')
    }

    try {
      const pixelmindDir = await FileSystemService.getOrCreatePixelMindDir(this.baseDirectoryHandle)

      let indexContent = ''
      const indexExists = await FileSystemService.fileExists(
        pixelmindDir,
        PROJECT_CONFIG.PROJECTS_INDEX_FILE
      )

      if (indexExists) {
        indexContent = await FileSystemService.readFile(
          pixelmindDir,
          PROJECT_CONFIG.PROJECTS_INDEX_FILE
        )
      }

      if (indexContent.trim()) {
        this.projectsIndex = JSON.parse(indexContent)
      } else {
        this.projectsIndex = {
          version: PROJECT_CONFIG.INDEX_VERSION,
          baseDirectory: this.baseDirectoryHandle.name,
          lastScan: new Date().toISOString(),
          projects: [],
        }
        await this.saveIndex()
      }
    } catch (error) {
      console.error('加载项目索引失败:', error)
      throw error
    }
  }

  /**
   * 保存项目索引
   */
  private async saveIndex(): Promise<void> {
    if (!this.baseDirectoryHandle || !this.projectsIndex) {
      throw new Error('基础目录或索引未初始化')
    }

    try {
      const pixelmindDir = await FileSystemService.getOrCreatePixelMindDir(this.baseDirectoryHandle)

      this.projectsIndex.lastScan = new Date().toISOString()

      await FileSystemService.writeFile(
        pixelmindDir,
        PROJECT_CONFIG.PROJECTS_INDEX_FILE,
        JSON.stringify(this.projectsIndex, null, 2)
      )
    } catch (error) {
      console.error('保存项目索引失败:', error)
      throw error
    }
  }

  /**
   * 创建新项目
   */
  async createProject(projectData: CreateProjectData): Promise<Project> {
    if (!this.baseDirectoryHandle || !this.projectsIndex) {
      throw new Error('基础目录未设置')
    }

    try {
      // 检查项目名称是否已存在
      const existingProject = this.projectsIndex.projects.find(p => p.name === projectData.name)
      if (existingProject) {
        throw new Error(`项目 "${projectData.name}" 已存在`)
      }

      // 创建项目目录
      const projectDir = await FileSystemService.createDirectory(
        this.baseDirectoryHandle,
        projectData.name
      )

      // 生成提示词文件
      const promptData = PromptGenerator.generatePromptFile(projectData)
      await FileSystemService.writeFile(
        projectDir,
        PROJECT_CONFIG.PROMPT_FILE_NAME,
        promptData.content
      )

      // 生成项目说明文档
      const readmeContent = AIChatService.generateProjectReadme(projectData)
      await FileSystemService.writeFile(projectDir, 'README.md', readmeContent)

      // 调用 AIChat 创建项目文件
      const projectPath = `${this.baseDirectoryPath || this.baseDirectoryHandle.name}/${projectData.name}`
      console.log('开始调用 AIChat 生成项目文件...')
      console.log('项目路径:', projectPath)
      console.log('项目数据:', projectData)

      const aichatResult = await AIChatService.createProject(projectData, projectPath, message => {
        console.log('AIChat 进度:', message)
      })

      if (aichatResult.success && aichatResult.generatedFiles) {
        console.log('AIChat 生成成功，开始写入文件...')

        // 将生成的文件写入到项目目录
        for (const [fileName, content] of Object.entries(aichatResult.generatedFiles)) {
          try {
            // 处理嵌套目录
            const fileParts = fileName.split('/')
            let currentDir = projectDir

            // 创建嵌套目录
            for (let i = 0; i < fileParts.length - 1; i++) {
              currentDir = await FileSystemService.createDirectory(currentDir, fileParts[i])
            }

            // 写入文件
            const actualFileName = fileParts[fileParts.length - 1]
            await FileSystemService.writeFile(currentDir, actualFileName, content)
            console.log(`文件已创建: ${fileName}`)
          } catch (error) {
            console.warn(`创建文件失败 ${fileName}:`, error)
          }
        }

        console.log('所有文件创建完成')
      } else {
        console.warn('AIChat 生成失败，使用基础模板创建完整项目:', aichatResult.error)

        // 使用基础模板生成完整的 React+Vite 项目
        const templateFiles = generateProjectFiles(
          projectData.name,
          projectData.description,
          projectData.uiLibrary,
          projectData.features || []
        )

        console.log(`使用基础模板生成 ${Object.keys(templateFiles).length} 个文件`)

        // 写入所有模板文件
        for (const [filePath, content] of Object.entries(templateFiles)) {
          try {
            // 处理嵌套目录
            const fileParts = filePath.split('/')
            let currentDir = projectDir

            // 创建嵌套目录
            for (let i = 0; i < fileParts.length - 1; i++) {
              currentDir = await FileSystemService.createDirectory(currentDir, fileParts[i])
            }

            // 写入文件
            const actualFileName = fileParts[fileParts.length - 1]
            await FileSystemService.writeFile(currentDir, actualFileName, content)
            console.log(`模板文件已创建: ${filePath}`)
          } catch (error) {
            console.warn(`创建模板文件失败 ${filePath}:`, error)
          }
        }

        // 额外创建项目信息文件用于记录
        try {
          const projectInfo = {
            name: projectData.name,
            description: projectData.description,
            uiLibrary: projectData.uiLibrary,
            createdAt: new Date().toISOString(),
            generator: 'AIChat + PixelMind AI',
          }
          await FileSystemService.writeFile(
            projectDir,
            'pixelmind-project.json',
            JSON.stringify(projectInfo, null, 2)
          )
          console.log('项目信息文件已创建')
        } catch (error) {
          console.warn('创建项目信息文件失败:', error)
        }

        console.log('基础模板项目创建完成')
      }

      // 更新索引
      const indexProject = {
        id: promptData.metadata.id,
        name: projectData.name,
        path: projectData.name,
        createdAt: promptData.metadata.createdAt,
        lastModified: promptData.metadata.lastModified,
      }

      this.projectsIndex.projects.push(indexProject)
      await this.saveIndex()

      // 返回完整的项目信息
      const project: Project = {
        ...promptData.metadata,
        path: projectData.name,
        status: 'active',
      }

      return project
    } catch (error) {
      console.error('创建项目失败:', error)
      throw error
    }
  }

  /**
   * 获取项目列表
   */
  async getProjects(): Promise<Project[]> {
    if (!this.baseDirectoryHandle || !this.projectsIndex) {
      return []
    }

    const projects: Project[] = []
    const validProjects: typeof this.projectsIndex.projects = []

    for (const indexProject of this.projectsIndex.projects) {
      try {
        const isValid = await FileSystemService.isValidProjectDirectory(
          this.baseDirectoryHandle,
          indexProject.path
        )

        if (isValid) {
          const projectDir = await this.baseDirectoryHandle.getDirectoryHandle(indexProject.path)
          const promptContent = await FileSystemService.readFile(
            projectDir,
            PROJECT_CONFIG.PROMPT_FILE_NAME
          )

          const metadata = PromptGenerator.parsePromptFile(promptContent)
          if (metadata) {
            const project: Project = {
              ...metadata,
              path: indexProject.path,
              status: 'active',
            }
            projects.push(project)
            validProjects.push(indexProject)
          }
        }
      } catch (error) {
        console.warn(`项目 ${indexProject.name} 读取失败:`, error)
        // 项目标记为缺失，但保留在索引中
        const project: Project = {
          id: indexProject.id,
          name: indexProject.name,
          description: '项目文件缺失',
          uiLibrary: 'unknown',
          template: 'unknown',
          path: indexProject.path,
          createdAt: indexProject.createdAt,
          lastModified: indexProject.lastModified,
          status: 'missing',
        }
        projects.push(project)
      }
    }

    // 如果有无效项目被清理，更新索引
    if (validProjects.length !== this.projectsIndex.projects.length) {
      this.projectsIndex.projects = validProjects
      await this.saveIndex()
    }

    return projects
  }

  /**
   * 扫描目录，发现新项目
   */
  async scanForNewProjects(): Promise<Project[]> {
    if (!this.baseDirectoryHandle || !this.projectsIndex) {
      return []
    }

    try {
      const directories = await FileSystemService.listDirectories(this.baseDirectoryHandle)
      const newProjects: Project[] = []

      for (const dirName of directories) {
        // 跳过已知项目和系统目录
        if (
          dirName === PROJECT_CONFIG.PIXELMIND_DIR ||
          this.projectsIndex.projects.some(p => p.path === dirName)
        ) {
          continue
        }

        // 检查是否是有效的项目目录
        const isValid = await FileSystemService.isValidProjectDirectory(
          this.baseDirectoryHandle,
          dirName
        )

        if (isValid) {
          try {
            const projectDir = await this.baseDirectoryHandle.getDirectoryHandle(dirName)
            const promptContent = await FileSystemService.readFile(
              projectDir,
              PROJECT_CONFIG.PROMPT_FILE_NAME
            )

            const metadata = PromptGenerator.parsePromptFile(promptContent)
            if (metadata) {
              // 添加到索引
              const indexProject = {
                id: metadata.id,
                name: metadata.name,
                path: dirName,
                createdAt: metadata.createdAt,
                lastModified: metadata.lastModified,
              }

              this.projectsIndex.projects.push(indexProject)

              const project: Project = {
                ...metadata,
                path: dirName,
                status: 'active',
              }
              newProjects.push(project)
            }
          } catch (error) {
            console.warn(`扫描项目 ${dirName} 失败:`, error)
          }
        }
      }

      if (newProjects.length > 0) {
        await this.saveIndex()
      }

      return newProjects
    } catch (error) {
      console.error('扫描新项目失败:', error)
      return []
    }
  }

  /**
   * 重置管理器（用于测试或重新初始化）
   */
  reset(): void {
    this.baseDirectoryHandle = null
    this.baseDirectoryPath = null
    this.projectsIndex = null
  }
}
