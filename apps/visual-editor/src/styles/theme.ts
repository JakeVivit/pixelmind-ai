import type { ThemeConfig } from 'antd'

// PixelMind AI custom theme configuration
export const theme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#667eea',
    colorPrimaryHover: '#5a6fd8',
    colorPrimaryActive: '#4c63d2',
    
    // Success colors
    colorSuccess: '#52c41a',
    colorSuccessHover: '#73d13d',
    colorSuccessActive: '#389e0d',
    
    // Warning colors
    colorWarning: '#faad14',
    colorWarningHover: '#ffc53d',
    colorWarningActive: '#d48806',
    
    // Error colors
    colorError: '#ff4d4f',
    colorErrorHover: '#ff7875',
    colorErrorActive: '#d9363e',
    
    // Info colors
    colorInfo: '#1890ff',
    colorInfoHover: '#40a9ff',
    colorInfoActive: '#096dd9',
    
    // Background colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgSpotlight: '#ffffff',
    
    // Border colors
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    
    // Text colors
    colorText: '#333333',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#cccccc',
    
    // Font settings
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    
    // Line height
    lineHeight: 1.5,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.4,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,
    
    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,
    
    // Control height
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,
    controlHeightXS: 16,
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    
    // Z-index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
    
    // Wireframe mode (set to false for filled components)
    wireframe: false,
  },
  
  components: {
    // Button component customization
    Button: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      fontWeight: 500,
    },
    
    // Input component customization
    Input: {
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
    },
    
    // Card component customization
    Card: {
      borderRadius: 8,
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
    
    // Layout component customization
    Layout: {
      headerBg: '#ffffff',
      headerColor: '#333333',
      headerHeight: 64,
      siderBg: '#fafafa',
      triggerBg: '#ffffff',
      triggerColor: '#333333',
    },
    
    // Menu component customization
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
      itemHoverBg: '#f5f5f5',
      itemHoverColor: '#333333',
    },
    
    // Table component customization
    Table: {
      borderRadius: 6,
      headerBg: '#fafafa',
      headerColor: '#333333',
      rowHoverBg: '#f5f5f5',
    },
    
    // Modal component customization
    Modal: {
      borderRadius: 8,
      headerBg: '#ffffff',
      contentBg: '#ffffff',
      footerBg: '#ffffff',
    },
    
    // Drawer component customization
    Drawer: {
      colorBgElevated: '#ffffff',
    },
    
    // Tabs component customization
    Tabs: {
      itemColor: '#666666',
      itemSelectedColor: '#1890ff',
      itemHoverColor: '#333333',
      inkBarColor: '#1890ff',
    },
  },
  
  // Algorithm for theme generation
  algorithm: undefined, // Use default algorithm
}
