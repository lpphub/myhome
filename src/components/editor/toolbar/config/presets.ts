import type { ToolbarConfig, ToolbarPreset } from '../../types'
import { TOOLBAR_ITEMS } from './items'

/**
 * 工具栏预设配置
 * 每个预设固定包含模式和工具栏项目，不可覆盖
 */
export const TOOLBAR_PRESETS: Record<ToolbarPreset, ToolbarConfig> = {
  /**
   * Simple 预设
   * - 模式: bubble (选择时出现)
   * - 工具: 基础编辑工具
   * - 适用场景: 简单文本编辑，最小化界面干扰
   */
  simple: {
    mode: 'bubble',
    items: ['bold', 'italic', 'underline', 'link'].map(id => TOOLBAR_ITEMS[id]),
  },

  /**
   * Article 预设
   * - 模式: bubble (选择时出现)
   * - 工具: 写作工具
   * - 适用场景: 文章写作，需要丰富格式但不希望工具栏占用空间
   */
  article: {
    mode: 'bubble',
    items: ['bold', 'italic', 'heading', 'list', 'blockquote', 'link'].map(id => TOOLBAR_ITEMS[id]),
  },

  /**
   * Full 预设
   * - 模式: sticky (粘性定位在顶部)
   * - 工具: 所有可用工具
   * - 适用场景: 完整编辑功能，传统编辑器体验
   */
  full: {
    mode: 'sticky',
    items: Object.values(TOOLBAR_ITEMS),
  },
}

/**
 * 获取预设配置（只读）
 * 用于展示预设信息
 */
export function getPresetConfig(preset: ToolbarPreset): ToolbarConfig | null {
  return TOOLBAR_PRESETS[preset] || null
}

/**
 * 获取所有预设名称
 */
export function getAvailablePresets(): ToolbarPreset[] {
  return Object.keys(TOOLBAR_PRESETS) as ToolbarPreset[]
}
