/**
 * D3 — Line Chart
 *
 * Plots monthly temperatures as a smooth connected line with an area fill.
 *
 * Key D3 concepts:
 *   d3.timeParse   — converts a date string into a JavaScript Date object
 *   scaleTime      — like scaleLinear but understands Date values
 *   d3.line()      — path generator for the SVG "d" attribute
 *   d3.area()      — like line() but closes a filled region below the line
 *   curveMonotoneX — smooth interpolation that never overshoots data points
 *   datum()        — binds the whole array as one value (vs data() per element)
 */

// --- Data ---------------------------------------------------------------
var parseDate = d3.timeParse('%Y-%m-%d');

var data = [
  { date: '2024-01-01', temp:  4 },
  { date: '2024-02-01', temp:  6 },
  { date: '2024-03-01', temp: 11 },
  { date: '2024-04-01', temp: 15 },
  { date: '2024-05-01', temp: 19 },
  { date: '2024-06-01', temp: 23 },
  { date: '2024-07-01', temp: 26 },
  { date: '2024-08-01', temp: 25 },
  { date: '2024-09-01', temp: 21 },
  { date: '2024-10-01', temp: 15 },
  { date: '2024-11-01', temp:  9 },
  { date: '2024-12-01', temp:  5 },
].map(function(d) { return { date: parseDate(d.date), temp: d.temp }; });

// --- Dimensions & margins -----------------------------------------------
var margin = { top: 15, right: 15, bottom: 40, left: 45 };
var width  = 300 - margin.left - margin.right;
var height = 300 - margin.top  - margin.bottom;

// --- SVG canvas ---------------------------------------------------------
var svg = d3.select('#chart')
  .append('svg')
    .attr('viewBox', '0 0 300 300')
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// --- Scales -------------------------------------------------------------
// d3.extent returns [min, max] of the array — a tidy way to set the domain.
var xScale = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.date; }))
  .range([0, width]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return d.temp; }) + 2])
  .range([height, 0]);

// --- Gridlines ----------------------------------------------------------
svg.append('g').attr('class', 'grid')
  .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

// --- Area fill ----------------------------------------------------------
// y0 is the baseline (bottom of chart); y1 is the data value.
var area = d3.area()
  .x(function(d) { return xScale(d.date); })
  .y0(height)
  .y1(function(d) { return yScale(d.temp); })
  .curve(d3.curveMonotoneX);

svg.append('path').datum(data).attr('class', 'area-path').attr('d', area);

// --- Line ---------------------------------------------------------------
var line = d3.line()
  .x(function(d) { return xScale(d.date); })
  .y(function(d) { return yScale(d.temp); })
  .curve(d3.curveMonotoneX);

svg.append('path').datum(data).attr('class', 'line-path').attr('d', line);

// --- Dots ---------------------------------------------------------------
svg.selectAll('.line-dot').data(data).join('circle')
  .attr('class', 'line-dot')
  .attr('cx', function(d) { return xScale(d.date); })
  .attr('cy', function(d) { return yScale(d.temp); })
  .attr('r', 4);

// --- Axes ---------------------------------------------------------------
svg.append('g').attr('class', 'axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b')));

svg.append('g').attr('class', 'axis').call(d3.axisLeft(yScale));

// --- Axis labels --------------------------------------------------------
svg.append('text')
  .attr('x', width / 2).attr('y', height + margin.bottom - 4)
  .attr('text-anchor', 'middle').style('font-size', '12px').style('fill', '#6c757d')
  .text('Month (2024)');

svg.append('text')
  .attr('transform', 'rotate(-90)').attr('x', -height / 2).attr('y', -margin.left + 14)
  .attr('text-anchor', 'middle').style('font-size', '12px').style('fill', '#6c757d')
  .text('Avg. Temp (°C)');
