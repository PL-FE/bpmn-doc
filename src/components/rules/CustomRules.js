import inherits from 'inherits'

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'

/**
 * A custom rule provider that decides what elements can be
 * dropped where based on a `vendor:allowDrop` BPMN extension.
 *
 * See {@link BpmnRules} for the default implementation
 * of BPMN 2.0 modeling rules provided by bpmn-js.
 *
 * @param {EventBus} eventBus
 */
export default function CustomRules (eventBus) {
  RuleProvider.call(this, eventBus)
}

inherits(CustomRules, RuleProvider)

CustomRules.$inject = ['eventBus']
CustomRules.prototype.init = function () {
  // there exist a number of modeling actions
  // that are identified by a unique ID. We
  // can hook into each one of them and make sure
  // they are only allowed if we say so

  // this.addRule(['connection.create', 'shape.create'], 1234, function (context) {
  //   console.log('context', context)
  //   return false
  // })
  // this.addRule('shape.create', 1239, function (context) {
  //   console.log('context', context)
  //   return false
  // })
}
