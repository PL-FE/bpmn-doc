
/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider (
  paletteEntries,
  customPalette,
  create,
  elementFactory,
  translate
) {
  this._entries = paletteEntries
  this._palette = customPalette
  this._create = create
  this._elementFactory = elementFactory
  this._translate = translate

  customPalette.registerProvider(this)
}

PaletteProvider.$inject = [
  'config.paletteEntries',
  'customPalette',
  'create',
  'elementFactory',
  'translate'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  return this._entries
}
