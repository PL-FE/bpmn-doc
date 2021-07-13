<template>
  <div id="app">
    <span class="github"><a href="https://github.com/PL-FE/bpmn-doc/tree/dev"
        target="_blank">bpmn-doc - dev分支</a></span>
    <router-view />
  </div>
</template>

<style lang="less">
body {
  margin: 0;
  overflow: hidden;
}
.github {
  position: fixed;
  transform: translateX(-50%);
  left: 50%;
  z-index: 9;
}
</style>
