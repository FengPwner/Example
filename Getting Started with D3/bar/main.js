/**
 * D3 — Bar Chart
 *
 * Displays monthly sales figures as vertical rectangles.
 *
 * Key D3 concepts:
 *   • scaleBand    — maps discrete categories to evenly-spaced pixel bands
 *   • scaleLinear  — maps a continuous numeric domain to pixel heights
 *   • data().join()— enters one <rect> per datum, updating it on re-render
 *   • axisBottom / axisLeft — generate SVG axis tick marks and labels
 */

// --- Data ---------------------------------------------------------------
// Try changing values and refreshing — the scales adapt automatically.
var data = [
  { month: 'Jan', value: 420 },
  { month: 'Feb', value: 380 },
  { month: 'Mar', value: 510 },
  { month: 'Apr', value: 470 },
  { month: 'May', value: 640 },
  { month: 'Jun', value: 590 },
  { month: 'Jul', value: 720 },
  { month: 'Aug', value: 680 },
  { month: 'Sep', value: 530 },
  { month: 'Oct', value: 490 },
  { month: 'Nov', value: 610 },
  { month: 'Dec', value: 750 },
];

// --- Dimensions & margins -----------------------------------------------
// The margin convention reserves space around the inner plot area so that
// axes and labels are never clipped by the SVG boundary.
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
// scaleBand divides the range into equal bands, one per category.
// padding(0.2) leaves 20% of each band's width as whitespace between bars.
var xScale = d3.scaleBand()
  .domain(data.map(function(d) { return d.month; }))
  .range([0, width])
  .padding(0.2);

// scaleLinear maps the value domain to pixel heights.
// .nice() rounds the domain maximum up to a clean tick value.
// The range is inverted because SVG y=0 is at the top.
var yScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return d.value; })])
  .nice()
  .range([height, 0]);

// --- Gridlines (drawn before bars so they sit behind them) --------------
svg.append('g')
  .attr('class', 'grid')
  .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

// --- Bars ---------------------------------------------------------------
// .data(data).join('rect') is the modern D3 v5+ enter/update/exit pattern.
// It returns a selection of <rect> elements, one per datum.
svg.selectAll('.bar')
  .data(data)
  .join('rect')
    .attr('class', 'bar')
    .attr('x',      function(d) { return xScale(d.month); })
    .attr('y',      function(d) { return yScale(d.value); })
    .attr('width',  xScale.bandwidth())
    // Height = distance from the bar's top edge down to the baseline.
    .attr('height', function(d) { return height - yScale(d.value); });

// --- Axes ---------------------------------------------------------------
svg.append('g')
  .attr('class', 'axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale));

svg.append('g')
  .attr('class', 'axis')
  .call(d3.axisLeft(yScale));

// --- Axis labels --------------------------------------------------------
svg.append('text')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom - 4)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px').style('fill', '#6c757d')
  .text('Month');

svg.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -height / 2)
  .attr('y', -margin.left + 14)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px').style('fill', '#6c757d')
  .text('Sales ($)');
