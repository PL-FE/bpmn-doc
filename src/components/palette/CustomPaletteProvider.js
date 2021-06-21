import {
  assign
} from 'min-dash'

PaletteProvider.$inject = ['config.paletteEntries', 'customPalette', 'lassoTool', 'translate']

export default function PaletteProvider (paletteEntries, customPalette, lassoTool, translate) {
  this._entries = paletteEntries
  this._lassoTool = lassoTool
  this._translate = translate

  customPalette.registerProvider(this)
}

PaletteProvider.prototype.getPaletteEntries = function (element) {
  var lassoTool = this._lassoTool
  var translate = this._translate

  // 返回的PaletteEntries加上tool有关的
  return assign(this._entries, {
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool-custom',
      title: translate('Activate the lasso tool'),
      imageUrl: require('../img/lasso.png'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    }
  })
}
