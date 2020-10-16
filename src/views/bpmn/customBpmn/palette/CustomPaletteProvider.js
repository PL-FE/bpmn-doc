
/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider (
  paletteEntries,
  customPalette
) {
  this._entries = paletteEntries

  customPalette.registerProvider(this)
}

PaletteProvider.$inject = [
  'config.paletteEntries',
  'customPalette'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  return this._entries
}
