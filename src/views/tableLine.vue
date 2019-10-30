<template>
  <div class="tableLine" />
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      svg: '',
      svgWidth: 800,
      svgHeight: 500,
      margin: 50
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log('init')
      // 创建svg
      this.svg = d3.selectAll('.tableLine')
        .append('svg')
        .attr('class', 'axis')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .style('background-color', 'pink')
        // 坐标轴
      this.axis()
    },
    axis() {
      this.renderYAxis()
      this.renderXAxis()
    },
    renderXAxis() {
      const that = this
      const scale = d3.scaleLinear()
        .domain([0, 500])
        .range([0, this.svgWidth - 2 * this.margin])
      this.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', function() {
          return `translate(${that.margin}, ${that.svgHeight - that.margin})`
        })
        .call(d3.axisBottom().scale(scale))
      d3.selectAll('g.x-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -(this.svgHeight - 2 * this.margin))
    },
    renderYAxis() {
      const axisLength = this.svgHeight - 2 * this.margin
      const that = this
      const scale = d3.scaleLinear()
        .domain([0, 500])
        .range([axisLength, 0])
      const yAxis = d3.axisLeft()
        .scale(scale)
      this.svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', function() {
          return `translate(${that.margin}, ${that.margin})`
        })
        .call(yAxis)
      d3.selectAll('g.y-axis g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', this.svgWidth - 2 * this.margin)
        .attr('y2', 0)
    }
  }
}
</script>

<style>
  .axis .grid-line {
    stroke: black;
    shape-rendering: crispEdges;
    stroke-opacity: .2;
  }
</style>
