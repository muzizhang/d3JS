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
        top: 70,
        left: 70,
        bottom: 70,
        right: 30
      },
      name: [],
      label: [],
      width: 0,
      height: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 1. 创建画布
      const svg = d3.select('#drag')
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
      const g = svg.append('g').attr('class', 'oneStep')
      g.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
        .call(d3.axisBottom(this.scale().xScale))
      g.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.scale().yScale))
      // 标题文字
      const text = g.append('g')
        .attr('fill', 'red')
      text.append('text')
        .attr('id', 'title')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.margin.top / 2)
        .attr('dx', 0)
        .attr('dy', 0)
        .attr('text-anchor', 'middle')
        .text('这是一个标题')
      text.append('text')
        .attr('id', 'vertical')
        // .attr('x', this.margin.left / 4)
        // .attr('y', this.svgHeight / 2)
        .attr('transform', `translate(${this.margin.left / 2.5}, ${this.svgHeight / 2}) rotate(-90)`)
        .attr('dx', 0)
        .attr('dy', 0)
        .text('纵轴')
        .attr('fill', 'red')
      text.append('text')
        .attr('id', 'horizontal')
        .attr('x', this.svgWidth / 2)
        .attr('y', this.svgHeight - this.margin.bottom / 4)
        .attr('dx', 0)
        .attr('dy', 0)
        .text('横轴')
        .attr('fill', 'red')
      // 矩形
      g.selectAll('.rect')
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
      // 文字
      g.selectAll('.text')
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
        .attr('dx', 1)
        .attr('dy', 1)
        .text(function(d) {
          return d.label
        })
    },
    // 比例尺
    scale() {
      const xScale = d3.scaleBand()
        .domain(this.name)
        .rangeRound([0, this.width])
        .padding(0.1)
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(this.label)])
        .range([this.height, 0])
      return {
        xScale,
        yScale
      }
    }
  }
}
</script>
