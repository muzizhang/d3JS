<template>
  <div id="drag" />
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      dataset: [
        {
          name: '蛋白质',
          label: 80
        },
        {
          name: '血小板',
          label: 100
        },
        {
          name: '低分子物质',
          label: 500
        },
        {
          name: '红细胞',
          label: 200
        },
        {
          name: '白细胞',
          label: 150
        },
        {
          name: '染色体',
          label: 400
        },
        {
          name: '基因',
          label: 23
        }
      ],
      svgWidth: 800,
      svgHeight: 600,
      margin: {
        top: 100,
        left: 100,
        bottom: 100,
        right: 30
      },
      name: [],
      label: [],
      width: 0,
      height: 0,
      g: '',
      text: '',
      svg: '',
      inputWidth: 200,
      inputHeight: 30
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 1. 创建画布
      this.svg = d3.select('#drag')
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .style('background-color', 'pink')
      this.width = this.svgWidth - this.margin.left - this.margin.right
      this.height = this.svgHeight - this.margin.top - this.margin.bottom
      // 2. 坐标轴
      this.dataset.map((d) => {
        this.name.push(d.name)
        this.label.push(d.label)
      })
      this.g = (this.svg).append('g').attr('class', 'oneStep')
      console.log(d3.axisBottom(this.scale().xScale))
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
        .call(d3.axisBottom(this.scale().xScale))
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.scale().yScale))
      // 标题文字
      this.text = (this.g).append('g').attr('fill', 'red')
      this.text.append('text')
        .attr('id', 'title')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.margin.top / 2)
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('text-anchor', 'middle')
        .text('这是一个标题')
        .on('dblclick', () => { this.title('title') })
      this.text.append('text')
        .attr('id', 'vertical')
        .attr('transform', `translate(${(this.margin.left - this.inputHeight) / 2}, ${(this.svgHeight - this.inputHeight) / 2}) rotate(-90)`)
        .attr('dx', 0)
        .attr('dy', 0)
        .text('纵轴')
        .attr('fill', 'red')
        .on('dblclick', () => { this.title('vertical') })
      this.text.append('text')
        .attr('id', 'horizontal')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.svgHeight - this.margin.bottom * 2 / 5)
        .attr('dx', 0)
        .attr('dy', 0)
        .text('横轴')
        .attr('fill', 'red')
        .on('dblclick', () => { this.title('horizontal') })
      // 矩形
      const that = this
      this.g.selectAll('.rect')
        .data(this.dataset)
        .enter()
        .append('rect')
        .attr('class', 'rect')
        .attr('fill', 'steelblue')
        .attr('x', (d, i) => {
          return this.scale().xScale(d.name) + this.margin.left
        })
        .attr('y', (d) => {
          return this.scale().yScale(d.label) + this.margin.top
        })
        .attr('width', this.scale().xScale.bandwidth())
        .attr('height', (d) => {
          return this.height - this.scale().yScale(d.label)
        })
        .call(
        // 绑定拖拽事件
          d3.drag()
            .on('start', function() {
              console.log('drag start')
              // 清除所有输入框
              d3.selectAll('foreignObject').remove()
            })
            .on('drag', function(d, i) {
              let newValue = Number(that.scale().yScale.invert(d3.event.y - that.margin.top).toFixed(0))
              if (newValue > d3.max(that.label)) newValue = d3.max(that.label)
              if (newValue < 0) newValue = 0
              that.dataset[i].label = newValue
              that.toRender(i)
              console.log('drag ing')
            })
            .on('end', function(d, i) {
              that.toRender(i)
              console.log('drag end')
            })
        )
      // 文字
      this.g.selectAll('.text')
        .data(this.dataset)
        .enter()
        .append('text')
        .attr('class', 'text')
        .attr('x', (d, i) => {
          return this.scale().xScale(d.name) + this.margin.left
        })
        .attr('y', (d) => {
          return this.scale().yScale(d.label) + this.margin.top
        })
        .attr('dx', this.scale().xScale.bandwidth() / 2 - 10)
        .attr('dy', -10)
        .style('font-weight', '700')
        .text(function(d) {
          return d.label
        })
        .on('dblclick', (d, i) => { this.showInput(d, i) })
    },
    showInput(d, i) {
      // 显示input 输入框
      this.g.append('foreignObject')
        .attr('id', i)
        .attr('width', this.scale().xScale.bandwidth())
        .attr('height', 35)
        .attr('x', this.scale().xScale(d.name) + this.margin.left)
        .attr('y', this.scale().yScale(d.label) + this.margin.top * 3.5 / 5)
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .append('input')
        .attr('class', 'input' + i)
        .attr('value', d.label)
        .style('width', this.scale().xScale.bandwidth() + 'px')
        .style('font-weight', '700')
        .style('font-size', '16px')
        .attr('autofocus', 'true')
        .on('change', () => { this.updateValue(i) })
    },
    updateValue(i) {
      // 获取输入框中修改的值
      const value = document.getElementsByClassName(`input${i}`).item(0).value
      this.dataset[i].label = value * 1
      // 重新渲染数据
      this.toRender(i)
      document.getElementById(`${i}`).remove()
    },
    toRender(i) {
      this.name = []
      this.label = []
      this.dataset.map((d) => {
        this.name.push(d.name)
        this.label.push(d.label)
      })
      // 重新渲染数据
      this.g.selectAll('.rect')
        .data(this.dataset)
        .attr('height', (d, i) => { return this.height - this.scale().yScale(d.label) })
        .attr('y', (d) => {
          return this.scale().yScale(d.label) + this.margin.top
        })
      this.g.selectAll('.text')
        .data(this.dataset)
        .attr('y', (d) => {
          return this.scale().yScale(d.label) + this.margin.top
        })
        .text(function(d) {
          return d.label
        })
      // 移除输入框
      this.g.selectAll('.axis').remove()
      // 重新渲染坐标轴
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
        .call(d3.axisBottom(this.scale().xScale))
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.scale().yScale))
    },
    // 比例尺
    scale() {
      const xScale = d3.scaleBand()
        .domain(this.name)
        .range([0, this.width])
        .padding(0.1)
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(this.label)])
        .range([this.height, 0])
      return {
        xScale,
        yScale
      }
    },
    title(id) {
      const title = document.getElementById(id).innerHTML
      const that = this
      // 添加一个文本输入框
      let input = this.g.append('foreignObject')
      if (id === 'horizontal') {
        input = input.attr('x', (this.svgWidth - this.inputWidth) / 2)
          .attr('y', this.svgHeight - this.margin.bottom + (this.margin.bottom - this.inputHeight) / 2)
      } else if (id === 'vertical') {
        console.log((this.svgHeight - this.inputWidth) / 2)
        input = input.attr('transform', `translate(${(this.margin.left - this.inputHeight) / 2 - 12}, ${(this.svgHeight - this.inputWidth) / 2 + this.inputWidth}) rotate(-90)`)
      } else {
        input = input.attr('x', (this.svgWidth - this.inputWidth) / 2)
          .attr('y', (this.margin.top - this.inputHeight) / 2)
      }
      input.attr('width', this.inputWidth)
        .attr('height', this.inputHeight)
        .append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .append('input')
        .attr('class', `${id}Input`)
        .attr('value', title)
        .style('height', (this.inputHeight - 4) + 'px')
        .style('width', this.inputWidth + 'px')
        .style('font-size', '16px')
        .style('font-weight', '700')
        .style('padding-left', '10px')
        .on('change', function() {
          // 获取输入框中的值
          const value = document.getElementsByClassName(`${id}Input`).item(0).value
          that.text.select(`#${id}`).text(value)
          d3.selectAll('foreignObject').remove()
        })
    }
  }
}
</script>
