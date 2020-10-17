<template>
  <div id="app">
    <Bpmn />
  </div>
</template>

<script>
import Bpmn from './components/Bpmn'

export default {
  name: 'App',
  components: {
    Bpmn
  }
}
</script>

<style lang="less" >
body {
  margin: 0;
  padding: 0;
}
</style>
