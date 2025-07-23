import { PROJECT_CONFIG } from '../utils/constants'

export class FileSystemService {
  /**
   * 检查浏览器是否支持 File System Access API
   */
  static isSupported(): boolean {
    return 'showDirectoryPicker' in window
  }

  /**
   * 选择目录
   */
  static async selectDirectory(): Promise<FileSystemDirectoryHandle | null> {
    try {
      if (!this.isSupported()) {
        throw new Error('浏览器不支持 File System Access API')
      }

      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      })

      return dirHandle
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // 用户取消选择
        return null
      }
      console.error('选择目录失败:', error)
      throw error
    }
  }

  /**
   * 检查目录是否存在
   */
  static async directoryExists(
    parentHandle: FileSystemDirectoryHandle, 
    dirName: string
  ): Promise<boolean> {
    try {
      await parentHandle.getDirectoryHandle(dirName)
      return true
    } catch {
      return false
    }
  }

  /**
   * 检查文件是否存在
   */
  static async fileExists(
    dirHandle: FileSystemDirectoryHandle, 
    fileName: string
  ): Promise<boolean> {
    try {
      await dirHandle.getFileHandle(fileName)
      return true
    } catch {
      return false
    }
  }

  /**
   * 创建目录
   */
  static async createDirectory(
    parentHandle: FileSystemDirectoryHandle, 
    dirName: string
  ): Promise<FileSystemDirectoryHandle> {
    return await parentHandle.getDirectoryHandle(dirName, { create: true })
  }

  /**
   * 写入文件
   */
  static async writeFile(
    dirHandle: FileSystemDirectoryHandle,
    fileName: string,
    content: string
  ): Promise<void> {
    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
  }

  /**
   * 读取文件
   */
  static async readFile(
    dirHandle: FileSystemDirectoryHandle,
    fileName: string
  ): Promise<string> {
    const fileHandle = await dirHandle.getFileHandle(fileName)
    const file = await fileHandle.getFile()
    return await file.text()
  }

  /**
   * 获取或创建 .pixelmind 目录
   */
  static async getOrCreatePixelMindDir(
    baseHandle: FileSystemDirectoryHandle
  ): Promise<FileSystemDirectoryHandle> {
    return await this.createDirectory(baseHandle, PROJECT_CONFIG.PIXELMIND_DIR)
  }

  /**
   * 列出目录中的所有子目录
   */
  static async listDirectories(
    dirHandle: FileSystemDirectoryHandle
  ): Promise<string[]> {
    const directories: string[] = []
    
    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'directory' && !name.startsWith('.')) {
        directories.push(name)
      }
    }
    
    return directories
  }

  /**
   * 检查项目目录是否有效（包含提示词文件）
   */
  static async isValidProjectDirectory(
    baseHandle: FileSystemDirectoryHandle,
    projectName: string
  ): Promise<boolean> {
    try {
      const projectHandle = await baseHandle.getDirectoryHandle(projectName)
      return await this.fileExists(projectHandle, PROJECT_CONFIG.PROMPT_FILE_NAME)
    } catch {
      return false
    }
  }

  /**
   * 获取文件的最后修改时间
   */
  static async getFileLastModified(
    dirHandle: FileSystemDirectoryHandle,
    fileName: string
  ): Promise<Date | null> {
    try {
      const fileHandle = await dirHandle.getFileHandle(fileName)
      const file = await fileHandle.getFile()
      return new Date(file.lastModified)
    } catch {
      return null
    }
  }

  /**
   * 验证目录权限
   */
  static async verifyPermissions(
    dirHandle: FileSystemDirectoryHandle
  ): Promise<boolean> {
    try {
      // 尝试创建一个临时文件来测试写入权限
      const testFileName = '.pixelmind-test'
      await this.writeFile(dirHandle, testFileName, 'test')
      
      // 删除测试文件
      try {
        const testFileHandle = await dirHandle.getFileHandle(testFileName)
        await testFileHandle.remove()
      } catch {
        // 删除失败不影响权限验证结果
      }
      
      return true
    } catch {
      return false
    }
  }
}
