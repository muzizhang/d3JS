<template>
  <div id="operation">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
    />
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      svgWidth: 800,
      svgHeight: 600,
      padding: {
        top: 30,
        left: 30,
        bottom: 30,
        right: 30
      },
      dataset: [20, 80, 40],
      width: 0,
      height: 0
    }
  },
  mounted() {
    // 1. 创建画布
    d3.selectAll('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .style('background-color', 'pink')
    this.width = this.svgWidth - this.padding.left - this.padding.right
    this.height = this.svgHeight - this.padding.top - this.padding
    // 2. 比例尺
  }
}
</script>
