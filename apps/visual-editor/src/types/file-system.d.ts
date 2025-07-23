// File System Access API 类型定义
// 为了支持 TypeScript，添加必要的类型定义

interface FileSystemHandle {
  readonly kind: 'file' | 'directory'
  readonly name: string
  
  isSameEntry(other: FileSystemHandle): Promise<boolean>
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
  remove(options?: FileSystemRemoveOptions): Promise<void>
}

interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file'
  
  getFile(): Promise<File>
  createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  readonly kind: 'directory'
  
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>
  keys(): AsyncIterableIterator<string>
  values(): AsyncIterableIterator<FileSystemHandle>
  
  getDirectoryHandle(name: string, options?: FileSystemGetDirectoryOptions): Promise<FileSystemDirectoryHandle>
  getFileHandle(name: string, options?: FileSystemGetFileOptions): Promise<FileSystemFileHandle>
  removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>
  resolve(possibleDescendant: FileSystemHandle): Promise<string[] | null>
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: FileSystemWriteChunkType): Promise<void>
  seek(position: number): Promise<void>
  truncate(size: number): Promise<void>
}

interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite'
}

interface FileSystemGetFileOptions {
  create?: boolean
}

interface FileSystemGetDirectoryOptions {
  create?: boolean
}

interface FileSystemCreateWritableOptions {
  keepExistingData?: boolean
}

interface FileSystemRemoveOptions {
  recursive?: boolean
}

type FileSystemWriteChunkType = BufferSource | Blob | string | WriteParams

interface WriteParams {
  type: 'write' | 'seek' | 'truncate'
  data?: BufferSource | Blob | string
  position?: number
  size?: number
}

interface ShowDirectoryPickerOptions {
  id?: string
  mode?: 'read' | 'readwrite'
  startIn?: FileSystemHandle | string
}

interface ShowOpenFilePickerOptions {
  excludeAcceptAllOption?: boolean
  id?: string
  multiple?: boolean
  startIn?: FileSystemHandle | string
  types?: FilePickerAcceptType[]
}

interface ShowSaveFilePickerOptions {
  excludeAcceptAllOption?: boolean
  id?: string
  startIn?: FileSystemHandle | string
  suggestedName?: string
  types?: FilePickerAcceptType[]
}

interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string | string[]>
}

// 全局方法声明
declare global {
  interface Window {
    showDirectoryPicker(options?: ShowDirectoryPickerOptions): Promise<FileSystemDirectoryHandle>
    showOpenFilePicker(options?: ShowOpenFilePickerOptions): Promise<FileSystemFileHandle[]>
    showSaveFilePicker(options?: ShowSaveFilePickerOptions): Promise<FileSystemFileHandle>
  }
}
