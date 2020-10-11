<template>
  <div class="bpmn">
    <div class="tool">
      <el-button @click="saveXML">保存 XML</el-button>
      <el-button @click="$refs.refFile.click()">导入 XML</el-button>
      <el-button @click="saveSVG">保存为 SVG</el-button>
      <el-button @click="handlerUndo">撤销</el-button>
      <el-button @click="handlerRedo">恢复</el-button>
      <el-button @click="handlerZoom(0.1)">放大</el-button>
      <el-button @click="handlerZoom(-0.1)">缩小</el-button>
      <el-button @click="handlerZoom(0)">还原</el-button>

      <input type="file"
        id="files"
        ref="refFile"
        style="display: none"
        @change="loadXML" />
    </div>
    <div ref="palette">
    </div>
    <div class="canvas"
      ref="canvas"></div>
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnModeler from 'bpmn-js/lib/Modeler'
import customPalette from './customBpmn/palette'
import minimapModule from 'diagram-js-minimap'

import { xmlStr } from './xmlData' // 这里是直接引用了xml字符串
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

import {
  query as domQuery
} from 'min-dom'

export default {
  name: 'Bpmn',
  components: {},
  data () {
    return {
      bpmnModeler: null,
      container: null,
      canvas: null,
      scale: 1,
      xml: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    async init () {
      // 去除默认工具栏
      const modules = BpmnModeler.prototype._modules
      const index = modules.findIndex(it => it.paletteProvider)
      modules.splice(index, 1)

      const canvas = this.$refs.canvas
      // 自定义工具栏位置
      // 自定义样式 CustomPalette.js
      const palette = this.$refs.palette
      // 建模
      this.bpmnModeler = new BpmnModeler({
        modules,
        container: canvas,
        paletteContainer: palette,
        keyboard: {
          bindTo: document
        },
        additionalModules: [
          // 小地图
          minimapModule,
          // 自定义工具栏
          customPalette
          // {
          //   // 禁用滚轮滚动
          //   zoomScroll: ['value', ''],
          //   // 禁止拖动线
          //   bendpoints: ['value', ''],
          //   // 禁用左侧面板
          //   paletteProvider: ['value', ''],
          //   // 禁止点击节点出现contextPad
          //   contextPadProvider: ['value', ''],
          //   // 禁止双击节点出现label编辑框
          //   labelEditingProvider: ['value', '']
          // }
        ]
      })
      // 绑定事件
      this.initEvent()

      // 初始化 流程图
      await this.createNewDiagram()

      // 调整与正中间
      this.bpmnModeler.get('canvas').zoom('fit-viewport', 'auto')

      // 初始化箭头
      this.initArrow('sequenceflow-arrow-normal')
      this.initArrow('sequenceflow-arrow-active')

      // 默认打开 minimap
      this.bpmnModeler.get('minimap').open()
    },

    createNewDiagram () {
      // 将字符串转换成图显示出来
      this.xml = xmlStr
      return this.bpmnModeler.importXML(this.xml)
    },

    // 绑定事件
    initEvent () {
      // this.getEventBusAll() 查看所有可用事件
      const eventBus = this.bpmnModeler.get('eventBus')
      eventBus.on('element.click', e => {
        console.log('点击了元素', e)
      })
    },

    // 初始化自定义箭头
    initArrow (id) {
      const marker = svgCreate('marker')

      svgAttr(marker, {
        id,
        viewBox: '0 0 20 20',
        refX: '11',
        refY: '10',
        markerWidth: '10',
        markerHeight: '10',
        orient: 'auto'
      })

      const path = svgCreate('path')

      svgAttr(path, {
        d: 'M 1 5 L 11 10 L 1 15 Z',
        style: ' stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; '
      })

      const defs = domQuery('defs')
      svgAppend(marker, path)
      svgAppend(defs, marker)
    },

    async saveXML () {
      try {
        const result = await this.bpmnModeler.saveXML({ format: true })
        const { xml } = result

        const xmlBlob = new Blob([xml], {
          type: 'application/bpmn20-xml;charset=UTF-8,'
        })

        const downloadLink = document.createElement('a')
        downloadLink.download = `bpmn-${+new Date()}.bpmn`
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(xmlBlob)
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    async saveSVG () {
      try {
        const result = await this.bpmnModeler.saveSVG()
        const { svg } = result

        const svgBlob = new Blob([svg], {
          type: 'image/svg+xml'
        })

        const downloadLink = document.createElement('a')
        downloadLink.download = `bpmn-${+new Date()}.SVG`
        downloadLink.innerHTML = 'Get BPMN SVG'
        downloadLink.href = window.URL.createObjectURL(svgBlob)
        downloadLink.onclick = function (event) {
          document.body.removeChild(event.target)
        }
        downloadLink.style.visibility = 'hidden'
        document.body.appendChild(downloadLink)
        downloadLink.click()
      } catch (err) {
        console.log(err)
      }
    },

    async loadXML () {
      const that = this
      const file = this.$refs.refFile.files[0]

      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = function () {
        console.log('this', this)
        that.xmlStr = this.result
        that.createNewDiagram()
      }
    },

    handlerRedo () {
      this.bpmnModeler.get('commandStack').redo()
    },
    handlerUndo () {
      this.bpmnModeler.get('commandStack').undo()
    },

    handlerZoom (radio) {
      const newScale = !radio ? 1.0 : this.scale + radio
      this.bpmnModeler.get('canvas').zoom(newScale)

      this.scale = newScale
    },

    // 获取所有元素
    getElementAll () {
      return this.bpmnModeler.get('elementRegistry').getAll()
    },
    // 根据 id 获取元素
    getElementById (id) {
      return this.bpmnModeler.get('elementRegistry').get(id)
    },

    // 创建 业务对象 business objects
    createBusinessElement () {
      const bpmnFactory = this.bpmnModeler.get('bpmnFactory')
      const taskBusinessObject = bpmnFactory.create('bpmn:Task', { id: 'Task_1', name: 'Task' })

      // 使用刚创建的业务对象创建新的图表形状
      const task = this.createElement({ type: 'bpmn:Task', businessObject: taskBusinessObject })
      return task
    },

    // 新增元素
    createElement (elementConfig = { type: 'bpmn:Task' }) {
      const elementFactory = this.bpmnModeler.get('elementFactory')
      const task = elementFactory.createShape(elementConfig)
      return task
    },

    // 添加元素
    appendElement (parentsElement, newElement, location = { x: 400, y: 100 }) {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.createShape(newElement, location, parentsElement)
      // modeling.createShape(newElement, location, parentsElement, { attach: true })
    },

    // 连线
    connectElement (sourceElement, targetElement) {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.connect(sourceElement, targetElement)
    },

    // 添加元素并连线
    appendConnect (sourceElement, targetElement, location = { x: 400, y: 100 }, parentsElement) {
      const modeling = this.bpmnModeler.get('modeling')
      modeling.appendShape(sourceElement, targetElement, location, parentsElement)
    },

    // 查看所有可用事件
    getEventBusAll () {
      const eventBus = this.bpmnModeler.get('eventBus')
      const eventTypes = Object.keys(eventBus._listeners)
      console.log(eventTypes) // 打印出来有242种事件
      return eventTypes
    },

    // 更新属性
    updateAttr (id, AttrObj = {}) {
      const element = this.getElementById(id)
      const modeling = this.bpmnModeler.get('modeling')
      modeling.updateProperties(element, AttrObj)
    }
  }
}
</script>

<style lang="less" scoped>
.bpmn {
  width: 100%;
  height: 100%;
  position: relative;

  .canvas {
    width: 100%;
    height: 100%;
  }

  .panel {
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }

  .tool {
    position: absolute;
    z-index: 1;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }
}
</style>
