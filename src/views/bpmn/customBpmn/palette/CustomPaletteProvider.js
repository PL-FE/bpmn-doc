
/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider (
  paletteEntries,
  customPalette,
  spaceTool
) {
  this._entries = paletteEntries
  console.log('spaceTool', spaceTool)
  customPalette.registerProvider(this)
}

PaletteProvider.$inject = [
  'config.paletteEntries',
  'customPalette',
  'spaceTool'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  return this._entries
}
