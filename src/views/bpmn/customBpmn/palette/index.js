import customPalette from './CustomPalette'
import PaletteProvider from './CustomPaletteProvider'

export default {
  __depends__: [
    customPalette
  ],
  __init__: ['customPaletteProvider'],
  customPaletteProvider: ['type', PaletteProvider]
}
