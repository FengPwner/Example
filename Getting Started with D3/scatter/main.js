/**
 * D3 — Scatter Plot
 *
 * Shows the relationship between study hours, exam score, and number of
 * practice tests (encoded as circle radius).
 *
 * Key D3 concepts:
 *   • scaleLinear  — maps a continuous numeric domain to pixel positions
 *   • scaleSqrt    — maps value to circle *area* for perceptual accuracy
 *   • data().join()— the modern enter/update/exit data-join pattern
 *   • <title>      — native browser tooltip, no extra library required
 */

// --- Data ---------------------------------------------------------------
// Each student record has:
//   hours  — hours studied per week  (x-axis)
//   score  — exam score out of 100   (y-axis)
//   tests  — practice tests taken    (circle radius)
var data = [
  { hours:  2, score: 48, tests: 1 },
  { hours:  3, score: 55, tests: 2 },
  { hours:  4, score: 60, tests: 1 },
  { hours:  5, score: 63, tests: 3 },
  { hours:  6, score: 70, tests: 2 },
  { hours:  7, score: 72, tests: 4 },
  { hours:  8, score: 78, tests: 3 },
  { hours:  9, score: 81, tests: 5 },
  { hours: 10, score: 85, tests: 4 },
  { hours: 11, score: 87, tests: 6 },
  { hours: 12, score: 90, tests: 5 },
  { hours: 13, score: 88, tests: 7 },
  { hours: 14, score: 93, tests: 6 },
  { hours: 16, score: 95, tests: 8 },
  { hours: 18, score: 97, tests: 9 },
  { hours:  4, score: 52, tests: 0 },
  { hours:  7, score: 65, tests: 1 },
  { hours: 10, score: 79, tests: 2 },
];

// --- Dimensions & margins -----------------------------------------------
// The margin convention reserves space around the inner plot area so that
// axes and labels are never clipped by the SVG boundary.
var margin = { top: 15, right: 15, bottom: 45, left: 45 };
var width  = 300 - margin.left - margin.right;
var height = 300 - margin.top  - margin.bottom;

// --- SVG canvas ---------------------------------------------------------
// viewBox makes the chart scale to fill its container width while
// preserving the aspect ratio defined above.
var svg = d3.select('#chart')
  .append('svg')
    .attr('viewBox', '0 0 300 300')
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// --- Scales -------------------------------------------------------------
var xScale = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return d.hours; }) + 1])
  .range([0, width]);

var yScale = d3.scaleLinear()
  .domain([40, 100])
  .range([height, 0]);  // SVG y=0 is at the top, so we invert the range

// scaleSqrt maps value to circle *area* (not radius), which makes size
// differences look proportional to the eye.
var rScale = d3.scaleSqrt()
  .domain([0, d3.max(data, function(d) { return d.tests; })])
  .range([4, 18]);

// --- Gridlines (drawn before data so they appear behind) ----------------
svg.append('g')
  .attr('class', 'grid')
  .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

svg.append('g')
  .attr('class', 'grid')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''));

// --- Circles ------------------------------------------------------------
// .data(data).join('circle') is the modern D3 v5+ enter/update/exit pattern.
// <title> adds a native browser tooltip — hover over any circle to see it.
svg.selectAll('.dot')
  .data(data)
  .join('circle')
    .attr('class', 'dot')
    .attr('cx', function(d) { return xScale(d.hours); })
    .attr('cy', function(d) { return yScale(d.score); })
    .attr('r',  function(d) { return rScale(d.tests); })
  .append('title')
    .text(function(d) {
      return d.hours + 'h studied — score: ' + d.score +
             ' — ' + d.tests + ' practice test(s)';
    });

// --- Axes ---------------------------------------------------------------
svg.append('g')
  .attr('class', 'axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(d3.axisBottom(xScale).ticks(8));

svg.append('g')
  .attr('class', 'axis')
  .call(d3.axisLeft(yScale));

// --- Axis labels --------------------------------------------------------
svg.append('text')
  .attr('x', width / 2)
  .attr('y', height + margin.bottom - 8)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('fill', '#6c757d')
  .text('Study hours per week');

svg.append('text')
  .attr('transform', 'rotate(-90)')
  .attr('x', -height / 2)
  .attr('y', -margin.left + 14)
  .attr('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('fill', '#6c757d')
  .text('Exam score (/ 100)');

