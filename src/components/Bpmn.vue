<template>
  <div class="bpmn-container">
    <div ref="canvas"
      class="canves"></div>
  </div>
</template>

<script>
import Modeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import { xmlStr } from './xmlData.js'

import customPalette from './palette'
import customRenderer from './renderer'
import paletteEntries from './config/paletteEntries'

export default {
  data () {
    return {
      bpmnModeler: null
    }
  },
  async mounted () {
    // // 去除默认工具栏
    const modules = Modeler.prototype._modules
    const index = modules.findIndex(it => it.paletteProvider)
    modules.splice(index, 1)

    this.bpmnModeler = new Modeler({
      container: this.$refs.canvas,
      paletteEntries,
      additionalModules: [customPalette, customRenderer]
    })

    try {
      const { warnings } = await this.bpmnModeler.importXML(xmlStr)
      // 调整在正中间
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')
      console.log('rendered')
    } catch (err) {
      
      console.log('error rendering', err)
    }
  }
}
</script>

<style lang="less" scoped>
.bpmn-container {
  .canves {
    width: 100%;
    height: 100vh;
  }
}
</style>
