import customPalette from './CustomPalette'
import PaletteProvider from './CustomPaletteProvider'

// 该服务称为customPaletteProvider，它依赖于 customPalette，并且应在创建关系图时初始化该服务
export default {
  __depends__: [
    customPalette
  ],
  __init__: ['customPaletteProvider'],
  customPaletteProvider: ['type', PaletteProvider]
}
