import { Component, createMemo, createEffect } from 'solid-js'
import * as d3 from 'd3';

export type BarPlotProps = {
  data: number[],
  margin: { top: number, right: number, bottom: number, left: number };
  width: number;
  height: number;
}

export type Margin = { left: number, right: number, top: number, bottom: number }

const renderBarPlot = (data: number[], containerRef: HTMLDivElement, margin: Margin, width: number, height: number): void => {
  console.info('Rendering BarPlot svg...')

  const svgWidth = width - margin.left - margin.right
  const svgHeight = height - margin.bottom - margin.top

  // Clear previous svg content before add new elements
  const divEl = d3.select(containerRef)
  divEl.selectAll("*").remove()

  // Create root container 
  const svgEl = divEl.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  // Add X axis
  var x = d3.scaleBand()
    .range([0, svgWidth])
    .domain(data.map((_d, i) => '' + i))
    .padding(0.2);

  svgEl.append("g")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 1.0])
    .range([svgHeight, 0]);

  svgEl.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(y))

  // Bars
  svgEl.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (_d, i) {
      const px = x('' + i)
      if (!px) { return px }
      return px + margin.left
    })
    .attr("y", function (d) { return y(d) + margin.top })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return svgHeight - y(d); })
    .attr("fill", "#69b3a2")
}

export const BarPlot: Component<BarPlotProps> = props => {
  let containerRef: HTMLDivElement
  createEffect(() => renderBarPlot(props.data, containerRef, props.margin, props.width, props.height))
  return <div ref={containerRef} />
}
