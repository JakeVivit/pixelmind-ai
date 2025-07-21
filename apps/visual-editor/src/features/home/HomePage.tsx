import React from 'react'
import { motion } from 'framer-motion'
import { HeroSection } from './components/HeroSection'
import { FeatureSection } from './components/FeatureSection'
import { QuickActions } from './components/QuickActions'
import { TechStack } from './components/TechStack'
import { cn } from '../../utils/cn'

/**
 * 首页组件
 * 采用 Linear 风格的现代简洁设计
 */
export const HomePage: React.FC = () => {
  return (
    <div className={cn(
      'min-h-screen',
      'bg-gradient-to-br from-gray-50 via-white to-primary-50/30',
      'dark:from-gray-950 dark:via-gray-900 dark:to-primary-950/30'
    )}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute -top-40 -right-40 w-80 h-80 rounded-full',
          'bg-gradient-to-br from-primary-400/20 to-primary-600/20',
          'blur-3xl animate-float'
        )} />
        <div className={cn(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full',
          'bg-gradient-to-br from-primary-500/20 to-primary-700/20',
          'blur-3xl animate-float',
          'animation-delay-1000'
        )} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10">
        {/* Hero 区域 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection />
        </motion.section>

        {/* 功能特性区域 */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <FeatureSection />
        </motion.section>

        {/* 快速操作区域 */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <QuickActions />
        </motion.section>

        {/* 技术栈展示 */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <TechStack />
        </motion.section>
      </div>
    </div>
  )
}
