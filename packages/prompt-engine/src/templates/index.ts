// Prompt templates for different frameworks and UI libraries

import type { PromptTemplate } from '../core'

export const REACT_ANTD_COMPONENT_TEMPLATE: PromptTemplate = {
  id: 'react-antd-component',
  name: 'React Ant Design Component',
  description: 'Generate React components using Ant Design',
  framework: 'react',
  uiLibrary: 'antd',
  template: `You are an expert React developer. Generate a React component using TypeScript and Ant Design based on the following requirements:

**Requirements:**
- Framework: {{framework}}
- UI Library: {{uiLibrary}}
- User Intent: {{userIntent}}
- Component Type: {{componentType}}

**Guidelines:**
1. Use TypeScript with proper type definitions
2. Use Ant Design components and follow their design patterns
3. Include proper imports from 'antd' and '@ant-design/icons'
4. Use functional components with hooks
5. Include proper prop types and interfaces
6. Follow React best practices and conventions
7. Add meaningful comments for complex logic
8. Use semantic HTML and accessibility attributes

**Code Style:**
- Use arrow functions for components
- Use destructuring for props
- Use proper naming conventions (PascalCase for components, camelCase for variables)
- Include proper spacing and formatting

**Additional Context:**
{{#if includeTypes}}
- Include comprehensive TypeScript interfaces and types
{{/if}}
{{#if includeStyles}}
- Include inline styles or CSS-in-JS where appropriate
{{/if}}
{{#if existingCode}}
- Consider existing code context: {{existingCode}}
{{/if}}

Please generate a complete, production-ready React component that fulfills the requirements. Include only the component code without additional explanations unless specifically requested.`,
  variables: ['framework', 'uiLibrary', 'userIntent', 'componentType', 'includeTypes', 'includeStyles', 'existingCode'],
  examples: [
    {
      input: 'Create a login form with email and password fields',
      output: `import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const { Title } = Typography

interface LoginFormProps {
  onSubmit?: (values: { email: string; password: string }) => void
  loading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm()

  const handleSubmit = (values: { email: string; password: string }) => {
    onSubmit?.(values)
  }

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3} style={{ textAlign: 'center', margin: 0 }}>
          Sign In
        </Title>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  )
}`,
      description: 'Example of a login form component with validation'
    }
  ]
}

export const REACT_MUI_COMPONENT_TEMPLATE: PromptTemplate = {
  id: 'react-mui-component',
  name: 'React Material-UI Component',
  description: 'Generate React components using Material-UI',
  framework: 'react',
  uiLibrary: 'material-ui',
  template: `You are an expert React developer. Generate a React component using TypeScript and Material-UI based on the following requirements:

**Requirements:**
- Framework: {{framework}}
- UI Library: {{uiLibrary}}
- User Intent: {{userIntent}}
- Component Type: {{componentType}}

**Guidelines:**
1. Use TypeScript with proper type definitions
2. Use Material-UI components and follow Material Design principles
3. Include proper imports from '@mui/material' and '@mui/icons-material'
4. Use functional components with hooks
5. Include proper prop types and interfaces
6. Follow React best practices and conventions
7. Add meaningful comments for complex logic
8. Use semantic HTML and accessibility attributes

**Code Style:**
- Use arrow functions for components
- Use destructuring for props
- Use proper naming conventions (PascalCase for components, camelCase for variables)
- Include proper spacing and formatting

**Additional Context:**
{{#if includeTypes}}
- Include comprehensive TypeScript interfaces and types
{{/if}}
{{#if includeStyles}}
- Use Material-UI's sx prop or styled components for styling
{{/if}}
{{#if existingCode}}
- Consider existing code context: {{existingCode}}
{{/if}}

Please generate a complete, production-ready React component that fulfills the requirements. Include only the component code without additional explanations unless specifically requested.`,
  variables: ['framework', 'uiLibrary', 'userIntent', 'componentType', 'includeTypes', 'includeStyles', 'existingCode']
}

export const VUE_COMPONENT_TEMPLATE: PromptTemplate = {
  id: 'vue-component',
  name: 'Vue Component',
  description: 'Generate Vue components with TypeScript',
  framework: 'vue',
  uiLibrary: 'antd',
  template: `You are an expert Vue.js developer. Generate a Vue component using TypeScript and the Composition API based on the following requirements:

**Requirements:**
- Framework: {{framework}}
- UI Library: {{uiLibrary}}
- User Intent: {{userIntent}}
- Component Type: {{componentType}}

**Guidelines:**
1. Use Vue 3 Composition API with TypeScript
2. Use <script setup> syntax for better developer experience
3. Include proper prop definitions with TypeScript
4. Use reactive refs and computed properties appropriately
5. Follow Vue.js best practices and conventions
6. Add meaningful comments for complex logic
7. Use semantic HTML and accessibility attributes

**Code Style:**
- Use <script setup lang="ts"> for TypeScript support
- Use proper naming conventions (PascalCase for components, camelCase for variables)
- Include proper spacing and formatting
- Separate template, script, and style sections clearly

**Additional Context:**
{{#if includeTypes}}
- Include comprehensive TypeScript interfaces and types
{{/if}}
{{#if includeStyles}}
- Include scoped styles in the <style> section
{{/if}}
{{#if existingCode}}
- Consider existing code context: {{existingCode}}
{{/if}}

Please generate a complete, production-ready Vue component that fulfills the requirements. Include only the component code without additional explanations unless specifically requested.`,
  variables: ['framework', 'uiLibrary', 'userIntent', 'componentType', 'includeTypes', 'includeStyles', 'existingCode']
}

export const GENERIC_COMPONENT_TEMPLATE: PromptTemplate = {
  id: 'generic-component',
  name: 'Generic Component',
  description: 'Generic template for any framework/library combination',
  framework: 'react',
  uiLibrary: 'antd',
  template: `You are an expert frontend developer. Generate a component using the specified framework and UI library based on the following requirements:

**Requirements:**
- Framework: {{framework}}
- UI Library: {{uiLibrary}}
- User Intent: {{userIntent}}
- Component Type: {{componentType}}

**Guidelines:**
1. Use TypeScript with proper type definitions
2. Follow the best practices for the specified framework and UI library
3. Include proper imports and dependencies
4. Use modern syntax and patterns
5. Include proper prop types and interfaces
6. Add meaningful comments for complex logic
7. Use semantic HTML and accessibility attributes

**Additional Context:**
{{#if includeTypes}}
- Include comprehensive TypeScript interfaces and types
{{/if}}
{{#if includeStyles}}
- Include appropriate styling approach for the framework
{{/if}}
{{#if existingCode}}
- Consider existing code context: {{existingCode}}
{{/if}}

Please generate a complete, production-ready component that fulfills the requirements.`,
  variables: ['framework', 'uiLibrary', 'userIntent', 'componentType', 'includeTypes', 'includeStyles', 'existingCode']
}

// Export all templates
export const DEFAULT_TEMPLATES = [
  REACT_ANTD_COMPONENT_TEMPLATE,
  REACT_MUI_COMPONENT_TEMPLATE,
  VUE_COMPONENT_TEMPLATE,
  GENERIC_COMPONENT_TEMPLATE,
]
