<template>
  <div id="line" />
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      svgWidth: 800,
      svgHeight: 600,
      dataset: [
        {
          'sale': '202',
          'year': '2000'
        },
        {
          'sale': '215',
          'year': '2001'
        },
        {
          'sale': '179',
          'year': '2002'
        },
        {
          'sale': '0',
          'year': '2003'
        },
        {
          'sale': '134',
          'year': '2003'
        },
        {
          'sale': '176',
          'year': '2010'
        }
      ],
      datasetTwo: [
        {
          'sale': '600',
          'year': '2000'
        },
        {
          'sale': '115',
          'year': '2001'
        },
        {
          'sale': '300',
          'year': '2002'
        },
        {
          'sale': '200',
          'year': '2003'
        },
        {
          'sale': '400',
          'year': '2003'
        },
        {
          'sale': '230',
          'year': '2010'
        }
      ],
      margin: {
        top: 100,
        left: 100,
        bottom: 100,
        right: 50
      },
      sale: [],
      year: [],
      width: 0,
      height: 0,
      g: '',
      r: 8,
      inputWidth: 0,
      inputHeight: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 创建画布
      this.width = this.svgWidth - this.margin.left - this.margin.right
      this.height = this.svgHeight - this.margin.top - this.margin.bottom

      this.g = this.svg().append('g').attr('class', 'oneStep')
      // 坐标系
      this.coordinates()
      // 创建线条
      this.createLine(this.dataset)
      this.createCircle(this.dataset)
      this.createText(this.dataset)
      // 创建原点
      this.createLine(this.datasetTwo)
      this.createCircle(this.datasetTwo)
      this.createText(this.datasetTwo)
      // 文字
    },
    svg() {
      return d3.select('#line')
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .style('background-color', 'pink')
    },
    // 比例尺
    scale() {
      // 比较两个数组中的最大值
      const maxData = this.dataset > this.datasetTwo ? this.dataset : this.datasetTwo
      maxData.map((d) => {
        this.sale.push(d.sale)
        this.year.push(d.year)
      })
      // 比例尺
      const xScale = d3.scaleBand()
        .domain(this.year)
        .range([0, this.width])
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(this.sale)])
        .range([this.height, 0])
      return {
        xScale,
        yScale
      }
    },
    line() {
      // 添加折线
      const that = this
      const line = d3.line()
        .x(function(d) {
          return that.scale().xScale(d.year)
        })
        .y(function(d) {
          return that.scale().yScale(d.sale)
        })
        .curve(d3.curveMonotoneX)
      return { line }
    },
    // 坐标系
    coordinates() {
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
        .call(d3.axisBottom(this.scale().xScale))
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.scale().yScale))
    },
    // 创建线条
    createLine(data) {
      this.g.append('path')
        .attr('class', 'line')
        .attr('d', this.line().line(data))
        .attr('transform', `translate(${this.margin.left + this.scale().xScale.bandwidth() / 2}, ${this.margin.top})`)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', '2')
    },
    // 创建原点
    createCircle(data) {
      console.log(data)
      const that = this
      this.g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('r', this.r)
        .attr('transform', (d) => {
          return `translate(${this.scale().xScale(d.year) + this.margin.left + this.scale().xScale.bandwidth() / 2}, ${this.scale().yScale(d.sale) + this.margin.top})`
        })
        .attr('fill', 'orange')
        .call(
          // 当前添加有margin 导致实际y 与 矩形y 不符
          d3.drag()
            .on('start', function() {
              d3.select(this)
                .attr('fill', 'green')
                .attr('r', that.r * 1 + 4)
              console.log('drag start...')
            })
            .on('drag', function(d, i) {
              // 拖拽
              let y = that.scale().yScale.invert(d3.event.y - that.margin.top).toFixed(0)
              y = Number(y)
              // 判断新值不能超过当前的范围
              if (y < 0) { y = 0 }
              if (y > d3.max(that.sale) * 1) {
                y = d3.max(that.sale)
              }
              that.dataset[i].sale = y
              d3.select(this)
                .attr('transform', function(d) {
                  return `translate(${that.scale().xScale(d.year) + that.margin.left + that.scale().xScale.bandwidth() / 2}, ${that.scale().yScale(d.sale) + that.margin.top})`
                })
              that.toRender()
              console.log('drag...')
            })
            .on('end', function() {
              d3.select(this)
                .attr('fill', 'orange')
                .attr('r', that.r)
              console.log('drag end...')
            })
        )
        .call(
          d3.zoom()
            .on('start', function() {
              console.log('zoom start...')
            })
            .on('zoom', function() {
              console.log(d3.event)
              d3.select(this)
                .attr('r', that.r + 4)
              console.log('zoom zoom...')
            })
            .on('end', function() {
              console.log('zoom end...')
            })
        )
    },
    // 创建文字
    createText(data) {
      const that = this
      this.g.selectAll('.text')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text')
        .attr('x', function(d) {
          return (that.scale().xScale(d.year) + that.margin.left + that.scale().xScale.bandwidth() / 2)
        })
        .attr('y', function(d) {
          return (that.scale().yScale(d.sale) + that.margin.top)
        })
        .attr('fill', 'red')
        .attr('dx', 0)
        .attr('dy', 0)
        .text(function(d) {
          return d.sale
        })
        .on('dblclick', (d, i) => { this.addForeignObject(d, i) })
    },
    // 渲染
    toRender() {
      // 修改原点的同时修改线段的值
      d3.selectAll('.line').remove()
      this.createLine(this.dataset)
      // 修改文字的值
      d3.selectAll('.text').remove()
      this.createText(this.dataset)
      // 原点
      d3.selectAll('.circle').remove()
      this.createCircle(this.dataset)
    },
    addForeignObject(d, i) {
      // 创建输入框
      this.g.append('foreignObject')
        .attr('id', i)
        .attr('width', this.scale().xScale.bandwidth() / 2)
        .attr('height', 35)
        .attr('x', this.scale().xScale(d.year) + this.margin.left + this.scale().xScale.bandwidth() / 2)
        .attr('y', this.scale().yScale(d.sale) + this.margin.top * 5 / 6)
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .append('input')
        .attr('class', 'input')
        .attr('id', `input${i}`)
        .attr('value', d.sale)
        .style('width', this.scale().xScale.bandwidth() / 2 + 'px')
        .style('font-size', '16px')
        .style('font-weight', 700)
        .on('change', () => { this.updateChange(d, i) })
    },
    updateChange(d, i) {
      // 获取value值
      let value = document.getElementById(`input${i}`).value
      value = Number(value)
      this.dataset[i].sale = value
      this.toRender()
      // 删除输入框
      document.getElementById(`${i}`).remove()
      d3.selectAll('.axis').remove()
      this.coordinates()
    }
  }
}
</script>

<style scoped>
  .input {
    font-size: 16px;
    font-weight: 700;
  }
  .text {
    font-size: 16px;
    font-weight: 800;
  }
</style>
