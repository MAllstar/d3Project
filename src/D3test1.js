import React from 'react';
import * as d3 from "d3";

const data = [12, 5, 6, 6, 9, 10];

const w = 700;
const h = 200;
let svg;


class TestCharts extends React.Component {
  state = {

  };

  componentDidMount() {
    this.drawChart()
    this.update()
  }
//  关键在于把enter和渲染分开
  drawChart = ()=> {
    svg = d3.select(".D3")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
    svg.selectAll("text")
      .data(data)
      .enter()
      .append("text")

    this.renderChart()

    var x = d3.scaleTime()
    .domain([new Date(2000, 0, 1), new Date(2000, 0, 2)])
    .range([0, 960]);

    console.log(x(new Date(2000, 0, 1,  5))) // 200
    x(new Date(2000, 0, 1, 16)); // 640
    console.log(x.invert(200)) // Sat Jan 01 2000 05:00:00 GMT-0800 (PST)
    x.invert(640); // Sat Jan 01 2000 16:00:00 GMT-0800 (PST)
  }

  renderChart = () => {
    svg.selectAll("rect")
      .data(data)
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - 10 * d)
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "red")
    svg.selectAll("text")
      .data(data)
      .text((d) => d)
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => h - (10 * d) - 3)
  }

  update = () => {
    setInterval(()=>{
      data.shift();
      data.push(Math.round(Math.random() * 20));
      this.renderChart()
    },1000)
  }

  render() {
    return (
      <div>
        <div className="D3" />
      </div>
    );
  }
}

export default TestCharts;