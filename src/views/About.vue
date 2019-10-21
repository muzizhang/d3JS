<template>
  <div class="about">
    <h1>This is an about page</h1>
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
    const svgWidth = 800
    const svgHeight = 600
    // 1. 创建画布
    const svg = d3
      .select('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .style('background-color', 'pink')
    // 2. 给一个数据
    const dataArr = [
      {
        name: 'one', value: 32
      },
      {
        name: 'two', value: 36
      },
      {
        name: 'three', value: 40
      },
      {
        name: 'four', value: 44
      },
      {
        name: 'five', value: 48
      },
      {
        name: 'six', value: 52
      },
      {
        name: 'seven', value: 56
      },
      {
        name: 'eight', value: 60
      },
      {
        name: 'nine', value: 64
      }
    ]
    // 处理数据
    const nameArr = dataArr.map((item) => { return item.name })
    const valueArr = dataArr.map((item) => { return item.value })
    // 指定容器宽高
    const padding = { top: 20, right: 20, bottom: 20, left: 20 }
    const width = 800 - padding.left - padding.right
    const height = 600 - padding.top - padding.bottom
    // 创建 x y 轴比例尺
    // d3.scaleBand() 分段比例尺  比例缩放   rangeRound 范围
    const xScale = d3.scaleBand().domain(nameArr).rangeRound([0, width]).padding(0.1)
    const yScale = d3.scaleLinear().domain([0, d3.max(valueArr)]).range([height, 0])
    // 添加g标签
    const g = svg.append('g').attr('transform', `translate(${padding.top}, ${padding.left})`)
    // 创建 xy轴
    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .attr('font-weight', 'blod')
    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale).ticks(10))
    // 坐标轴完成
    // 创建柱子容器，方便绑定事件
    const chart = g.selectAll('bar').data(dataArr).enter().append('g')
    // rect
    chart.append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) {
        return xScale(d.name)
      })
      .attr('y', function(d) {
        return yScale(d.value)
      })
      .attr('width', xScale.bandwidth())
      .attr('height', function(d) {
        return height - yScale(d.value)
      })
      .attr('fill', 'steelblue')
    // 添加标题
    g.attr('class', 'title')
      .append('text')
      .attr('transform', `translate(${width / 2}, 20)`)
      .attr('text-anchor', 'middle')
      .attr('font-weight', '600')
      .text('最简单的柱状图')
      .attr('fill', '#666')
    // 事件交互
    chart.on('mouseover', function() {
      d3.select(this).attr('opacity', '0.7')
    }).on('mouseout', function() {
      d3.select(this).attr('opacity', '1')
    })
  }
}
</script>
