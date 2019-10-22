<template>
  <div class="home">
    <p>Welcome to Your Vue.js App</p>
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
    />
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  mounted() {
    // 1. 添加画布
    const svgWidth = 800
    const svgHeight = 600
    const svg = d3.selectAll('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('background-color', 'pink')
    // 定义数据
    const dataset = [40, 80, 50, 60, 10, 100, 20, 70]
    const padding = { top: 20, left: 20, bottom: 20, right: 20 }
    const width = 800 - padding.left - padding.right
    const height = 600 - padding.top - padding.bottom
    // 添加坐标轴
    const g = svg.append('g').attr('transform', `translate(${padding.top}, ${padding.left})`)
    // xy比例尺
    // d3.range(dataset.length)  dataset 数组下标集合的一个数组
    const xScale = d3.scaleBand().domain(d3.range(dataset.length)).range([0, width]).padding(0.1)
    // let xScale = d3.scaleBand().domain(dataset).rangeRound([0, width]).padding(0.1)
    const yScale = d3.scaleLinear().domain([0, d3.max(dataset)]).range([height, 0])
    // xy轴
    g.append('g').attr('transform', `translate(10, ${height})`).call(d3.axisBottom(xScale))
    g.append('g').attr('transform', `translate(10, 0)`).call(d3.axisLeft(yScale).ticks(10))
    // 矩形
    g.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('fill', 'steelblue')
      .attr('x', function(d, i) {
        console.log('xScale====', xScale(d), d, i)
        return xScale(i) + 10
      })
      .attr('y', function(d) {
        console.log('yScale====', yScale(d))
        return yScale(d)
      })
      .attr('width', xScale.bandwidth())
      .attr('height', function(d) {
        return height - yScale(d)
      })
    g.selectAll('.MyText')
      .data(dataset)
      .enter()
      .append('text')
      .attr('x', function(d, i) {
        return xScale(i)
      })
      .attr('y', function(d) {
        return yScale(d)
      })
      .attr('dx', function() {
        console.log(xScale.bandwidth())
        return (xScale.bandwidth() - padding.left + 10) / 2
      })
      .attr('dy', function() {
        return -5
      })
      .text(function(d) {
        return d
      })
      .on('dblclick', function(d) {
        console.log('dblclick====', d)
      })
  }
}
</script>
