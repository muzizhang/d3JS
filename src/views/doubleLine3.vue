<template>
  <div class="control-group">
    <button style="display: block;margin: 20px auto;" @click="update()">Update</button>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      svg: '',
      svgWidth: 800,
      svgHeight: 500,
      width: 0,
      height: 0,
      margin: {
        top: 100,
        left: 100,
        bottom: 100,
        right: 50
      },
      g: '',
      chart: {},
      x: '',
      y: '',
      data: [],
      numberOfSeries: 2, // 线条数量
      numberOfDataPoint: 11, // 节点数
      bodyG: '',
      line: '',
      colors: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.width = this.svgWidth - this.margin.left - this.margin.right
      this.height = this.svgHeight - this.margin.top - this.margin.bottom
      this.colors = d3.scaleOrdinal(d3.schemeCategory10)
      // 生成数据  二维数组
      for (let i = 0; i < this.numberOfSeries; i++) {
        this.data.push(d3.range(this.numberOfDataPoint).map(function(i) {
          return {
            x: i,
            y: Math.random() * 9
          }
        }))
      }
      this.oneStep()
    },
    oneStep() {
      console.log(this.data)
      // 坐标轴数据
      this.lineChart()
        .x(d3.scaleLinear().domain([0, 10]))
      this.lineChart()
        .y(d3.scaleLinear().domain([0, 10]))
      // 创建svg
      this.createSvg()
    },
    lineChart() {
      const that = this
      this.chart.x = function(x) {
        if (!arguments.length) return that.x
        that.x = x
        return this.chart
      }
      this.chart.y = function(y) {
        if (!arguments.length) return that.y
        that.y = y
        return this.chart
      }
      return this.chart
    },
    createSvg() {
      if (!this.svg) {
        this.svg = d3.select('.control-group')
          .append('svg')
          .attr('width', this.svgWidth)
          .attr('height', this.svgHeight)
          .style('background-color', 'pink')
        // 坐标系
        this.renderAxes()
        // 重复利用区域
        this.defineBodyClip()
      }
      this.renderBody()
    },
    renderAxes() {
      this.g = this.svg.append('g')
        .attr('class', 'onestep')
      // xy轴
      this.renderXAxis()
      this.renderYAxis()
    },
    renderXAxis() {
      this.g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
        .call(d3.axisBottom().scale(this.x.range([0, this.width])))
      // 网格线
      d3.selectAll('g.x g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -this.height)
    },
    renderYAxis() {
      this.g.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft().scale(this.y.range([this.height, 0])))
      // 网格线
      d3.selectAll('g.y g.tick')
        .append('line')
        .classed('grid-line', true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', this.width)
        .attr('y2', 0)
    },
    /**
     * defs  重复利用区域
     * clipPath 可绘制区域
     * */
    defineBodyClip() {
      const padding = 5
      this.svg.append('defs')
        .append('clipPath')
        .attr('id', 'body-clip')
        .append('rect')
        .attr('x', 0 - padding)
        .attr('y', 0)
        .attr('width', this.width + 2 * padding)
        .attr('height', this.height)
    },
    renderBody() {
      if (!this.bodyG) {
        this.bodyG = this.svg.append('g')
          .attr('class', 'body')
          .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
          .attr('clip-path', 'url(#body-clip)')
      }
      this.renderLines()
      this.renderDots()
    },
    renderLines() {
      const that = this
      this.line = d3.line()
        .x(function(d) {
          return that.x(d.x)
        })
        .y(function(d) {
          return that.y(d.y)
        })
      const pathLines = this.bodyG.selectAll('path.line')
        .data(this.data)
      pathLines.enter()
        .append('path')
        .merge(pathLines)
        .style('stroke', function(d, i) {
          return that.colors(i)
        })
        .attr('class', 'line')
        .transition()
        .attr('d', function(d) {
          return that.line(d)
        })
        .attr('fill', 'none')
        .attr('stroke-width', 2)
    },
    renderDots() {
      const that = this
      this.data.forEach(function(list, i) {
        const circle = that.bodyG.selectAll('circle._' + i)
          .data(list)
        circle.enter()
          .append('circle')
          .merge(circle)
          .attr('class', 'dot _' + i)
          .style('stroke', function(d, i) {
            return that.colors(i)
          })
          .attr('r', 5)
          .transition()
          .attr('cx', function(d) {
            return that.x(d.x)
          })
          .attr('cy', function(d) {
            return that.y(d.y)
          })
      })
    },
    update() {
      for (let i = 0; i < this.data.length; ++i) {
        let series = this.data[i]
        series = []
        for (let j = 0; j < this.numberOfDataPoint; ++j) {
          series.push({
            x: j,
            y: Math.random() * 9
          })
        }
        this.data[i] = series
      }
      this.oneStep()
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
