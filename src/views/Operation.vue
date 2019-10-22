<template>
  <div id="operation">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
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
      dataset: [20, 80, 40, 100, 200, 60, 90, 150],
      width: 0,
      height: 0,
      model: [],
      vifText: [],
      vifInput: []
    }
  },
  mounted() {
    // 1. 创建画布
    const svg = d3.selectAll('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .style('background-color', 'pink')
    this.width = this.svgWidth - this.padding.left - this.padding.right
    this.height = this.svgHeight - this.padding.top - this.padding.bottom
    // 2. 比例尺
    // d3.range()
    // console.log(d3.range(this.dataset.length))
    const xScale = d3.scaleBand().domain(d3.range(this.dataset.length)).range([0, this.width]).padding(0.1)
    const yScale = d3.scaleLinear().domain([0, d3.max(this.dataset)]).range([this.height, 0])
    // 创建 g
    const g = svg.append('g')
      .attr('class', 'oneStep')
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`)
    // 3. 坐标轴  xy 轴
    g.append('g').attr('transform', `translate(0, ${this.height})`).call(d3.axisBottom(xScale))
    g.append('g').attr('transform', `translate(0, 0)`).call(d3.axisLeft(yScale))
    // 4. 矩形
    g.selectAll('rect')
      .data(this.dataset)
      .enter()
      .append('rect')
      .attr('fill', 'steelblue')
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', function(d) {
        return yScale(d)
      })
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => { return this.height - yScale(d) })

    // input
    g.append('foreignObject')
      .attr('width', xScale.bandwidth())
      .attr('height', 40)
      .append('body')
      .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      .selectAll('input')
      .data(this.dataset)
      .enter()
      .append('input')
      .attr('value', (d, i) => {
        return d
      })
    // 5. 添加文字
    const text = g.selectAll('.text')
      .data(this.dataset)
      .enter()
      .append('text')
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', function(d) {
        return yScale(d)
      })
    text.attr('dx', function(d, i) {
      return (xScale.bandwidth()) / 2
    })
      .attr('dy', -5)
      .attr('text-anchor', 'middle') // 对齐方式
      .text(function(d) {
        return d
      })
      .attr('v-if', () => {
        this.vifText.push(true)
        return 0 > 1
      })
      .on('dblclick', (d, i) => { return this.dblclick(d, i) })
    // g.append('foreignObject').append('input').attr('value', '456')

    // text.on('dblclick', (d, i) => {
    //   console.log(d, i)
    //   // 添加元素？
    //   // this.$prompt('请输入邮箱', '提示', {
    //   //   confirmButtonText: '确定',
    //   //   cancelButtonText: '取消',
    //   //   inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //   //   inputErrorMessage: '邮箱格式不正确'
    //   // }).then(({ value }) => {
    //   //   this.$message({
    //   //     type: 'success',
    //   //     message: '你的邮箱是: ' + value
    //   //   })
    //   // }).catch(() => {
    //   //   this.$message({
    //   //     type: 'info',
    //   //     message: '取消输入'
    //   //   })
    //   // })

    //   //   <foreignObject style="
    //   //     width: 80px;
    //   //     height: 50px;
    //   // "><div xmlns="http://www.w3.org/1999/xhtml"><input value="456"></div></foreignObject>
    //   const foreignObject = g.append('foreignObject')
    //     .attr('width', xScale.bandwidth())
    //     .attr('height', 60)
    //     // .style('background', 'skyblue')
    //   const div = foreignObject.append('body')
    //     .attr('xmlns', 'http://www.w3.org/2000/xhtml')
    //   div.append('input')
    //     .attr('value', '哈哈')
    // })
  },
  methods: {
    dblclick(d, i) {
      console.log(d, i)
      // this.$nextTick(() => {
      // d3.select('.oneStep').append('foreignObject')
      //   .style('width', '80px')
      //   .style('height', '40px')
      //   .insert('div')
      //   .attr('xmlns', 'http://www.w3.org/1999/xhtml')
      //   .insert('input')
      //   .attr('value', '哈哈')
      // })
    }
  }
}
</script>
