import React, { useState } from 'react'
import {
  Button,
  Input,
  Card,
  Table,
  Menu,
  Modal,
  Drawer,
  Tabs,
  Select,
  DatePicker,
  Switch,
  Slider,
  Rate,
  Progress,
  Tag,
  Alert,
  notification,
  Space,
  Divider,
} from 'antd'
import { ThemeToggle } from '../../../components/ThemeToggle'
import { useTheme } from '../../../hooks/useTheme'

const { TextArea } = Input
const { Option } = Select

/**
 * Ant Design 主题测试组件
 * 用于验证各种 Ant Design 组件在主题切换时的表现
 */
export const AntdThemeTest: React.FC = () => {
  const { isDark } = useTheme()
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  const data = [
    {
      key: '1',
      name: '张三',
      age: 32,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 28,
      address: '上海市浦东新区',
    },
  ]

  const menuItems = [
    {
      key: '1',
      label: '菜单项 1',
    },
    {
      key: '2',
      label: '菜单项 2',
    },
    {
      key: '3',
      label: '菜单项 3',
    },
  ]

  const showNotification = () => {
    notification.info({
      message: '通知标题',
      description: '这是一个测试通知，用于验证主题切换效果。',
      placement: 'topRight',
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ant Design 主题测试</h1>
        <ThemeToggle />
      </div>

      <Alert
        message="主题测试"
        description={`当前主题模式: ${isDark ? '暗黑模式' : '明亮模式'}`}
        type="info"
        showIcon
      />

      {/* 基础组件 */}
      <Card title="基础组件" className="mb-6">
        <Space wrap>
          <Button type="primary">主要按钮</Button>
          <Button>默认按钮</Button>
          <Button type="dashed">虚线按钮</Button>
          <Button type="text">文本按钮</Button>
          <Button type="link">链接按钮</Button>
          <Button danger>危险按钮</Button>
        </Space>

        <Divider />

        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="请输入内容" />
          <TextArea placeholder="请输入多行内容" rows={3} />
          <Select placeholder="请选择" style={{ width: 200 }}>
            <Option value="option1">选项 1</Option>
            <Option value="option2">选项 2</Option>
            <Option value="option3">选项 3</Option>
          </Select>
          <DatePicker placeholder="请选择日期" />
        </Space>
      </Card>

      {/* 数据展示 */}
      <Card title="数据展示" className="mb-6">
        <Table columns={columns} dataSource={data} pagination={false} />

        <Divider />

        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <span>评分: </span>
            <Rate defaultValue={3} />
          </div>
          <div>
            <span>进度: </span>
            <Progress percent={60} />
          </div>
          <div>
            <span>滑块: </span>
            <Slider defaultValue={30} style={{ width: 200 }} />
          </div>
          <div>
            <span>开关: </span>
            <Switch defaultChecked />
          </div>
        </Space>

        <Divider />

        <Space wrap>
          <Tag color="blue">蓝色标签</Tag>
          <Tag color="green">绿色标签</Tag>
          <Tag color="orange">橙色标签</Tag>
          <Tag color="red">红色标签</Tag>
        </Space>
      </Card>

      {/* 导航组件 */}
      <Card title="导航组件" className="mb-6">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: '标签页 1',
              children: <p>标签页 1 的内容</p>,
            },
            {
              key: '2',
              label: '标签页 2',
              children: <p>标签页 2 的内容</p>,
            },
            {
              key: '3',
              label: '标签页 3',
              children: <p>标签页 3 的内容</p>,
            },
          ]}
        />

        <Divider />

        <Menu mode="horizontal" items={menuItems} />
      </Card>

      {/* 反馈组件 */}
      <Card title="反馈组件" className="mb-6">
        <Space>
          <Button onClick={() => setModalVisible(true)}>打开模态框</Button>
          <Button onClick={() => setDrawerVisible(true)}>打开抽屉</Button>
          <Button onClick={showNotification}>显示通知</Button>
        </Space>
      </Card>

      {/* 模态框 */}
      <Modal
        title="测试模态框"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
      >
        <p>这是一个测试模态框，用于验证主题切换效果。</p>
        <p>当前主题: {isDark ? '暗黑模式' : '明亮模式'}</p>
      </Modal>

      {/* 抽屉 */}
      <Drawer
        title="测试抽屉"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <p>这是一个测试抽屉，用于验证主题切换效果。</p>
        <p>当前主题: {isDark ? '暗黑模式' : '明亮模式'}</p>
      </Drawer>
    </div>
  )
}
