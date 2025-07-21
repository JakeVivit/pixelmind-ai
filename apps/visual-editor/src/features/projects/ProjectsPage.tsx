import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Space, Typography, Input, Dropdown, Tag, Empty, Modal, Form } from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  FolderOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { cn } from '../../utils/cn'

const { Title, Text, Paragraph } = Typography
const { Search } = Input

interface Project {
  id: string
  name: string
  description: string
  thumbnail: string
  createdAt: Date
  updatedAt: Date
  pageCount: number
  componentCount: number
  status: 'active' | 'archived'
  template: string
}

/**
 * 项目管理页面
 * 用户可以创建、管理和访问项目
 */
export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [form] = Form.useForm()

  // 模拟项目数据
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: '电商网站项目',
      description: '一个现代化的电商网站，包含商品展示、购物车、用户中心等功能',
      thumbnail: '🛒',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      pageCount: 8,
      componentCount: 24,
      status: 'active',
      template: 'ecommerce',
    },
    {
      id: '2',
      name: '企业官网',
      description: '企业品牌展示网站，包含公司介绍、产品展示、联系我们等页面',
      thumbnail: '🏢',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      pageCount: 5,
      componentCount: 15,
      status: 'active',
      template: 'corporate',
    },
    {
      id: '3',
      name: '个人博客',
      description: '个人技术博客网站，支持文章发布、分类管理、评论系统',
      thumbnail: '📝',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12'),
      pageCount: 6,
      componentCount: 18,
      status: 'archived',
      template: 'blog',
    },
  ])

  const filteredProjects = projects.filter(
    project =>
      project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      project.description.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleCreateProject = async () => {
    try {
      const values = await form.validateFields()
      const newProject: Project = {
        id: Date.now().toString(),
        name: values.name,
        description: values.description || '',
        thumbnail: '🆕',
        createdAt: new Date(),
        updatedAt: new Date(),
        pageCount: 0,
        componentCount: 0,
        status: 'active',
        template: values.template || 'blank',
      }
      setProjects(prev => [newProject, ...prev])
      setIsCreateModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('创建项目失败:', error)
    }
  }

  const handleProjectClick = (projectId: string) => {
    // 进入项目工作台
    navigate(`/projects/${projectId}/workspace`)
    console.log('进入项目:', projectId)
  }

  const getProjectMenuItems = (project: Project): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑项目',
    },
    {
      key: 'duplicate',
      icon: <CopyOutlined />,
      label: '复制项目',
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除项目',
      danger: true,
    },
  ]

  const handleProjectMenuClick = (key: string, project: Project) => {
    switch (key) {
      case 'edit':
        console.log('编辑项目:', project.id)
        break
      case 'duplicate':
        console.log('复制项目:', project.id)
        break
      case 'delete':
        setProjects(prev => prev.filter(p => p.id !== project.id))
        break
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={cn('min-h-screen p-6', 'bg-gray-50 dark:bg-gray-950')}>
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Title level={2} className="mb-2">
                我的项目
              </Title>
              <Text className="text-gray-600 dark:text-gray-400">
                管理你的设计项目，创建页面和组件
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
              className={cn(
                'bg-primary-600 hover:bg-primary-700',
                'border-primary-600 hover:border-primary-700'
              )}
            >
              创建项目
            </Button>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex items-center gap-4">
            <Search
              placeholder="搜索项目..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="max-w-md"
              size="large"
            />
          </div>
        </div>

        {/* 项目网格 */}
        {filteredProjects.length === 0 ? (
          <Empty description="暂无项目" image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              创建第一个项目
            </Button>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  className={cn(
                    'h-full cursor-pointer transition-all duration-300',
                    'hover:shadow-lg hover:-translate-y-1',
                    'border-gray-200 dark:border-gray-700',
                    'bg-white dark:bg-gray-900'
                  )}
                  cover={
                    <div
                      className={cn(
                        'h-32 flex items-center justify-center text-4xl',
                        'bg-gradient-to-br from-primary-50 to-primary-100',
                        'dark:from-primary-950/50 dark:to-primary-900/50'
                      )}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      {project.thumbnail}
                    </div>
                  }
                  actions={[
                    <Dropdown
                      key="more"
                      menu={{
                        items: getProjectMenuItems(project),
                        onClick: ({ key }) => handleProjectMenuClick(key, project),
                      }}
                      placement="bottomRight"
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>,
                  ]}
                >
                  <div onClick={() => handleProjectClick(project.id)}>
                    <div className="mb-3">
                      <Title level={4} className="mb-1 line-clamp-1">
                        {project.name}
                      </Title>
                      <Paragraph
                        className="text-gray-600 dark:text-gray-400 text-sm mb-0 line-clamp-2"
                        ellipsis={{ rows: 2 }}
                      >
                        {project.description}
                      </Paragraph>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarOutlined />
                        <span>{formatDate(project.updatedAt)}</span>
                      </div>
                      <Tag color={project.status === 'active' ? 'green' : 'default'}>
                        {project.status === 'active' ? '活跃' : '已归档'}
                      </Tag>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600 dark:text-gray-400">
                          {project.pageCount} 页面
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {project.componentCount} 组件
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* 创建项目模态框 */}
        <Modal
          title="创建新项目"
          open={isCreateModalVisible}
          onOk={handleCreateProject}
          onCancel={() => {
            setIsCreateModalVisible(false)
            form.resetFields()
          }}
          okText="创建"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="项目名称"
              name="name"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="输入项目名称" />
            </Form.Item>

            <Form.Item label="项目描述" name="description">
              <Input.TextArea placeholder="简单描述一下你的项目..." rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}
