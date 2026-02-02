import type { ToolbarConfig, ToolbarPreset } from '../../types'
import { TOOLBAR_ITEMS, toolbarItems } from './items'
import { getAvailablePresets, getPresetConfig, TOOLBAR_PRESETS } from './presets'

/**
 * 解析工具栏配置
 * 支持预设模式和自定义模式
 *
 * @param config - 预设名称或自定义配置对象
 * @returns 解析后的工具栏配置
 */
export function resolveToolbarConfig(config?: ToolbarPreset | ToolbarConfig): ToolbarConfig {
  // 如果没有配置，使用默认的 full 预设
  if (!config) {
    return TOOLBAR_PRESETS.full
  }

  // 如果是字符串，表示使用预设
  if (typeof config === 'string') {
    const preset = TOOLBAR_PRESETS[config]
    if (!preset) {
      console.warn(`Unknown toolbar preset: ${config}, falling back to 'full'`)
      return TOOLBAR_PRESETS.full
    }
    return preset
  }

  // 如果是对象，表示自定义配置
  if (typeof config === 'object' && 'mode' in config && 'items' in config) {
    return {
      mode: config.mode,
      items: config.items,
    }
  }

  // 无效配置，回退到默认预设
  console.warn('Invalid toolbar configuration, falling back to default preset')
  return TOOLBAR_PRESETS.full
}

// 导出所有配置相关的功能
export { TOOLBAR_ITEMS, TOOLBAR_PRESETS, toolbarItems, getPresetConfig, getAvailablePresets }
