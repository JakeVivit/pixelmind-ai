// Ant Design specific prompt utilities and templates

export interface AntdComponentInfo {
  name: string
  category: 'general' | 'layout' | 'navigation' | 'data-entry' | 'data-display' | 'feedback' | 'other'
  description: string
  props: string[]
  examples: string[]
}

// Common Ant Design components and their usage patterns
export const ANTD_COMPONENTS: Record<string, AntdComponentInfo> = {
  Button: {
    name: 'Button',
    category: 'general',
    description: 'A button component for triggering actions',
    props: ['type', 'size', 'shape', 'icon', 'loading', 'disabled', 'onClick'],
    examples: [
      '<Button type="primary">Primary Button</Button>',
      '<Button type="default" icon={<SearchOutlined />}>Search</Button>',
      '<Button type="link" size="small">Link Button</Button>'
    ]
  },
  Input: {
    name: 'Input',
    category: 'data-entry',
    description: 'A basic input field for text entry',
    props: ['placeholder', 'value', 'onChange', 'disabled', 'size', 'prefix', 'suffix'],
    examples: [
      '<Input placeholder="Enter text" />',
      '<Input prefix={<UserOutlined />} placeholder="Username" />',
      '<Input.Password placeholder="Password" />'
    ]
  },
  Form: {
    name: 'Form',
    category: 'data-entry',
    description: 'A form component for collecting user input',
    props: ['layout', 'onFinish', 'form', 'initialValues', 'validateTrigger'],
    examples: [
      '<Form layout="vertical" onFinish={handleSubmit}>',
      '<Form.Item name="username" label="Username" rules={[{ required: true }]}>',
      '<Form.Item><Button htmlType="submit">Submit</Button></Form.Item>'
    ]
  },
  Card: {
    name: 'Card',
    category: 'data-display',
    description: 'A container for displaying content',
    props: ['title', 'extra', 'cover', 'actions', 'bordered', 'hoverable'],
    examples: [
      '<Card title="Card Title">Card content</Card>',
      '<Card hoverable cover={<img src="..." />}>',
      '<Card actions={[<Button>Action</Button>]}>'
    ]
  },
  Table: {
    name: 'Table',
    category: 'data-display',
    description: 'A table component for displaying data',
    props: ['columns', 'dataSource', 'pagination', 'loading', 'rowKey', 'onRow'],
    examples: [
      '<Table columns={columns} dataSource={data} />',
      '<Table pagination={{ pageSize: 10 }} />',
      '<Table loading={loading} />'
    ]
  },
  Modal: {
    name: 'Modal',
    category: 'feedback',
    description: 'A modal dialog component',
    props: ['visible', 'title', 'onOk', 'onCancel', 'footer', 'width'],
    examples: [
      '<Modal visible={visible} title="Modal Title" onOk={handleOk} onCancel={handleCancel}>',
      '<Modal footer={null}>Custom footer</Modal>',
      '<Modal width={800}>'
    ]
  },
  Layout: {
    name: 'Layout',
    category: 'layout',
    description: 'Layout components for page structure',
    props: ['style', 'className'],
    examples: [
      '<Layout><Header /><Content /><Footer /></Layout>',
      '<Layout.Sider width={200}>Sidebar</Layout.Sider>',
      '<Layout.Content style={{ padding: 24 }}>'
    ]
  },
  Menu: {
    name: 'Menu',
    category: 'navigation',
    description: 'A navigation menu component',
    props: ['mode', 'theme', 'selectedKeys', 'onClick', 'items'],
    examples: [
      '<Menu mode="horizontal" selectedKeys={[selectedKey]}>',
      '<Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>',
      '<Menu.SubMenu title="Submenu">'
    ]
  }
}

// Generate component-specific prompts
export function generateAntdComponentPrompt(componentName: string, userIntent: string): string {
  const component = ANTD_COMPONENTS[componentName]
  
  if (!component) {
    return `Create a ${componentName} component using Ant Design based on: ${userIntent}`
  }

  return `Create a React component using Ant Design's ${component.name} component.

**Component Info:**
- Category: ${component.category}
- Description: ${component.description}
- Common Props: ${component.props.join(', ')}

**User Requirements:**
${userIntent}

**Examples for reference:**
${component.examples.map(example => `- ${example}`).join('\n')}

Please generate a complete React component with TypeScript that uses the ${component.name} component appropriately.`
}

// Ant Design layout patterns
export const ANTD_LAYOUT_PATTERNS = {
  'basic-layout': `
<Layout style={{ minHeight: '100vh' }}>
  <Header style={{ background: '#fff', padding: '0 24px' }}>
    Header Content
  </Header>
  <Content style={{ padding: '24px' }}>
    Main Content
  </Content>
  <Footer style={{ textAlign: 'center' }}>
    Footer Content
  </Footer>
</Layout>`,

  'sidebar-layout': `
<Layout style={{ minHeight: '100vh' }}>
  <Sider width={200} style={{ background: '#fff' }}>
    <Menu mode="inline" style={{ height: '100%' }}>
      <Menu.Item key="1">Menu Item 1</Menu.Item>
      <Menu.Item key="2">Menu Item 2</Menu.Item>
    </Menu>
  </Sider>
  <Layout>
    <Header style={{ background: '#fff', padding: '0 24px' }}>
      Header Content
    </Header>
    <Content style={{ padding: '24px' }}>
      Main Content
    </Content>
  </Layout>
</Layout>`,

  'top-sidebar-layout': `
<Layout style={{ minHeight: '100vh' }}>
  <Header style={{ background: '#fff' }}>
    <Menu mode="horizontal">
      <Menu.Item key="1">Nav 1</Menu.Item>
      <Menu.Item key="2">Nav 2</Menu.Item>
    </Menu>
  </Header>
  <Layout>
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu mode="inline" style={{ height: '100%' }}>
        <Menu.Item key="1">Menu Item 1</Menu.Item>
        <Menu.Item key="2">Menu Item 2</Menu.Item>
      </Menu>
    </Sider>
    <Content style={{ padding: '24px' }}>
      Main Content
    </Content>
  </Layout>
</Layout>`
}

// Common Ant Design form patterns
export const ANTD_FORM_PATTERNS = {
  'basic-form': `
<Form layout="vertical" onFinish={onFinish}>
  <Form.Item
    name="field1"
    label="Field Label"
    rules={[{ required: true, message: 'Please input field!' }]}
  >
    <Input placeholder="Enter value" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>`,

  'horizontal-form': `
<Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onFinish}>
  <Form.Item
    name="field1"
    label="Field Label"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>
  <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>`,

  'inline-form': `
<Form layout="inline" onFinish={onFinish}>
  <Form.Item name="field1" rules={[{ required: true }]}>
    <Input placeholder="Field 1" />
  </Form.Item>
  <Form.Item name="field2" rules={[{ required: true }]}>
    <Input placeholder="Field 2" />
  </Form.Item>
  <Form.Item>
    <Button type="primary" htmlType="submit">
      Submit
    </Button>
  </Form.Item>
</Form>`
}
