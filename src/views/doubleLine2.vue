<template>
  <div class="control-group">
    <button style="display: block;margin: 0 auto;" @click="update()">Update</button>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      data: [],
      numberOfSeries: 2, // 线条数量
      numberOfDataPoint: 11, // 节点数
      chart: {},
      svgWidth: 600, // svg 宽
      svgHeight: 300, // svg 高
      margins: {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      },
      svg: '',
      g: '',
      x: '',
      y: '',
      width: 0,
      height: 0,
      bodyG: '',
      line: '',
      colors: ''
    }
  },
  mounted() {
    // 初始化
    this.init()
  },
  methods: {
    init() {
      const that = this
      // 初始化  生成数据
      for (let i = 0; i < this.numberOfSeries; i++) {
        that.data.push(d3.range(this.numberOfDataPoint).map(function(i) {
          return {
            x: i,
            y: that.randomData()
          }
        }))
      }
      this.lineChart()
        .x(d3.scaleLinear().domain([0, 10]))
        .y(d3.scaleLinear().domain([0, 10]))
      this.colors = d3.scaleOrdinal(d3.schemeCategory10)
      this.width = this.margins.left - this.margins.right
      this.height = this.margins.top - this.margins.bottom
      this.renderDom()
    },
    // 随机数
    randomData() {
      return Math.random() * 9
    },
    update() {
      console.log('update=====')
      for (let i = 0; i < this.data.length; i++) {
        console.log(i)
      }
    },
    lineChart() {
      const that = this
      this.chart.width = function(w) {
        if (!arguments.length) return that.svgWidth
        that.svgWidth = w
        return that.chart
      }
      this.chart.height = function(h) { // <-1C
        if (!arguments.length) return that.svgHeight
        that.svgHeight = h
        return that.chart
      }
      this.chart.margins = function(m) {
        if (!arguments.length) return that.margins
        that.margins = m
        return that.chart
      }
      this.chart.colors = function(c) {
        if (!arguments.length) return that.colors
        that.colors = c
        return that.chart
      }
      this.chart.x = function(x) {
        if (!arguments.length) return that.x
        that.x = x
        return that.chart
      }
      this.chart.y = function(y) {
        if (!arguments.length) return that.y
        that.y = y
        return that.chart
      }
      this.chart.addSeries = function(series) { // <-1D
        that.data.push(series)
        return that.chart
      }
      return this.chart
    },
    // 创建svg
    renderDom() {
      this.chart.render = () => {
        if (!this.svg) {
          this.svg = d3.select('.control-group')
            .append('svg')
            .style('margin', '20px auto')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight)
            .style('background-color', 'pink')
          // 坐标轴
          this.renderAxes()
          // 拷贝body
          // this.defineBodyClip(this.svg)
        }
        // 渲染body
        // this.renderBody(this.svg)
      }
      // this.chart
      return this.chart.render()
    },
    // 坐标轴
    renderAxes() {
      this.g = this.svg.append('g')
        .attr('class', 'oneStep')
      this.renderXAxis()
      this.renderYAxis()
    },
    // 横轴
    renderXAxis() {
      this.g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(${this.margins.left}, ${this.height + this.margins.top})`)
        .call(d3.axisBottom().scale(this.x.range([0, this.width])).ticks(5))
      // d3.selectAll('g.x g.tick')
      //   .append('line')
      //   .classed('grid-line', true)
      //   .attr('x1', 0)
      //   .attr('y1', 0)
      //   .attr('x2', 0)
      //   .attr('y2', -this.height)
    },
    // 竖轴
    renderYAxis() {
      this.g.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
        .call(d3.axisLeft().scale(this.y.range([this.height, 0])))
      // d3.selectAll('g.y g.tick')
      //   .append('line')
      //   .classed('grid-line', true)
      //   .attr('x1', 0)
      //   .attr('y1', 0)
      //   .attr('x2', this.height)
      //   .attr('y2', 0)
    },
    /**
     * defs 可重复利用区域
     * clipPath 可绘制区域
     *    当绘制的图形超出了剪切路径所指定的区域，超出区域的部分将不会被绘制。
     */
    defineBodyClip(svg) {
      const padding = 5
      svg.append('defs')
        .append('clipPath')
        .attr('id', 'body-clip')
        .append('rect')
        .attr('x', 0 - padding)
        .attr('y', 0)
        .attr('width', this.width + 2 * padding)
        .attr('height', this.height)
    },
    renderBody(svg) {
      if (!this.bodyG) {
        this.bodyG = this.svg.append('g')
          .attr('class', 'body')
          .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
          .attr('clip-path', 'url(#body-clip)')
      }
      this.renderLines()
      // this.renderDots()
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
          .transition()
          .attr('cx', function(d) {
            return that.x(d.x)
          })
          .attr('cy', function(d) {
            return that.y(d.y)
          })
      })
    }
  }
}
</script>
