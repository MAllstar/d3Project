import React from 'react';
import * as d3 from "d3";

class D3test2 extends React.Component {
  constructor() {
    super()
    this._data = undefined
  }

  componentDidMount() {
    this.data()
    this.draw()
    this.update()
  }

  data() {
    
  }

  draw() {
    const margin = { top: 50, right: 50, bottom: 0, left: 50 }
    const width = 960 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const histHeight = height / 5

    const parseDate = d3.timeParse("%d-%b-%y");
    const formatDateIntoYear = d3.timeFormat("%Y")

    const startDate = new Date("2004-11-01")
    const endDate = new Date("2017-04-01")

    const dateArray = d3.timeYears(startDate, d3.timeYear.offset(endDate, 1))
    const colours = d3.scaleOrdinal()
                      .domain(dateArray)
                      .range(['#ffc388', '#ffb269', '#ffa15e', '#fd8f5b', '#f97d5a', '#f26c58', '#e95b56', '#e04b51', '#d53a4b', '#c92c42', '#bb1d36', '#ac0f29', '#9c0418', '#8b0000'])
    // x scale for time
    const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, width])
      .clamp(true)

    // y scale for histogram
    const y = d3.scaleLinear()
      .range([histHeight, 0])

    ////////// histogram set up //////////

    // set parameters for histogram
    const histogram = d3.histogram()
      .value(function (d) { return d.date; })
      .domain(x.domain())
      .thresholds(x.ticks(d3.timeYear))

    const svg = d3.select(".D3")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    const hist = svg.append("g")
      .attr("class", "histogram")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    ////////// plot set up //////////

    let dataset
    const plot = svg.append("g")
      .attr("class", "plot")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // ////////// load data //////////

    d3.csv("./histogram.csv").then(data => prepare(data)).then(function (data) {
      console.log(data)
      // group data for bars
      const bins = histogram(data);
      console.log(bins)
      // y domain based on binned data
      y.domain([0, d3.max(bins, function (d) { return d.length; })]);

      const bar = hist.selectAll(".bar")
        .data(bins)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
          return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        });

      bar.append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return histHeight - y(d.length); })
        .attr("fill", function (d) { return colours(d.x0); });

      bar.append("text")
        .attr("dy", ".75em")
        .attr("y", "6")
        .attr("x", function (d) { return (x(d.x1) - x(d.x0)) / 2; })
        .attr("text-anchor", "middle")
        .text(function (d) { if (d.length > 15) { return d.length; } })
        .style("fill", "white");

      dataset = data;
      drawPlot(dataset);
    })

    ////////// slider //////////

    let currentValue = 0;

    const slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + (margin.top + histHeight + 5) + ")");

    slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-inset")
      .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
      .attr("class", "track-overlay")
      .call(d3.drag()
        .on("start.interrupt", function () { slider.interrupt(); })
        .on("start drag", function () {
          currentValue = d3.event.x;
          update(x.invert(currentValue));
        })
      );

    slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x)
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(function (d) { return formatDateIntoYear(d); });

    const handle = slider.insert("circle", ".track-overlay")
      .attr("class", "handle")
      // 半径
      .attr("r", 9);

    function drawPlot(data) {
      const locations = plot.selectAll(".location")
        .data(data, function (d) { return d.id; });

      // if filtered dataset has more circles than already existing, transition new ones in
      locations.enter()
        .append("circle")
        .attr("class", "location")
        .attr("cx", function (d) { return x(d.date); })
        .attr("cy", function (d) { return Math.random() * ((height / 2 + 50) - (height / 2 - 50)) + (height / 2 - 50); })
        .style("fill", function (d) { return colours(d3.timeYear(d.date)); })
        .style("stroke", function (d) { return colours(d3.timeYear(d.date)); })
        .style("opacity", 0.3)
        .attr("r", 5)
        .transition()
        .duration(400)
        .attr("r", 15)
        .transition()
        .attr("r", 5);

      // if filtered dataset has less circles than already existing, remove excess
      locations.exit()
        .remove();
    }

    function update(h) {
      handle.attr("cx", x(h));

      // filter data set and redraw plot
      const newData = dataset.filter(function (d) {
        return d.date < h;
      })
      drawPlot(newData);

      // histogram bar colours
      d3.selectAll(".bar")
        .attr("fill", function (d) {
          if (d.x0 < h) {
            return colours(d.x0);
          } else {
            return "#eaeaea";
          }
        })
    }

    function prepare(data) {
      return data.map(d => {
        d.date = parseDate(d.date)
        d.value = +d.value
        return d
      })
    }

  };

  update() {

  }


  render() {
    return (
      <div>
        <div className="D3" />

      </div>
    );
  }
}

export default D3test2;