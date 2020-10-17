PaletteProvider.$inject = ['config.paletteEntries', 'customPalette']

export default function PaletteProvider (paletteEntries, customPalette) {
  this._entries = paletteEntries

  customPalette.registerProvider(this)
}

PaletteProvider.prototype.getPaletteEntries = function (element) {
  return this._entries // 🎯 返回工具栏数据
}