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
      // .style('background-color', 'pink')
    this.width = this.svgWidth - this.padding.left - this.padding.right
    this.height = this.svgHeight - this.padding.top - this.padding.bottom
    // 2. 比例尺
    // d3.range()
    // console.log(d3.range(this.dataset.length))
    // const xScale = d3.scaleBand().domain(d3.range(this.dataset.length)).range([0, this.width]).padding(0.1)
    // const yScale = d3.scaleLinear().domain([0, d3.max(this.dataset)]).range([this.height, 0])
    // console.log('scaleBand....', this.scale().xScale(7))
    // 创建 g
    const that = this
    const g = svg.append('g')
      .attr('class', 'oneStep')
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`)
    // 3. 坐标轴  xy 轴
    g.append('g').attr('id', 'x').attr('transform', `translate(0, ${this.height})`).call(d3.axisBottom(this.scale().xScale))
    g.append('g').attr('id', 'y').attr('transform', `translate(0, 0)`).call(d3.axisLeft(this.scale().yScale))
    // 4. 矩形
    g.selectAll('rect')
      .data(this.dataset)
      .enter()
      .append('rect')
      .attr('class', 'rect')
      .attr('fill', 'steelblue')
      .attr('x', (d, i) => {
        return this.scale().xScale(i)
      })
      .attr('y', (d) => {
        return this.scale().yScale(d)
      })
      .attr('width', this.scale().xScale.bandwidth())
      .attr('height', (d) => { return this.height - this.scale().yScale(d) })
      .call(
        // 绑定拖拽事件
        d3.drag()
          .on('start', function() {
            console.log('drag start')
          })
          .on('drag', function(e, i) {
            // range=scale(domain) domain=scale.invert(range)
            let newValue = that.scale().yScale.invert(d3.event.y).toFixed(1)
            if (newValue > d3.max(that.dataset)) newValue = 100
            if (newValue < 0) newValue = 0

            that.dataset[i] = newValue
            that.updateChange(i)
            console.log('drag ing')
          })
          .on('end', function() {
            that.updateChange()
            console.log('drag end')
          })
      )
    // 5. 添加文字
    const text = g.selectAll('.text')
      .data(this.dataset)
      .enter()
      .append('text')
      .attr('class', 'text')
      .attr('x', (d, i) => {
        return this.scale().xScale(i)
      })
      .attr('y', (d) => {
        return this.scale().yScale(d)
      })
    text.attr('dx', (d, i) => {
      return (this.scale().xScale.bandwidth()) / 2
    })
      .attr('dy', -5)
      .attr('text-anchor', 'middle') // 对齐方式
      .text(function(d) {
        return d
      })
      .on('dblclick', (d, i) => { return this.dblclick(d, i) })

    // text.on('dblclick', (d, i) => {
    // console.log(d, i)
    // 添加元素？
    // this.$prompt('请输入邮箱', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //   inputErrorMessage: '邮箱格式不正确'
    // }).then(({ value }) => {
    //   this.$message({
    //     type: 'success',
    //     message: '你的邮箱是: ' + value
    //   })
    // }).catch(() => {
    //   this.$message({
    //     type: 'info',
    //     message: '取消输入'
    //   })
    // })
    // })
  },
  methods: {
    dblclick(d, i) {
      // const that = this
      console.log(d, i)
      d3.select('.oneStep')
        .append('foreignObject')
        .attr('x', this.scale().xScale(i))
        .attr('y', this.scale().yScale(d) - 30)
        .attr('id', i)
        .style('width', this.scale().xScale.bandwidth() + 'px')
        .style('height', '30px')
        .insert('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .insert('input')
        .attr('class', i)
        .attr('width', this.scale().xScale.bandwidth() - 5 + 'px')
        .attr('height', '24px')
        .attr('value', d)
        .style('placeholder', d)
        // .style('border-radius', '8px')
        // .style('border', '1px solid red')
        // .attr('autofocus', 'autofocus')
        // .style('font-size', '16px')
        // .style('font-weight', '700')
        .on('change', () => { this.updateChange(i) })
    },
    scale() {
      const xScale = d3.scaleBand()
        .domain(d3.range(this.dataset.length))
        .range([0, this.width])
        .padding(0.1)
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(this.dataset)])
        .range([this.height, 0])
      return {
        xScale,
        yScale
      }
    },
    updateChange(i) {
      if (document.getElementsByClassName(i).item(0) !== null) {
        this.dataset[i] = document.getElementsByClassName(i).item(0).value * 1
        document.getElementById(`${i}`).remove()
      }
      d3.selectAll('rect')
        .data(this.dataset)
        .attr('y', (d) => {
          return this.scale().yScale(d)
        })
        .attr('height', (x) => { return this.height - this.scale().yScale(x) })
      d3.selectAll('.text')
        .data(this.dataset)
        .attr('y', (z) => {
          return this.scale().yScale(z)
        })
        .text(function(h) {
          return h
        })
      // 移除 foreignObject 元素
      document.getElementById(`x`).remove()
      document.getElementById(`y`).remove()
      d3.select('.oneStep')
        .append('g')
        .attr('id', 'x')
        .attr('transform', `translate(0, ${this.height})`)
        .call(d3.axisBottom(this.scale().xScale))
      d3.select('.oneStep')
        .append('g')
        .attr('id', 'y')
        .attr('transform', `translate(0, 0)`)
        .call(d3.axisLeft(this.scale().yScale))
    }
  }
}
</script>
