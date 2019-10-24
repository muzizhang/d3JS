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
      svg: '',
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
          'sale': '199',
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
      g: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.svg = d3.select('#line')
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
        .style('background-color', 'pink')
      this.width = this.svgWidth - this.margin.left - this.margin.right
      this.height = this.svgHeight - this.margin.top - this.margin.bottom
      // 坐标系
      this.g = this.svg.append('g').attr('class', 'oneStep')
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.height + this.margin.top})`)
        .call(d3.axisBottom(this.scale().xScale))
      this.g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        .call(d3.axisLeft(this.scale().yScale))
    },
    scale() {
      this.dataset.map((d) => {
        this.sale.push(d.sale)
        this.year.push(d.year)
      })
      // 比例尺
      const xScale = d3.scaleBand().domain(this.year).rangeRound([0, this.width]).padding(0.1)
      const yScale = d3.scaleLinear().domain([0, d3.max(this.sale)]).range([this.height, 0])
      return {
        xScale,
        yScale
      }
    }
  }
}
</script>
