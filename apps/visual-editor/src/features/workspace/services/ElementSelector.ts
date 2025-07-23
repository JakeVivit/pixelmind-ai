import { WebContainerService } from '../../../core/webcontainer/WebContainerService'

export interface SelectedElement {
  tagName: string
  className: string
  id?: string
}

export interface ElementSelectorState {
  isSelecting: boolean
  selectedElement: SelectedElement | null
  hoveredElement: SelectedElement | null
}

export class ElementSelector {
  private static instance: ElementSelector | null = null
  private iframe: HTMLIFrameElement | null = null
  private state: ElementSelectorState = {
    isSelecting: false,
    selectedElement: null,
    hoveredElement: null,
  }
  private listeners: Set<(state: ElementSelectorState) => void> = new Set()

  static getInstance(): ElementSelector {
    if (!ElementSelector.instance) {
      ElementSelector.instance = new ElementSelector()
    }
    return ElementSelector.instance
  }

  initialize(iframe: HTMLIFrameElement): void {
    console.log('ElementSelector: 初始化')
    this.iframe = iframe
    this.setupMessageListener()
    this.injectScript()

    // 尝试修复项目文件
    this.fixProjectFiles()
  }

  private setupMessageListener(): void {
    window.addEventListener('message', event => {
      if (!this.iframe || event.source !== this.iframe.contentWindow) return

      const { type, data } = event.data
      switch (type) {
        case 'ELEMENT_SELECTED':
          this.updateState({ selectedElement: data, isSelecting: false })
          break
        case 'SELECTOR_READY':
          console.log('✅ 选择器就绪')
          break
        case 'SIMPLE_TEST_OK':
          console.log('✅ iframe 简单测试成功')
          break
        case 'PONG':
          console.log('✅ iframe PING-PONG 测试成功:', data)
          break
        case 'PATCH_APPLIED':
          console.log('✅ iframe 补丁应用成功')
          break
        default:
          if (type) {
            console.log('ElementSelector: 收到未知消息类型:', type, data)
          }
          break
      }
    })
  }

  private injectScript(): void {
    if (!this.iframe?.contentWindow) {
      console.error('ElementSelector: iframe.contentWindow 不存在')
      return
    }

    // 检查 iframe 状态
    console.log('ElementSelector: iframe 状态检查', {
      src: this.iframe.src,
      readyState: this.iframe.contentDocument?.readyState,
      hasContentWindow: !!this.iframe.contentWindow,
    })

    // 先尝试修复现有项目的消息监听
    this.patchExistingProject()

    setTimeout(() => {
      console.log('ElementSelector: 注入脚本')

      const script = `
        (function() {
          console.log('PixelMind: 脚本开始执行');

          if (window.__selector) {
            console.log('PixelMind: 选择器已存在，跳过');
            return;
          }

          console.log('PixelMind: 初始化选择器');
          window.__selector = true;

          let selecting = false;
          let overlay = null;

          function createOverlay() {
            overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.border = '2px solid blue';
            overlay.style.background = 'rgba(0,0,255,0.1)';
            overlay.style.zIndex = '999999';
            overlay.style.pointerEvents = 'none';
            document.body.appendChild(overlay);
          }

          function updateOverlay(el) {
            if (!overlay) return;
            const rect = el.getBoundingClientRect();
            overlay.style.left = rect.left + 'px';
            overlay.style.top = rect.top + 'px';
            overlay.style.width = rect.width + 'px';
            overlay.style.height = rect.height + 'px';
          }

          function handleMove(e) {
            if (!selecting) return;
            updateOverlay(e.target);
          }

          function handleClick(e) {
            if (!selecting) return;
            e.preventDefault();
            e.stopPropagation();

            const el = e.target;
            el.style.outline = '2px solid red';

            // 收集完整的元素信息
            const rect = el.getBoundingClientRect();
            const elementInfo = {
              tagName: el.tagName,
              className: el.className,
              id: el.id || undefined,
              textContent: el.textContent?.trim().substring(0, 100) || '',
              boundingRect: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left
              },
              attributes: Array.from(el.attributes).reduce((acc, attr) => {
                acc[attr.name] = attr.value;
                return acc;
              }, {})
            };

            window.parent.postMessage({
              type: 'ELEMENT_SELECTED',
              data: elementInfo
            }, '*');

            stopSelecting();
          }

          function startSelecting() {
            selecting = true;
            createOverlay();
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('click', handleClick, true);
            document.body.style.cursor = 'crosshair';
          }

          function stopSelecting() {
            selecting = false;
            if (overlay) overlay.remove();
            overlay = null;
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('click', handleClick, true);
            document.body.style.cursor = '';
          }

          window.addEventListener('message', function(e) {
            console.log('PixelMind: 收到消息', e.data?.type, e.data);

            if (e.data?.type === 'START_SELECTING') {
              console.log('PixelMind: 开始选择模式');
              startSelecting();
            }
            if (e.data?.type === 'STOP_SELECTING') {
              console.log('PixelMind: 停止选择模式');
              stopSelecting();
            }
            if (e.data?.type === 'TEST_PING') {
              console.log('PixelMind: 收到测试 PING:', e.data.data);
            }
          });

          console.log('PixelMind: 向父窗口发送 SELECTOR_READY 消息');
          window.parent.postMessage({ type: 'SELECTOR_READY' }, '*');
          console.log('PixelMind: 选择器初始化完成');
        })();
      `

      console.log('ElementSelector: 发送脚本到 iframe，长度:', script.length)

      // 尝试多种方式发送脚本
      this.iframe.contentWindow.postMessage({ type: 'EVAL', script }, '*')
      this.iframe.contentWindow.postMessage({ type: 'INJECT_SCRIPT', script }, '*')
      this.iframe.contentWindow.postMessage({ type: 'EXECUTE_SCRIPT', script }, '*')

      // 发送一个简单的测试消息
      setTimeout(() => {
        console.log('ElementSelector: 发送测试 PING 消息')
        this.iframe.contentWindow.postMessage({ type: 'TEST_PING', data: 'Hello from parent' }, '*')

        // 尝试直接在 iframe 中执行一个简单的测试
        try {
          this.iframe.contentWindow.postMessage(
            {
              type: 'EVAL_SIMPLE',
              script:
                'console.log("PixelMind: 简单测试成功"); window.parent.postMessage({type: "SIMPLE_TEST_OK"}, "*");',
            },
            '*'
          )
        } catch (e) {
          console.error('发送简单测试失败:', e)
        }
      }, 1000)

      try {
        const s = this.iframe.contentDocument.createElement('script')
        s.textContent = script
        this.iframe.contentDocument.head.appendChild(s)
        console.log('ElementSelector: 直接 DOM 注入成功')
      } catch (e) {
        console.log('ElementSelector: 跨域，使用 postMessage 通信')
      }
    }, 2000)
  }

  /**
   * 修复现有项目的消息监听
   */
  private patchExistingProject(): void {
    if (!this.iframe?.contentWindow) return

    console.log('ElementSelector: 尝试修复现有项目的消息监听')

    // 发送修复脚本
    const patchScript = `
      if (!window.__pixelmindPatched) {
        console.log('PixelMind: 应用消息监听补丁');

        window.addEventListener('message', function(event) {
          console.log('PixelMind: [补丁] 收到消息', event.data?.type);

          if (event.data?.type === 'EVAL' || event.data?.type === 'INJECT_SCRIPT' || event.data?.type === 'EXECUTE_SCRIPT') {
            try {
              console.log('PixelMind: [补丁] 执行脚本');
              eval(event.data.script);
            } catch (error) {
              console.error('PixelMind: [补丁] 脚本执行失败', error);
            }
          }

          if (event.data?.type === 'TEST_PING') {
            console.log('PixelMind: [补丁] 收到 PING 测试:', event.data.data);
            window.parent.postMessage({ type: 'PONG', data: 'Hello from patched WebContainer' }, '*');
          }
        });

        window.__pixelmindPatched = true;
        console.log('PixelMind: 补丁应用成功');
        window.parent.postMessage({ type: 'PATCH_APPLIED' }, '*');
      }
    `

    this.iframe.contentWindow.postMessage(
      {
        type: 'EVAL',
        script: patchScript,
      },
      '*'
    )
  }

  startSelecting(): void {
    if (!this.iframe?.contentWindow) return
    this.updateState({ isSelecting: true })
    this.iframe.contentWindow.postMessage({ type: 'START_SELECTING' }, '*')
  }

  stopSelecting(): void {
    if (!this.iframe?.contentWindow) return
    this.updateState({ isSelecting: false })
    this.iframe.contentWindow.postMessage({ type: 'STOP_SELECTING' }, '*')
  }

  getState(): ElementSelectorState {
    return { ...this.state }
  }

  /**
   * 手动修复项目文件（公共方法）
   */
  async manualFixProjectFiles(): Promise<void> {
    return this.fixProjectFiles()
  }

  subscribe(listener: (state: ElementSelectorState) => void): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => this.listeners.delete(listener)
  }

  private updateState(updates: Partial<ElementSelectorState>): void {
    this.state = { ...this.state, ...updates }
    this.listeners.forEach(listener => {
      try {
        listener(this.getState())
      } catch (error) {
        console.error('Listener error:', error)
      }
    })
  }

  /**
   * 修复项目文件，添加消息监听器
   */
  private async fixProjectFiles(): Promise<void> {
    try {
      console.log('ElementSelector: 尝试修复项目文件')

      // 获取 WebContainer 服务
      const webContainerService = WebContainerService.getInstance()

      // 检查 WebContainer 是否已初始化
      if (!webContainerService || !webContainerService.isReady()) {
        console.log('ElementSelector: WebContainer 未就绪，跳过文件修复')
        return
      }

      // 读取当前的 main.tsx 文件
      const currentMainTsx = await webContainerService.readFile('src/main.tsx')
      console.log('ElementSelector: 读取到 main.tsx 文件，长度:', currentMainTsx.length)

      // 检查是否已经包含消息监听器
      if (currentMainTsx.includes('PixelMind') || currentMainTsx.includes('__pixelmindPatched')) {
        console.log('ElementSelector: main.tsx 已包含消息监听器')
        return
      }

      // 生成带有消息监听器的新 main.tsx 内容
      const newMainTsx = this.generateFixedMainTsx(currentMainTsx)

      // 写入修复后的文件
      await webContainerService.writeFile('src/main.tsx', newMainTsx)
      console.log('ElementSelector: main.tsx 文件已修复')

      // 等待一段时间让文件重新加载
      setTimeout(() => {
        console.log('ElementSelector: 文件修复完成，重新尝试注入脚本')
        this.injectScript()
      }, 2000)
    } catch (error) {
      console.error('ElementSelector: 修复项目文件失败:', error)
    }
  }

  /**
   * 生成修复后的 main.tsx 内容
   */
  private generateFixedMainTsx(originalContent: string): string {
    // 在 import 语句后添加消息监听器
    const messageListenerCode = `
// PixelMind 元素选择器支持
if (typeof window !== 'undefined') {
  console.log('PixelMind: 设置消息监听器 (文件修复版)')

  window.addEventListener('message', function(event) {
    console.log('PixelMind: 收到消息', event.data?.type)

    if (event.data?.type === 'EVAL' || event.data?.type === 'INJECT_SCRIPT' || event.data?.type === 'EXECUTE_SCRIPT') {
      try {
        console.log('PixelMind: 执行脚本', event.data.script?.substring(0, 100) + '...')
        eval(event.data.script)
      } catch (error) {
        console.error('PixelMind: 脚本执行失败', error)
      }
    }

    if (event.data?.type === 'EVAL_SIMPLE') {
      try {
        console.log('PixelMind: 执行简单脚本')
        eval(event.data.script)
      } catch (error) {
        console.error('PixelMind: 简单脚本执行失败', error)
      }
    }

    if (event.data?.type === 'TEST_PING') {
      console.log('PixelMind: 收到 PING 测试:', event.data.data)
      window.parent.postMessage({ type: 'PONG', data: 'Hello from fixed WebContainer' }, '*')
    }
  })

  console.log('PixelMind: 消息监听器已设置 (文件修复版)')
}
`

    // 找到最后一个 import 语句的位置
    const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm
    let lastImportIndex = 0
    let match

    while ((match = importRegex.exec(originalContent)) !== null) {
      lastImportIndex = match.index + match[0].length
    }

    // 在最后一个 import 语句后插入消息监听器代码
    const beforeImports = originalContent.substring(0, lastImportIndex)
    const afterImports = originalContent.substring(lastImportIndex)

    return beforeImports + '\n' + messageListenerCode + '\n' + afterImports
  }
}
