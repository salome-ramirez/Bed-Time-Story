var dataFolder = 'Data_files/';

// children

function drawChildrenDist() {
  var data = [
    { label: 'Getting enough sleep', pct: 62.5 },
    { label: 'Not getting enough sleep', pct: 37.5 }
  ];

  var el = document.querySelector('#chart-children-dist');
  var mt = 20, mr = 20, mb = 40, ml = 40;
  var w = el.clientWidth - ml - mr;
  var h = 200 - mt - mb;

  var svg = d3.select('#chart-children-dist').append('svg')
    .attr('width', w + ml + mr).attr('height', h + mt + mb)
    .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

  var x = d3.scaleBand().domain(data.map(d => d.label)).range([0, w]).padding(0.4);
  var y = d3.scaleLinear().domain([0, 100]).range([h, 0]);

  svg.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
    .call(g => g.select('.domain').remove());

  svg.selectAll('rect').data(data).join('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.label)).attr('y', d => y(d.pct))
    .attr('width', x.bandwidth()).attr('height', d => h - y(d.pct))
    .attr('fill', (d, i) => i === 0 ? '#c4bfb8' : '#4a7fb5');

  svg.selectAll('.lbl').data(data).join('text')
    .attr('x', d => x(d.label) + x.bandwidth() / 2)
    .attr('y', d => y(d.pct) - 6)
    .attr('text-anchor', 'middle').attr('font-size', 12)
    .attr('fill', '#555').attr('font-family', 'sans-serif')
    .text(d => d.pct + '%');

  svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove());
}

// children lollipop
function drawChildrenLollipop() {
  d3.csv(dataFolder + 'children_short_sleep_by_condition.csv', d3.autoType).then(function(data) {
    data.sort((a, b) => b.pct_short_sleep - a.pct_short_sleep);

    var el = document.querySelector('#chart-children');
    var mt = 10, mr = 60, mb = 20, ml = 230;
    var w = el.clientWidth - ml - mr;
    var h = data.length * 42;

    var svg = d3.select('#chart-children').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleLinear().domain([28, 52]).range([0, w]);
    var y = d3.scaleBand().domain(data.map(d => d.condition)).range([0, h]).padding(0.4);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisBottom(x).tickSize(h).tickFormat(''))
      .call(g => g.select('.domain').remove());

    // lines
    svg.selectAll('.lollipop-line').data(data).join('line')
      .attr('x1', x(28)).attr('x2', d => x(d.pct_short_sleep))
      .attr('y1', d => y(d.condition) + y.bandwidth() / 2)
      .attr('y2', d => y(d.condition) + y.bandwidth() / 2)
      .attr('stroke', '#c4bfb8').attr('stroke-width', 2);

    // circles
    svg.selectAll('.lollipop-dot').data(data).join('circle')
      .attr('cx', d => x(d.pct_short_sleep))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 8)
      .attr('fill', d => d.condition === 'No diagnosis' ? '#c4bfb8' : '#4a7fb5');

    // value labels
    svg.selectAll('.val').data(data).join('text')
      .attr('x', d => x(d.pct_short_sleep) + 14)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif')
      .text(d => d.pct_short_sleep + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + '%'))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove());
  });
}

// teenagers

function drawTeenDist() {
  var data = [
    { label: 'Getting enough sleep', pct: 23 },
    { label: 'Not getting enough sleep', pct: 77 }
  ];

  var el = document.querySelector('#chart-teen-dist');
  var mt = 20, mr = 20, mb = 40, ml = 40;
  var w = el.clientWidth - ml - mr;
  var h = 200 - mt - mb;

  var svg = d3.select('#chart-teen-dist').append('svg')
    .attr('width', w + ml + mr).attr('height', h + mt + mb)
    .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

  var x = d3.scaleBand().domain(data.map(d => d.label)).range([0, w]).padding(0.4);
  var y = d3.scaleLinear().domain([0, 100]).range([h, 0]);

  svg.append('g').attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
    .call(g => g.select('.domain').remove());

  svg.selectAll('rect').data(data).join('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.label)).attr('y', d => y(d.pct))
    .attr('width', x.bandwidth()).attr('height', d => h - y(d.pct))
    .attr('fill', (d, i) => i === 0 ? '#c4bfb8' : '#7b5ea7');

  svg.selectAll('.lbl').data(data).join('text')
    .attr('x', d => x(d.label) + x.bandwidth() / 2)
    .attr('y', d => y(d.pct) - 6)
    .attr('text-anchor', 'middle').attr('font-size', 12)
    .attr('fill', '#555').attr('font-family', 'sans-serif')
    .text(d => d.pct + '%');

  svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').remove());
}

// teen slope
function drawTeenSlope() {
  d3.csv(dataFolder + 'yrbs_sleep_mental_health.csv', d3.autoType).then(function(data) {
    var el = document.querySelector('#chart-teenagers');
    var mt = 30, mr = 120, mb = 20, ml = 120;
    var w = el.clientWidth - ml - mr;
    var h = 300 - mt - mb;

    var svg = d3.select('#chart-teenagers').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var y = d3.scaleLinear().domain([0, 55]).range([h, 0]);

    var colors = ['#7b5ea7', '#c0622f', '#3a9e8f'];

    // column labels
    svg.append('text').attr('x', 0).attr('y', -12)
      .attr('text-anchor', 'middle').attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif')
      .text('Not enough sleep');

    svg.append('text').attr('x', w).attr('y', -12)
      .attr('text-anchor', 'middle').attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif')
      .text('Enough sleep');

    data.forEach(function(d, i) {
      var color = colors[i];

      // slope line
      svg.append('line')
        .attr('x1', 0).attr('x2', w)
        .attr('y1', y(d.pct_insufficient_sleep))
        .attr('y2', y(d.pct_sufficient_sleep))
        .attr('stroke', color).attr('stroke-width', 2).attr('opacity', 0.7);

      // left dot + label
      svg.append('circle')
        .attr('cx', 0).attr('cy', y(d.pct_insufficient_sleep))
        .attr('r', 7).attr('fill', color);

      svg.append('text')
        .attr('x', -10).attr('y', y(d.pct_insufficient_sleep))
        .attr('dy', '0.35em').attr('text-anchor', 'end')
        .attr('font-size', 11).attr('fill', '#555').attr('font-family', 'sans-serif')
        .text(d.pct_insufficient_sleep + '%');

      // right dot + label
      svg.append('circle')
        .attr('cx', w).attr('cy', y(d.pct_sufficient_sleep))
        .attr('r', 7).attr('fill', color);

      svg.append('text')
        .attr('x', w + 10).attr('y', y(d.pct_sufficient_sleep))
        .attr('dy', '0.35em').attr('text-anchor', 'start')
        .attr('font-size', 11).attr('fill', '#555').attr('font-family', 'sans-serif')
        .text(d.pct_sufficient_sleep + '%');

      // indicator label on right
      svg.append('text')
        .attr('x', w + 46).attr('y', y(d.pct_sufficient_sleep))
        .attr('dy', '0.35em').attr('text-anchor', 'start')
        .attr('font-size', 10).attr('fill', color).attr('font-family', 'sans-serif')
        .text(d.indicator);
    });
  });
}

// young adults

function drawYoungAdultDist() {
  d3.csv(dataFolder + 'nhanes_sleep_habits.csv', d3.autoType).then(function(data) {
    var d = data.find(r => r.age_group === '18-25');
    var chartData = [
      { label: 'Getting enough sleep', pct: d.pct_adequate },
      { label: 'Not getting enough sleep', pct: d.pct_short }
    ];

    var el = document.querySelector('#chart-young-adult-dist');
    var mt = 20, mr = 20, mb = 40, ml = 40;
    var w = el.clientWidth - ml - mr;
    var h = 200 - mt - mb;

    var svg = d3.select('#chart-young-adult-dist').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleBand().domain(chartData.map(d => d.label)).range([0, w]).padding(0.4);
    var y = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
      .call(g => g.select('.domain').remove());

    svg.selectAll('rect').data(chartData).join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label)).attr('y', d => y(d.pct))
      .attr('width', x.bandwidth()).attr('height', d => h - y(d.pct))
      .attr('fill', (d, i) => i === 0 ? '#c4bfb8' : '#3a9e8f');

    svg.selectAll('.lbl').data(chartData).join('text')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.pct) - 6)
      .attr('text-anchor', 'middle').attr('font-size', 12)
      .attr('fill', '#555').attr('font-family', 'sans-serif')
      .text(d => d.pct + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove());
  });
}

// young adults lollipop
function drawYoungAdultLollipop() {
  d3.csv(dataFolder + 'nhanes_prevalence_by_sleep.csv', d3.autoType).then(function(raw) {
    var ag = raw.filter(d => d.age_group === '18-25');
    var short = ag.find(d => d.sleep_status === 'short');
    var adequate = ag.find(d => d.sleep_status === 'adequate');

    var data = [
      { condition: 'Obesity', short: short.pct_obesity, adequate: adequate.pct_obesity },
      { condition: 'Prediabetes or diabetes', short: short.pct_prediabetes, adequate: adequate.pct_prediabetes },
      { condition: 'Hypertension', short: short.pct_hypertension, adequate: adequate.pct_hypertension }
    ];

    var el = document.querySelector('#chart-ya-health');
    var mt = 20, mr = 80, mb = 50, ml = 190;
    var w = el.clientWidth - ml - mr;
    var h = data.length * 70;

    var svg = d3.select('#chart-ya-health').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleLinear().domain([0, 55]).range([0, w]);
    var y = d3.scaleBand().domain(data.map(d => d.condition)).range([0, h]).padding(0.4);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisBottom(x).tickSize(h).tickFormat(''))
      .call(g => g.select('.domain').remove());

    // connecting line between adequate and short
    svg.selectAll('.conn').data(data).join('line')
      .attr('x1', d => x(d.adequate)).attr('x2', d => x(d.short))
      .attr('y1', d => y(d.condition) + y.bandwidth() / 2)
      .attr('y2', d => y(d.condition) + y.bandwidth() / 2)
      .attr('stroke', '#ddd').attr('stroke-width', 2);

    // adequate dot
    svg.selectAll('.dot-adequate').data(data).join('circle')
      .attr('cx', d => x(d.adequate))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 9).attr('fill', '#c4bfb8');

    // short sleep dot
    svg.selectAll('.dot-short').data(data).join('circle')
      .attr('cx', d => x(d.short))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 9).attr('fill', '#3a9e8f');

    // labels on short dot
    svg.selectAll('.val-short').data(data).join('text')
      .attr('x', d => x(d.short) + 14)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('font-size', 11)
      .attr('fill', '#3a9e8f').attr('font-family', 'sans-serif')
      .text(d => d.short + '%');

    svg.selectAll('.val-adequate').data(data).join('text')
      .attr('x', d => x(d.adequate) - 14)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('text-anchor', 'end').attr('font-size', 11)
      .attr('fill', '#999').attr('font-family', 'sans-serif')
      .text(d => d.adequate + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + '%'))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove());

    // legend
    var leg = svg.append('g').attr('transform', 'translate(0,' + (h + 32) + ')');
    leg.append('circle').attr('r', 7).attr('fill', '#3a9e8f');
    leg.append('text').attr('x', 12).attr('y', 4).attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif').text('Short sleep (<7 hrs)');
    leg.append('circle').attr('cx', 160).attr('r', 7).attr('fill', '#c4bfb8');
    leg.append('text').attr('x', 172).attr('y', 4).attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif').text('Adequate sleep (≥7 hrs)');
  });
}

// young adults depression
function drawYADepression() {
  d3.csv(dataFolder + 'brfss_depression_by_age.csv', d3.autoType).then(function(data) {
    var el = document.querySelector('#chart-ya-depression');
    var mt = 30, mr = 60, mb = 40, ml = 56;
    var w = el.clientWidth - ml - mr;
    var h = 260 - mt - mb;

    var svg = d3.select('#chart-ya-depression').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scalePoint().domain(data.map(d => d.age_group)).range([0, w]).padding(0.3);
    var y = d3.scaleLinear().domain([10, 32]).range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
      .call(g => g.select('.domain').remove());

    var line = d3.line()
      .x(d => x(d.age_group))
      .y(d => y(d.pct_depression))
      .curve(d3.curveMonotoneX);

    svg.append('path').datum(data)
      .attr('fill', 'none').attr('stroke', '#3a9e8f')
      .attr('stroke-width', 2.5).attr('d', line);

    svg.selectAll('circle').data(data).join('circle')
      .attr('cx', d => x(d.age_group))
      .attr('cy', d => y(d.pct_depression))
      .attr('r', d => d.age_group === '18-24' ? 10 : 7)
      .attr('fill', d => d.age_group === '18-24' ? '#3a9e8f' : '#c4bfb8')
      .attr('stroke', '#fff').attr('stroke-width', 1.5);

    svg.selectAll('.lbl').data(data).join('text')
      .attr('x', d => x(d.age_group))
      .attr('y', d => y(d.pct_depression) - 14)
      .attr('text-anchor', 'middle').attr('font-size', 11)
      .attr('fill', d => d.age_group === '18-24' ? '#3a9e8f' : '#999')
      .attr('font-family', 'sans-serif')
      .text(d => d.pct_depression + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + '%'))
      .call(g => g.select('.domain').remove());
  });
}

// adults

function drawAdultDist() {
  d3.csv(dataFolder + 'nhanes_sleep_habits.csv', d3.autoType).then(function(data) {
    var d1 = data.find(r => r.age_group === '26-44');
    var d2 = data.find(r => r.age_group === '45-64');
    var avg_short = ((d1.pct_short + d2.pct_short) / 2).toFixed(1);
    var avg_adequate = (100 - avg_short).toFixed(1);

    var chartData = [
      { label: 'Getting enough sleep', pct: +avg_adequate },
      { label: 'Not getting enough sleep', pct: +avg_short }
    ];

    var el = document.querySelector('#chart-adult-dist');
    var mt = 20, mr = 20, mb = 40, ml = 40;
    var w = el.clientWidth - ml - mr;
    var h = 200 - mt - mb;

    var svg = d3.select('#chart-adult-dist').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleBand().domain(chartData.map(d => d.label)).range([0, w]).padding(0.4);
    var y = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
      .call(g => g.select('.domain').remove());

    svg.selectAll('rect').data(chartData).join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label)).attr('y', d => y(d.pct))
      .attr('width', x.bandwidth()).attr('height', d => h - y(d.pct))
      .attr('fill', (d, i) => i === 0 ? '#c4bfb8' : '#c0622f');

    svg.selectAll('.lbl').data(chartData).join('text')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.pct) - 6)
      .attr('text-anchor', 'middle').attr('font-size', 12)
      .attr('fill', '#555').attr('font-family', 'sans-serif')
      .text(d => d.pct + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove());
  });
}

// adults lollipop
function drawAdultLollipop() {
  d3.csv(dataFolder + 'nhanes_prevalence_by_sleep.csv', d3.autoType).then(function(raw) {
    var conditions = ['pct_obesity', 'pct_prediabetes', 'pct_hypertension'];
    var labels = ['Obesity', 'Prediabetes or diabetes', 'Hypertension'];

    var data = [];
    labels.forEach(function(label, i) {
      var key = conditions[i];
      ['26-44', '45-64'].forEach(function(ag) {
        var short = raw.find(d => d.age_group === ag && d.sleep_status === 'short');
        var adequate = raw.find(d => d.age_group === ag && d.sleep_status === 'adequate');
        data.push({ condition: label + ' (' + ag + ')', short: short[key], adequate: adequate[key] });
      });
    });

    var el = document.querySelector('#chart-adult-health');
    var mt = 20, mr = 80, mb = 50, ml = 230;
    var w = el.clientWidth - ml - mr;
    var h = data.length * 50;

    var svg = d3.select('#chart-adult-health').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleLinear().domain([0, 70]).range([0, w]);
    var y = d3.scaleBand().domain(data.map(d => d.condition)).range([0, h]).padding(0.35);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisBottom(x).tickSize(h).tickFormat(''))
      .call(g => g.select('.domain').remove());

    svg.selectAll('.conn').data(data).join('line')
      .attr('x1', d => x(d.adequate)).attr('x2', d => x(d.short))
      .attr('y1', d => y(d.condition) + y.bandwidth() / 2)
      .attr('y2', d => y(d.condition) + y.bandwidth() / 2)
      .attr('stroke', '#ddd').attr('stroke-width', 2);

    svg.selectAll('.dot-a').data(data).join('circle')
      .attr('cx', d => x(d.adequate))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 8).attr('fill', '#c4bfb8');

    svg.selectAll('.dot-s').data(data).join('circle')
      .attr('cx', d => x(d.short))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 8).attr('fill', '#c0622f');

    svg.selectAll('.val-s').data(data).join('text')
      .attr('x', d => x(d.short) + 12)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('font-size', 10)
      .attr('fill', '#c0622f').attr('font-family', 'sans-serif')
      .text(d => d.short + '%');

    svg.selectAll('.val-a').data(data).join('text')
      .attr('x', d => x(d.adequate) - 12)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('text-anchor', 'end').attr('font-size', 10)
      .attr('fill', '#999').attr('font-family', 'sans-serif')
      .text(d => d.adequate + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + '%'))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove());

    var leg = svg.append('g').attr('transform', 'translate(0,' + (h + 32) + ')');
    leg.append('circle').attr('r', 7).attr('fill', '#c0622f');
    leg.append('text').attr('x', 12).attr('y', 4).attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif').text('Short sleep (<7 hrs)');
    leg.append('circle').attr('cx', 160).attr('r', 7).attr('fill', '#c4bfb8');
    leg.append('text').attr('x', 172).attr('y', 4).attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif').text('Adequate sleep (≥7 hrs)');
  });
}

// heatmap
function drawHeatmap() {
  d3.csv(dataFolder + 'nhanes_heatmap.csv', d3.autoType).then(function(raw) {
    var ageGroups = ['18-25', '26-44', '45-64', '65+'];
    var conditions = ['Hypertension', 'Prediabetes or diabetes', 'Obesity'];
    var statuses = ['short', 'adequate'];

    var el = document.querySelector('#chart-heatmap');
    var mt = 70, mr = 30, mb = 60, ml = 160;
    var cellW = 90, cellH = 64;
    var w = ageGroups.length * 2 * cellW;
    var h = conditions.length * cellH;

    var svg = d3.select('#chart-heatmap').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    // warm-to-cool: low = light yellow, high = deep red-orange
    var colorScale = d3.scaleLinear()
      .domain([0, 18, 37, 56, 75])
      .range(['#1a1535', '#4d4580', '#9b82b8', '#c4a0c7', '#e8c5dc']);

    // age group headers
    ageGroups.forEach(function(ag, i) {
      // bracket line
      svg.append('line')
        .attr('x1', i * 2 * cellW + 4).attr('x2', i * 2 * cellW + 2 * cellW - 4)
        .attr('y1', -52).attr('y2', -52)
        .attr('stroke', '#ccc').attr('stroke-width', 1);

      svg.append('text')
        .attr('x', i * 2 * cellW + cellW)
        .attr('y', -58)
        .attr('text-anchor', 'middle').attr('font-size', 13)
        .attr('fill', '#333').attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .text(ag);

      statuses.forEach(function(st, j) {
        svg.append('text')
          .attr('x', (i * 2 + j) * cellW + cellW / 2)
          .attr('y', -34)
          .attr('text-anchor', 'middle').attr('font-size', 10)
          .attr('fill', st === 'short' ? '#c0622f' : '#888')
          .attr('font-family', 'sans-serif')
          .text(st === 'short' ? 'Short sleep' : 'Adequate sleep');
      });
    });

    // cells
    conditions.forEach(function(cond, ci) {
      svg.append('text')
        .attr('x', -14).attr('y', ci * cellH + cellH / 2)
        .attr('dy', '0.35em').attr('text-anchor', 'end')
        .attr('font-size', 12).attr('fill', '#444').attr('font-family', 'sans-serif')
        .text(cond);

      ageGroups.forEach(function(ag, ai) {
        statuses.forEach(function(st, si) {
          var row = raw.find(d => d.age_group === ag && d.sleep_status === st);
          var val = row ? row[cond] : 0;
          var cx = (ai * 2 + si) * cellW;
          var cy = ci * cellH;

          svg.append('rect')
            .attr('x', cx + 3).attr('y', cy + 3)
            .attr('width', cellW - 6).attr('height', cellH - 6)
            .attr('fill', colorScale(val))
            .attr('rx', 5);

          svg.append('text')
            .attr('x', cx + cellW / 2).attr('y', cy + cellH / 2 - 6)
            .attr('dy', '0.35em').attr('text-anchor', 'middle')
            .attr('font-size', 16).attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('fill', '#fff')
            .text(val + '%');

          // diff label for short vs adequate
          if (st === 'short') {
            var adequateRow = raw.find(d => d.age_group === ag && d.sleep_status === 'adequate');
            var diff = adequateRow ? +(val - adequateRow[cond]).toFixed(1) : 0;
            if (diff !== 0) {
              svg.append('text')
                .attr('x', cx + cellW / 2).attr('y', cy + cellH / 2 + 12)
                .attr('dy', '0.35em').attr('text-anchor', 'middle')
                .attr('font-size', 9).attr('font-family', 'sans-serif')
                .attr('fill', 'rgba(255,255,255,0.75)')
                .text(diff > 0 ? '+' + diff + 'pp vs adequate' : diff + 'pp vs adequate');
            }
          }
        });
      });
    });

    // color legend
    var legendW = 200, legendH = 10;
    var legendX = w / 2 - legendW / 2;
    var legendY = h + 28;

    var defs = svg.append('defs');
    var grad = defs.append('linearGradient').attr('id', 'heatLegend');
    grad.append('stop').attr('offset', '0%').attr('stop-color', colorScale(0));
    grad.append('stop').attr('offset', '100%').attr('stop-color', colorScale(75));

    svg.append('rect')
      .attr('x', legendX).attr('y', legendY)
      .attr('width', legendW).attr('height', legendH)
      .attr('fill', 'url(#heatLegend)').attr('rx', 3);

    svg.append('text').attr('x', legendX).attr('y', legendY + 22)
      .attr('font-size', 10).attr('fill', '#888').attr('font-family', 'sans-serif')
      .text('0%');
    svg.append('text').attr('x', legendX + legendW).attr('y', legendY + 22)
      .attr('font-size', 10).attr('fill', '#888').attr('font-family', 'sans-serif')
      .attr('text-anchor', 'end').text('75%');
    svg.append('text').attr('x', legendX + legendW / 2).attr('y', legendY + 22)
      .attr('font-size', 10).attr('fill', '#888').attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle').text('Prevalence');
  });
}

// bubble
function drawBubble() {
  d3.csv(dataFolder + 'nhanes_heatmap.csv', d3.autoType).then(function(raw) {
    var short = raw.filter(d => d.sleep_status === 'short');
    var conditions = ['Hypertension', 'Prediabetes or diabetes', 'Obesity'];
    var ageGroups = ['18-25', '26-44', '45-64', '65+'];
    var colors = { 'Hypertension': '#1a1535', 'Prediabetes or diabetes': '#4d4580', 'Obesity': '#9b82b8' };

    var data = [];
    short.forEach(function(row) {
      conditions.forEach(function(cond) {
        data.push({ age_group: row.age_group, condition: cond, value: row[cond] });
      });
    });

    var el = document.querySelector('#chart-bubble');
    var mt = 30, mr = 160, mb = 40, ml = 60;
    var w = el.clientWidth - ml - mr;
    var h = 320 - mt - mb;

    var svg = d3.select('#chart-bubble').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scalePoint().domain(ageGroups).range([0, w]).padding(0.4);
    var y = d3.scalePoint().domain(conditions).range([0, h]).padding(0.4);
    var r = d3.scaleSqrt().domain([0, 75]).range([0, 42]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'grid')
      .call(d3.axisBottom(x).tickSize(h).tickFormat(''))
      .attr('transform', 'translate(0,0)')
      .call(g => g.select('.domain').remove());

    svg.selectAll('circle').data(data).join('circle')
      .attr('cx', d => x(d.age_group))
      .attr('cy', d => y(d.condition))
      .attr('r', d => r(d.value))
      .attr('fill', d => colors[d.condition])
      .attr('opacity', 0.75);

    svg.selectAll('.bubble-label').data(data).join('text')
      .attr('x', d => x(d.age_group))
      .attr('y', d => y(d.condition))
      .attr('dy', '0.35em').attr('text-anchor', 'middle')
      .attr('font-size', d => r(d.value) > 18 ? 11 : 9)
      .attr('fill', '#fff').attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .text(d => d.value + '%');

    svg.append('g').attr('class', 'axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove());

    // legend
    var leg = svg.append('g').attr('transform', 'translate(' + (w + 20) + ', 20)');
    conditions.forEach(function(cond, i) {
      leg.append('circle').attr('cy', i * 28).attr('r', 8).attr('fill', colors[cond]).attr('opacity', 0.75);
      leg.append('text').attr('x', 14).attr('y', i * 28 + 4)
        .attr('font-size', 11).attr('fill', '#555').attr('font-family', 'sans-serif')
        .text(cond);
    });

    leg.append('text').attr('y', 110)
      .attr('font-size', 10).attr('fill', '#aaa').attr('font-family', 'sans-serif')
      .text('Bubble size =');
    leg.append('text').attr('y', 122)
      .attr('font-size', 10).attr('fill', '#aaa').attr('font-family', 'sans-serif')
      .text('prevalence among');
    leg.append('text').attr('y', 134)
      .attr('font-size', 10).attr('fill', '#aaa').attr('font-family', 'sans-serif')
      .text('short sleepers');
  });
}

// older adults

function drawOlderDist() {
  d3.csv(dataFolder + 'nhanes_sleep_habits.csv', d3.autoType).then(function(data) {
    var d = data.find(r => r.age_group === '65+');
    var chartData = [
      { label: 'Getting enough sleep', pct: d.pct_adequate },
      { label: 'Not getting enough sleep', pct: d.pct_short }
    ];

    var el = document.querySelector('#chart-older-dist');
    var mt = 20, mr = 20, mb = 40, ml = 40;
    var w = el.clientWidth - ml - mr;
    var h = 200 - mt - mb;

    var svg = d3.select('#chart-older-dist').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleBand().domain(chartData.map(d => d.label)).range([0, w]).padding(0.4);
    var y = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-w).tickFormat(''))
      .call(g => g.select('.domain').remove());

    svg.selectAll('rect').data(chartData).join('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label)).attr('y', d => y(d.pct))
      .attr('width', x.bandwidth()).attr('height', d => h - y(d.pct))
      .attr('fill', (d, i) => i === 0 ? '#c4bfb8' : '#8b6f47');

    svg.selectAll('.lbl').data(chartData).join('text')
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.pct) - 6)
      .attr('text-anchor', 'middle').attr('font-size', 12)
      .attr('fill', '#555').attr('font-family', 'sans-serif')
      .text(d => d.pct + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).tickSize(0))
      .call(g => g.select('.domain').remove());
  });
}

// older adults lollipop
function drawOlderLollipop() {
  d3.csv(dataFolder + 'nhanes_prevalence_by_sleep.csv', d3.autoType).then(function(raw) {
    var ag = raw.filter(d => d.age_group === '65+');
    var short = ag.find(d => d.sleep_status === 'short');
    var adequate = ag.find(d => d.sleep_status === 'adequate');

    var data = [
      { condition: 'Hypertension', short: short.pct_hypertension, adequate: adequate.pct_hypertension },
      { condition: 'Prediabetes or diabetes', short: short.pct_prediabetes, adequate: adequate.pct_prediabetes },
      { condition: 'Obesity', short: short.pct_obesity, adequate: adequate.pct_obesity }
    ];

    var el = document.querySelector('#chart-older-health');
    var mt = 20, mr = 80, mb = 50, ml = 190;
    var w = el.clientWidth - ml - mr;
    var h = data.length * 70;

    var svg = d3.select('#chart-older-health').append('svg')
      .attr('width', w + ml + mr).attr('height', h + mt + mb)
      .append('g').attr('transform', 'translate(' + ml + ',' + mt + ')');

    var x = d3.scaleLinear().domain([0, 80]).range([0, w]);
    var y = d3.scaleBand().domain(data.map(d => d.condition)).range([0, h]).padding(0.4);

    svg.append('g').attr('class', 'grid')
      .call(d3.axisBottom(x).tickSize(h).tickFormat(''))
      .call(g => g.select('.domain').remove());

    svg.selectAll('.conn').data(data).join('line')
      .attr('x1', d => x(Math.min(d.short, d.adequate)))
      .attr('x2', d => x(Math.max(d.short, d.adequate)))
      .attr('y1', d => y(d.condition) + y.bandwidth() / 2)
      .attr('y2', d => y(d.condition) + y.bandwidth() / 2)
      .attr('stroke', '#ddd').attr('stroke-width', 2);

    svg.selectAll('.dot-a').data(data).join('circle')
      .attr('cx', d => x(d.adequate))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 9).attr('fill', '#c4bfb8');

    svg.selectAll('.dot-s').data(data).join('circle')
      .attr('cx', d => x(d.short))
      .attr('cy', d => y(d.condition) + y.bandwidth() / 2)
      .attr('r', 9).attr('fill', '#8b6f47');

    svg.selectAll('.val-s').data(data).join('text')
      .attr('x', d => x(d.short) + 14)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('font-size', 11)
      .attr('fill', '#8b6f47').attr('font-family', 'sans-serif')
      .text(d => d.short + '%');

    svg.selectAll('.val-a').data(data).join('text')
      .attr('x', d => x(d.adequate) - 14)
      .attr('y', d => y(d.condition) + y.bandwidth() / 2)
      .attr('dy', '0.35em').attr('text-anchor', 'end').attr('font-size', 11)
      .attr('fill', '#999').attr('font-family', 'sans-serif')
      .text(d => d.adequate + '%');

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + '%'))
      .call(g => g.select('.domain').remove());

    svg.append('g').attr('class', 'axis')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove());

    var leg = svg.append('g').attr('transform', 'translate(0,' + (h + 32) + ')');
    leg.append('circle').attr('r', 7).attr('fill', '#8b6f47');
    leg.append('text').attr('x', 12).attr('y', 4).attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif').text('Short sleep (<7 hrs)');
    leg.append('circle').attr('cx', 160).attr('r', 7).attr('fill', '#c4bfb8');
    leg.append('text').attr('x', 172).attr('y', 4).attr('font-size', 11)
      .attr('fill', '#555').attr('font-family', 'sans-serif').text('Adequate sleep (≥7 hrs)');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  drawChildrenDist();
  drawChildrenLollipop();
  drawTeenDist();
  drawTeenSlope();
  drawYoungAdultDist();
  drawYADepression();
  drawYoungAdultLollipop();
  drawAdultDist();
  drawAdultLollipop();
  drawOlderDist();
  drawOlderLollipop();
  drawHeatmap();
  drawBubble();
});
