<template>
  <div class="control-group">
    <button @click="renderAll(data[0])">
      horizontal bottom
    </button>
    <button @click="renderAll(data[1])">
      horizontal top
    </button>
    <button @click="renderAll(data[2])">
      vertical left
    </button>
    <button @click="renderAll(data[3])">
      vertical right
    </button>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      svg: '',
      svgWidth: 600,
      svgHeight: 400,
      margin: 25,
      offset: 50,
      data: [d3.axisBottom, d3.axisTop, d3.axisLeft, d3.axisRight]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 创建svg
      this.createSvg()
      // 创建坐标系
    },
    createSvg() {
      this.svg = d3.select('.control-group')
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .classed('svg', true)
        .style('margin', '0 auto')
        .style('background-color', 'pink')
    },
    renderAxis(fn, scale, i) {
      const that = this
      const axis = fn()
        .scale(scale)
        .ticks(5)
      this.svg.append('g')
        .attr('transform', function() {
          if ([d3.axisTop, d3.axisBottom].indexOf(fn) >= 0) {
            return `translate(${that.margin}, ${(that.offset * 1) * (i * 1)})`
          } else {
            return `translate(${that.offset * i}, ${that.margin})`
          }
        })
        .call(axis)
    },
    renderAll(fn) {
      if (this.svg) this.svg.remove()
      this.createSvg()
      this.renderAxis(fn, d3.scaleLinear()
        .domain([0, 1000])
        .range([0, this.svgWidth - 2 * this.margin]), 1)
      this.renderAxis(fn, d3.scalePow()
        .exponent(2)
        .domain([0, 1000])
        .range([0, this.svgWidth - 2 * this.margin]), 2)
      this.renderAxis(fn, d3.scaleTime()
        .domain(
          [new Date(2016, 0, 1),
            new Date(2017, 0, 1)]
        )
        .range([0, this.svgWidth - 2 * this.margin]), 3)
    }
  }
}
</script>
