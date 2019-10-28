<template>
  <div id="line" />
</template>

<script>
import * as d3 from 'd3'
export default {
  data() {
    return {
      width: 960,
      height: 500,
      r: 50,
      dataset: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.dataset = [
        [this.width / 2 - this.r, this.height / 2 - this.r],
        [this.width / 2 - this.r, this.height / 2 + this.r],
        [this.width / 2 + this.r, this.height / 2 - this.r],
        [this.width / 2 + this.r, this.height / 2 + this.r]
      ]
      // 创建svg
      const svg = d3.selectAll('#line')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .style('background-color', 'pink')
        .append('g')
      // 创建
      const that = this
      svg.selectAll('.circle')
        .data(this.dataset)
        .enter()
        .append('circle')
        .attr('r', this.r)
        .attr('transform', function(d) {
          console.log(d)
          return `translate(${d})`
        })
        .attr('fill', 'steelblue')
        .call(
          d3.drag()
            .on('drag', function() {
              const x = d3.event.x
              const y = d3.event.y
              if (that.inBoundaries(x, y)) {
                console.log(this)
                d3.select(this)
                  .attr('transform', function(d) {
                    return `translate(${x}, ${y})`
                  })
              }
            })
        )
    },
    // drag() {
    //   const drag = d3.drag()
    //     .on('drag', this.move)
    //   return { drag }
    // },
    // move(d) {
    //   const x = d3.event.x
    //   const y = d3.event.y
    //   if (this.inBoundaries(x, y)) {
    //     d3.select(this)
    //       .attr('transform', function(d) {
    //         return `translate(${x}, ${y})`
    //       })
    //   }
    // },
    inBoundaries(x, y) {
      return (x >= (0 + this.r) && x <= (this.width - this.r)) &&
       (y >= (0 + this.r) && y <= (this.height - this.r))
    }
  }
}
</script>
