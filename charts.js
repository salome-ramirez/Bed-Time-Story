// charts.js

var DATA = "Data_files/";

var C1 = "#211C84";
var C2 = "#4D55CC";
var C3 = "#7A73D1";
var C4 = "#B5A8D5";
var C5 = "#DDD8EF";
var INK   = "#1c1c1e";
var MUTED = "#6b6b6b";
var RULE  = "#d4d0c8";

function getW(id) {
  var el = document.getElementById(id);
  return el ? Math.floor(el.getBoundingClientRect().width) : 520;
}

function addGrid(svg, yScale, width) {
  svg.append("g").attr("class", "grid")
    .call(d3.axisLeft(yScale).ticks(5).tickSize(-width).tickFormat(""));
}

// children lollipop — % short sleep by condition
function drawChildrenSleep() {
  var id = "chart-children-sleep";
  var m = { top: 16, right: 60, bottom: 36, left: 210 };
  var w = getW(id) - m.left - m.right;
  var h = 280 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "children_short_sleep_by_condition.csv", d3.autoType).then(function(data) {
    data.sort(function(a, b) { return b.pct_short_sleep - a.pct_short_sleep; });
    var x = d3.scaleLinear().domain([0, 60]).range([0, w]);
    var y = d3.scaleBand().domain(data.map(function(d) { return d.condition; })).range([0, h]).padding(0.45);
    var cScale = d3.scaleSequential().domain([0, data.length - 1]).interpolator(d3.interpolate(C1, C4));
    addGrid(svg, d3.scaleLinear().domain([0, 60]).range([h, 0]), w);
    svg.selectAll(".ll").data(data).join("line").attr("class", "lollipop-line")
      .attr("x1", 0).attr("x2", function(d) { return x(d.pct_short_sleep); })
      .attr("y1", function(d) { return y(d.condition) + y.bandwidth() / 2; })
      .attr("y2", function(d) { return y(d.condition) + y.bandwidth() / 2; })
      .attr("stroke", RULE).attr("stroke-width", 1.5);
    svg.selectAll(".ld").data(data).join("circle").attr("class", "lollipop-dot")
      .attr("cx", function(d) { return x(d.pct_short_sleep); })
      .attr("cy", function(d) { return y(d.condition) + y.bandwidth() / 2; })
      .attr("r", 6).attr("fill", function(d, i) { return cScale(i); });
    svg.selectAll(".vl").data(data).join("text").attr("class", "annotation")
      .attr("x", function(d) { return x(d.pct_short_sleep) + 10; })
      .attr("y", function(d) { return y(d.condition) + y.bandwidth() / 2 + 4; })
      .text(function(d) { return d.pct_short_sleep + "%"; });
    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return d + "%"; }));
    svg.append("g").attr("class", "axis").call(d3.axisLeft(y));
  });
}

// children grouped bars — short vs adequate × condition
function drawChildrenMental() {
  var id = "chart-children-mental";
  var m = { top: 16, right: 20, bottom: 60, left: 44 };
  var w = getW(id) - m.left - m.right;
  var h = 300 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  var data = [
    { c: "ADHD",              s: 48, a: 28 },
    { c: "Anxiety",           s: 44, a: 26 },
    { c: "Behavioral issues", s: 52, a: 31 },
    { c: "Depression",        s: 50, a: 27 }
  ];
  var groups = data.map(function(d) { return d.c; });
  var x0 = d3.scaleBand().domain(groups).range([0, w]).padding(0.28);
  var x1 = d3.scaleBand().domain(["s","a"]).range([0, x0.bandwidth()]).padding(0.08);
  var y  = d3.scaleLinear().domain([0, 65]).range([h, 0]);
  addGrid(svg, y, w);
  var grp = svg.selectAll(".bg").data(data).join("g")
    .attr("transform", function(d) { return "translate(" + x0(d.c) + ",0)"; });
  grp.selectAll("rect").data(function(d) { return [{k:"s",v:d.s},{k:"a",v:d.a}]; })
    .join("rect").attr("class","bar")
    .attr("x", function(d) { return x1(d.k); }).attr("y", function(d) { return y(d.v); })
    .attr("width", x1.bandwidth()).attr("height", function(d) { return h - y(d.v); })
    .attr("fill", function(d) { return d.k === "s" ? C1 : C4; });
  grp.selectAll(".bl").data(function(d) { return [{k:"s",v:d.s},{k:"a",v:d.a}]; })
    .join("text").attr("class","annotation")
    .attr("x", function(d) { return x1(d.k) + x1.bandwidth() / 2; })
    .attr("y", function(d) { return y(d.v) - 4; }).attr("text-anchor","middle")
    .text(function(d) { return d.v + "%"; });
  svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
    .call(d3.axisBottom(x0));
  svg.append("g").attr("class","axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d+"%";}));
  var leg = svg.append("g").attr("transform","translate(0,"+(h+42)+")");
  [{k:"s",l:"Short sleep"},{k:"a",l:"Adequate sleep"}].forEach(function(item,i){
    var g = leg.append("g").attr("transform","translate("+(i*160)+",0)");
    g.append("rect").attr("width",10).attr("height",10).attr("fill",i===0?C1:C4);
    g.append("text").attr("x",14).attr("y",9).attr("class","annotation").text(item.l);
  });
}

// children horizontal bars — obesity by sleep
function drawChildrenPhysical() {
  var id = "chart-children-physical";
  var m = { top: 16, right: 60, bottom: 36, left: 180 };
  var w = getW(id) - m.left - m.right;
  var h = 200 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "children_sleep_physical_health.csv", d3.autoType).then(function(raw) {
    var data = [
      { label: "Short sleep (<9 hrs)",   obesity: raw[0].pct_obesity, combined: raw[0].pct_overweight_obese },
      { label: "Adequate sleep (9+ hrs)", obesity: raw[1].pct_obesity, combined: raw[1].pct_overweight_obese }
    ];

    var groups = data.map(function(d){ return d.label; });
    var x0 = d3.scaleBand().domain(groups).range([0, w]).padding(0.35);
    var x1 = d3.scaleBand().domain(["obesity","combined"]).range([0, x0.bandwidth()]).padding(0.08);
    var y  = d3.scaleLinear().domain([0, 55]).range([h, 0]);
    var cols = [C1, C3];

    addGrid(svg, y, w);

    var grp = svg.selectAll(".bg").data(data).join("g")
      .attr("transform", function(d){ return "translate(" + x0(d.label) + ",0)"; });

    grp.selectAll("rect")
      .data(function(d){ return [{k:"obesity",v:d.obesity},{k:"combined",v:d.combined}]; })
      .join("rect").attr("class","bar")
      .attr("x", function(d){ return x1(d.k); })
      .attr("y", function(d){ return y(d.v); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d){ return h - y(d.v); })
      .attr("fill", function(d, i){ return cols[i]; });

    grp.selectAll(".bl")
      .data(function(d){ return [{k:"obesity",v:d.obesity},{k:"combined",v:d.combined}]; })
      .join("text").attr("class","annotation")
      .attr("x", function(d){ return x1(d.k) + x1.bandwidth() / 2; })
      .attr("y", function(d){ return y(d.v) - 4; })
      .attr("text-anchor","middle")
      .text(function(d){ return d.v + "%"; });

    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x0));
    svg.append("g").attr("class","axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){ return d + "%"; }));

    var leg = svg.append("g").attr("transform","translate(0," + (h + 28) + ")");
    [{k:"obesity",l:"Obesity"},{k:"combined",l:"Overweight or obese"}].forEach(function(item, i){
      var g = leg.append("g").attr("transform","translate(" + (i * 170) + ",0)");
      g.append("rect").attr("width",10).attr("height",10).attr("fill",cols[i]);
      g.append("text").attr("x",14).attr("y",9).attr("class","annotation").text(item.l);
    });
  });
}

// teens line + area — % sufficient sleep trend
function drawTeensSleep() {
  var id = "chart-teens-sleep";
  var m = { top: 16, right: 40, bottom: 36, left: 48 };
  var w = getW(id) - m.left - m.right;
  var h = 280 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "teenagers_sleep_trend.csv", d3.autoType).then(function(raw) {
    // strip comment rows (lines starting with #) and rows with no numeric year
    var data = raw.filter(function(d){ return d.year && !isNaN(+d.year) && +d.year > 2000; });
    var keys = Object.keys(data[0]);
    var yField = keys.find(function(k){ return k === "pct_sufficient_sleep"; }) || keys.find(function(k){ return k !== "year" && k !== "notes"; }) || keys[1];
    var x = d3.scaleLinear().domain(d3.extent(data, function(d){return +d.year;})).range([0,w]);
    var yMax = d3.max(data, function(d){return +d[yField];});
    var y = d3.scaleLinear().domain([0, Math.ceil(yMax/10)*10+10]).range([h,0]);
    addGrid(svg, y, w);

    var defs = svg.append("defs");
    var grad = defs.append("linearGradient").attr("id","teen-grad").attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",1);
    grad.append("stop").attr("offset","0%").attr("stop-color",C3).attr("stop-opacity",0.3);
    grad.append("stop").attr("offset","100%").attr("stop-color",C3).attr("stop-opacity",0.02);

    svg.append("path").datum(data)
      .attr("fill","url(#teen-grad)")
      .attr("d", d3.area().x(function(d){return x(+d.year);}).y0(h).y1(function(d){return y(+d[yField]);}).curve(d3.curveMonotoneX));
    svg.append("path").datum(data)
      .attr("fill","none").attr("stroke",C2).attr("stroke-width",2.5)
      .attr("d", d3.line().x(function(d){return x(+d.year);}).y(function(d){return y(+d[yField]);}).curve(d3.curveMonotoneX));
    svg.selectAll(".dot").data(data).join("circle").attr("class","dot")
      .attr("cx",function(d){return x(+d.year);}).attr("cy",function(d){return y(+d[yField]);})
      .attr("r",5).attr("fill",C1).attr("stroke","#fff").attr("stroke-width",1.5);
    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(data.length));
    svg.append("g").attr("class","axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d+"%";}));
    var last = data[data.length-1];
    svg.append("text").attr("class","annotation")
      .attr("x",x(+last.year)-6).attr("y",y(+last[yField])-10).attr("text-anchor","end")
      .text(last[yField]+"% in "+last.year);
  });
}

// teens slope chart — mental health outcomes short vs adequate
function drawTeensMental() {
  var id = "chart-teens-mental";
  var m = { top: 16, right: 60, bottom: 36, left: 220 };
  var w = getW(id) - m.left - m.right;
  var h = 300 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "teenagers_mental_health.csv", d3.autoType).then(function(data) {
    // filter to rows with a valid pct_overall
    data = data.filter(function(d){ return d.indicator && !isNaN(+d.pct_overall); });

    var x = d3.scaleLinear().domain([0, 60]).range([0, w]);
    var y = d3.scaleBand()
      .domain(data.map(function(d){ return d.indicator; }))
      .range([0, h]).padding(0.45);

    var cScale = d3.scaleSequential()
      .domain([0, data.length - 1])
      .interpolator(d3.interpolate(C1, C3));

    addGrid(svg, d3.scaleLinear().domain([0, 60]).range([h, 0]), w);

    svg.selectAll(".ll").data(data).join("line").attr("class","lollipop-line")
      .attr("x1", 0).attr("x2", function(d){ return x(+d.pct_overall); })
      .attr("y1", function(d){ return y(d.indicator) + y.bandwidth() / 2; })
      .attr("y2", function(d){ return y(d.indicator) + y.bandwidth() / 2; })
      .attr("stroke", RULE).attr("stroke-width", 1.5);

    svg.selectAll(".ld").data(data).join("circle").attr("class","lollipop-dot")
      .attr("cx", function(d){ return x(+d.pct_overall); })
      .attr("cy", function(d){ return y(d.indicator) + y.bandwidth() / 2; })
      .attr("r", 6)
      .attr("fill", function(d, i){ return cScale(i); });

    svg.selectAll(".vl").data(data).join("text").attr("class","annotation")
      .attr("x", function(d){ return x(+d.pct_overall) + 10; })
      .attr("y", function(d){ return y(d.indicator) + y.bandwidth() / 2 + 4; })
      .text(function(d){ return d.pct_overall + "%"; });

    svg.append("g").attr("class","axis").attr("transform","translate(0," + h + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){ return d + "%"; }));

    svg.append("g").attr("class","axis").call(d3.axisLeft(y));
  });
}

// teens bars — physical inactivity by sleep
function drawTeensPhysical() {
  var id = "chart-teens-physical";
  var m = { top: 16, right: 30, bottom: 60, left: 50 };
  var w = getW(id) - m.left - m.right;
  var h = 260 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "teenagers_sleep_physical_health.csv", d3.autoType).then(function(raw) {
    var metrics = ["pct_obesity", "pct_elevated_bp", "pct_prediabetes"];
    var labels  = ["Obesity", "Elevated BP", "Prediabetes"];
    var statuses = raw.map(function(d){ return d.sleep_status; });
    var cols = [C1, C4];

    var x0 = d3.scaleBand().domain(labels).range([0, w]).padding(0.28);
    var x1 = d3.scaleBand().domain(statuses).range([0, x0.bandwidth()]).padding(0.08);
    var y  = d3.scaleLinear().domain([0, 35]).range([h, 0]);

    addGrid(svg, y, w);

    // one group per metric
    labels.forEach(function(label, mi) {
      var metric = metrics[mi];
      var grpData = raw.map(function(d){ return { status: d.sleep_status, val: +d[metric] }; });
      var grp = svg.append("g").attr("transform","translate("+x0(label)+",0)");

      grp.selectAll("rect").data(grpData).join("rect").attr("class","bar")
        .attr("x", function(d){ return x1(d.status); })
        .attr("y", function(d){ return y(d.val); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d){ return h - y(d.val); })
        .attr("fill", function(d, i){ return cols[i]; });

      grp.selectAll(".bl").data(grpData).join("text").attr("class","annotation")
        .attr("x", function(d){ return x1(d.status) + x1.bandwidth() / 2; })
        .attr("y", function(d){ return y(d.val) - 4; })
        .attr("text-anchor","middle")
        .text(function(d){ return d.val + "%"; });
    });

    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x0));
    svg.append("g").attr("class","axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){ return d + "%"; }));

    var leg = svg.append("g").attr("transform","translate(0,"+(h+42)+")");
    statuses.forEach(function(s, i){
      var g = leg.append("g").attr("transform","translate("+(i*200)+",0)");
      g.append("rect").attr("width",10).attr("height",10).attr("fill",cols[i]);
      g.append("text").attr("x",14).attr("y",9).attr("class","annotation").text(s);
    });
  });
}

// young adults lollipop — % short sleep by age group
function drawYoungAdultsSleep() {
  var id = "chart-youngadults-sleep";
  var m = { top: 16, right: 60, bottom: 36, left: 100 };
  var w = getW(id) - m.left - m.right;
  var h = 240 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "adults_short_sleep_by_age.csv", d3.autoType).then(function(allData) {
    var keys = Object.keys(allData[0]);
    var ageKey = keys.find(function(k){return k.toLowerCase().indexOf("age") > -1;}) || keys[0];
    var pctKey = keys.find(function(k){return k.toLowerCase().indexOf("pct") > -1 || k.toLowerCase().indexOf("short") > -1;}) || keys[1];
    // filter out comment rows and rows with no valid age_group
    var data = allData.filter(function(d){ return d[ageKey] && String(d[ageKey]).indexOf("#") < 0 && !isNaN(+d[pctKey]); });
    var maxVal = d3.max(data, function(d){return +d[pctKey];});
    var cScale = d3.scaleSequential().domain([0,data.length-1]).interpolator(d3.interpolate(C1,C4));
    var x = d3.scaleLinear().domain([0,Math.ceil(maxVal/10)*10+5]).range([0,w]);
    var y = d3.scaleBand().domain(data.map(function(d){return String(d[ageKey]);})).range([0,h]).padding(0.4);
    addGrid(svg, d3.scaleLinear().domain([0,Math.ceil(maxVal/10)*10+5]).range([h,0]), w);
    svg.selectAll(".ll").data(data).join("line").attr("class","lollipop-line")
      .attr("x1",0).attr("x2",function(d){return x(+d[pctKey]);})
      .attr("y1",function(d){return y(String(d[ageKey]))+y.bandwidth()/2;})
      .attr("y2",function(d){return y(String(d[ageKey]))+y.bandwidth()/2;})
      .attr("stroke",RULE).attr("stroke-width",1.5);
    svg.selectAll(".ld").data(data).join("circle").attr("class","lollipop-dot")
      .attr("cx",function(d){return x(+d[pctKey]);})
      .attr("cy",function(d){return y(String(d[ageKey]))+y.bandwidth()/2;})
      .attr("r",7).attr("fill",function(d,i){return cScale(i);});
    svg.selectAll(".vl").data(data).join("text").attr("class","annotation")
      .attr("x",function(d){return x(+d[pctKey])+10;})
      .attr("y",function(d){return y(String(d[ageKey]))+y.bandwidth()/2+4;})
      .text(function(d){return d[pctKey]+"%";});
    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){return d+"%";}));
    svg.append("g").attr("class","axis").call(d3.axisLeft(y));
  });
}

// young adults slope — depression by sleep
function drawYoungAdultsMental() {
  var id = "chart-youngadults-mental";
  var m = { top: 24, right: 20, bottom: 20, left: 20 };
  var totalW = getW(id) || 520;
  var h = 220;
  var labelColW = 210;
  var valColW   = 50;
  var lineW = totalW - labelColW - valColW - m.left - m.right;
  if (lineW < 80) lineW = 80;

  var svg = d3.select("#" + id).append("svg")
    .attr("width", totalW).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  var data = [
    {label:"Any depression",              short:27, adequate:11},
    {label:"14+ poor mental health days", short:23, adequate:8 },
    {label:"Frequent anxiety",            short:31, adequate:13}
  ];
  var lineStartX = labelColW;
  var lineEndX   = labelColW + lineW;
  var rowH = h / data.length;
  var cols = [C1, C2, C3];

  svg.append("text").attr("class","annotation")
    .attr("x", lineStartX).attr("y", -10)
    .attr("text-anchor","middle").attr("fill", C1).text("< 7 hrs sleep");
  svg.append("text").attr("class","annotation")
    .attr("x", lineEndX).attr("y", -10)
    .attr("text-anchor","middle").attr("fill", C4).text("≥ 7 hrs sleep");

  data.forEach(function(d, i) {
    var col = cols[i];
    var cy  = rowH * i + rowH / 2;

    svg.append("text").attr("class","annotation")
      .attr("x", labelColW - 14).attr("y", cy + 4)
      .attr("text-anchor","end").attr("fill", col)
      .text(d.label);

    svg.append("text").attr("class","annotation")
      .attr("x", lineStartX + 6).attr("y", cy - 7)
      .attr("text-anchor","start").attr("fill", col)
      .text(d.short + "%");

    svg.append("line")
      .attr("x1", lineStartX).attr("x2", lineEndX)
      .attr("y1", cy).attr("y2", cy)
      .attr("stroke", col).attr("stroke-width", 2).attr("stroke-opacity", 0.7);

    svg.append("circle")
      .attr("cx", lineStartX).attr("cy", cy)
      .attr("r", 6).attr("fill", col);

    svg.append("circle")
      .attr("cx", lineEndX).attr("cy", cy)
      .attr("r", 6).attr("fill","#fff").attr("stroke", col).attr("stroke-width", 2);

    svg.append("text").attr("class","annotation")
      .attr("x", lineEndX + 10).attr("y", cy + 4)
      .attr("text-anchor","start")
      .text(d.adequate + "%");
  });
}

// young adults lollipop — self-rated health
function drawYoungAdultsPhysical() {
  var id = "chart-youngadults-physical";
  var m = { top: 16, right: 70, bottom: 36, left: 160 };
  var w = getW(id) - m.left - m.right;
  var h = 200 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");
  var data = [
    {label:"< 6 hrs",pct:28},{label:"6 hrs",pct:18},
    {label:"7–8 hrs",pct:9},{label:"9+ hrs",pct:14}
  ];
  var x = d3.scaleLinear().domain([0,35]).range([0,w]);
  var y = d3.scaleBand().domain(data.map(function(d){return d.label;})).range([0,h]).padding(0.35);
  var cols=[C1,C2,C3,C4];
  addGrid(svg, d3.scaleLinear().domain([0,35]).range([h,0]), w);
  svg.selectAll(".ll").data(data).join("line").attr("class","lollipop-line")
    .attr("x1",0).attr("x2",function(d){return x(d.pct);})
    .attr("y1",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("y2",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("stroke",RULE).attr("stroke-width",1.5);
  svg.selectAll(".ld").data(data).join("circle").attr("class","lollipop-dot")
    .attr("cx",function(d){return x(d.pct);}).attr("cy",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("r",6).attr("fill",function(d,i){return cols[i];});
  svg.selectAll(".vl").data(data).join("text").attr("class","annotation")
    .attr("x",function(d){return x(d.pct)+10;})
    .attr("y",function(d){return y(d.label)+y.bandwidth()/2+4;})
    .text(function(d){return d.pct+"%";});
  svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
    .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){return d+"%";}));
  svg.append("g").attr("class","axis").call(d3.axisLeft(y));
}

// adults bars — % short sleep by age group
function drawAdultsSleep() {
  var id = "chart-adults-sleep";
  var m = { top: 16, right: 50, bottom: 36, left: 50 };
  var w = getW(id) - m.left - m.right;
  var h = 240 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "adults_short_sleep_by_age.csv", d3.autoType).then(function(allData) {
    var keys = Object.keys(allData[0]);
    var ageKey = keys.find(function(k){return k.toLowerCase().indexOf("age") > -1;}) || keys[0];
    var pctKey = keys.find(function(k){return k.toLowerCase().indexOf("pct") > -1 || k.toLowerCase().indexOf("short") > -1;}) || keys[1];
    // filter out comment rows and rows with no valid pct value
    var data = allData.filter(function(d){ return d[ageKey] && String(d[ageKey]).indexOf("#") < 0 && !isNaN(+d[pctKey]); });
    var maxVal = d3.max(data, function(d){return +d[pctKey];});
    var cScale = d3.scaleSequential().domain([0,data.length-1]).interpolator(d3.interpolate(C1,C4));
    var x = d3.scaleBand().domain(data.map(function(d){return String(d[ageKey]);})).range([0,w]).padding(0.3);
    var y = d3.scaleLinear().domain([0,Math.ceil(maxVal/10)*10+5]).range([h,0]);
    addGrid(svg,y,w);
    svg.selectAll(".bar").data(data).join("rect").attr("class","bar")
      .attr("x",function(d){return x(String(d[ageKey]));}).attr("y",function(d){return y(+d[pctKey]);})
      .attr("width",x.bandwidth()).attr("height",function(d){return h-y(+d[pctKey]);})
      .attr("fill",function(d,i){return cScale(i);});
    svg.selectAll(".vl").data(data).join("text").attr("class","annotation")
      .attr("x",function(d){return x(String(d[ageKey]))+x.bandwidth()/2;})
      .attr("y",function(d){return y(+d[pctKey])-5;}).attr("text-anchor","middle")
      .text(function(d){return d[pctKey]+"%";});
    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x));
    svg.append("g").attr("class","axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d+"%";}));
  });
}

// adults lollipop — depression by sleep hours
function drawAdultsMental() {
  var id = "chart-adults-mental";
  var m = { top: 16, right: 60, bottom: 36, left: 100 };
  var w = getW(id) - m.left - m.right;
  var h = 220 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");
  var data = [
    {label:"< 6 hrs",pct:23},{label:"6 hrs",pct:18},
    {label:"7 hrs",pct:11},{label:"8 hrs",pct:9},{label:"9+ hrs",pct:15}
  ];
  var x = d3.scaleLinear().domain([0,28]).range([0,w]);
  var y = d3.scaleBand().domain(data.map(function(d){return d.label;})).range([0,h]).padding(0.35);
  var cScale = d3.scaleSequential().domain([0,data.length-1]).interpolator(d3.interpolate(C1,C4));
  addGrid(svg, d3.scaleLinear().domain([0,28]).range([h,0]), w);
  svg.selectAll(".ll").data(data).join("line").attr("class","lollipop-line")
    .attr("x1",0).attr("x2",function(d){return x(d.pct);})
    .attr("y1",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("y2",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("stroke",RULE).attr("stroke-width",1.5);
  svg.selectAll(".ld").data(data).join("circle").attr("class","lollipop-dot")
    .attr("cx",function(d){return x(d.pct);}).attr("cy",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("r",6).attr("fill",function(d,i){return cScale(i);});
  svg.selectAll(".vl").data(data).join("text").attr("class","annotation")
    .attr("x",function(d){return x(d.pct)+10;})
    .attr("y",function(d){return y(d.label)+y.bandwidth()/2+4;})
    .text(function(d){return d.pct+"%";});
  svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
    .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){return d+"%";}));
  svg.append("g").attr("class","axis").call(d3.axisLeft(y));
}

// adults heatmap — NHANES: condition × age group × sleep status
function drawAdultsPhysical() {
  var id = "chart-adults-physical";
  var m = { top: 50, right: 30, bottom: 60, left: 200 };
  var w = getW(id) - m.left - m.right;
  var h = 320 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "nhanes_heatmap.csv", d3.autoType).then(function(raw) {
    var conditions = ["Hypertension", "Prediabetes or diabetes", "Obesity"];
    var ageGroups  = ["18-25","26-44","45-64","65+"];

    // build long format
    var long = [];
    raw.forEach(function(row) {
      conditions.forEach(function(cond) {
        if (row[cond] !== undefined) {
          long.push({
            colKey: row.age_group + " · " + row.sleep_status,
            condition: cond,
            value: +row[cond]
          });
        }
      });
    });

    var colKeys = [];
    ageGroups.forEach(function(ag){
      colKeys.push(ag+" · short");
      colKeys.push(ag+" · adequate");
    });

    var x = d3.scaleBand().domain(colKeys).range([0,w]).padding(0.04);
    var y = d3.scaleBand().domain(conditions).range([0,h]).padding(0.04);
    var maxVal = d3.max(long, function(d){return d.value;});
    var color = d3.scaleSequential().domain([0,maxVal]).interpolator(d3.interpolate(C5,C1));

    svg.selectAll(".hc").data(long).join("rect").attr("class","heat-cell")
      .attr("x",function(d){return x(d.colKey);}).attr("y",function(d){return y(d.condition);})
      .attr("width",x.bandwidth()).attr("height",y.bandwidth())
      .attr("fill",function(d){return isNaN(d.value)?"#eee":color(d.value);}).attr("rx",3);

    svg.selectAll(".hl").data(long).join("text").attr("class","annotation")
      .attr("x",function(d){return x(d.colKey)+x.bandwidth()/2;})
      .attr("y",function(d){return y(d.condition)+y.bandwidth()/2+4;})
      .attr("text-anchor","middle")
      .attr("fill",function(d){return d.value > maxVal*0.55?"#fff":INK;})
      .style("font-size","10px")
      .text(function(d){return isNaN(d.value)?"":d.value+"%";});

    // age group headers
    ageGroups.forEach(function(ag){
      var sx = x(ag+" · short"), ax = x(ag+" · adequate");
      var mid = (sx + ax + x.bandwidth()) / 2;
      svg.append("text").attr("class","annotation")
        .attr("x",mid).attr("y",-28).attr("text-anchor","middle")
        .style("font-weight","500").text(ag);
      svg.append("text").attr("class","annotation")
        .attr("x",sx+x.bandwidth()/2).attr("y",-12).attr("text-anchor","middle")
        .attr("fill",C1).text("Short");
      svg.append("text").attr("class","annotation")
        .attr("x",ax+x.bandwidth()/2).attr("y",-12).attr("text-anchor","middle")
        .attr("fill",C4).text("Adequate");
    });

    svg.append("g").attr("class","axis").call(d3.axisLeft(y));

    // legend
    var defs = svg.append("defs");
    var grad = defs.append("linearGradient").attr("id","hg");
    grad.append("stop").attr("offset","0%").attr("stop-color",C5);
    grad.append("stop").attr("offset","100%").attr("stop-color",C1);
    var lg = svg.append("g").attr("transform","translate(0,"+(h+36)+")");
    lg.append("rect").attr("width",100).attr("height",8).attr("fill","url(#hg)");
    lg.append("text").attr("class","annotation").attr("y",20).text("0%");
    lg.append("text").attr("class","annotation").attr("x",100).attr("y",20).attr("text-anchor","end").text(maxVal+"%");
  });
}

// adults — short vs adequate grouped bars by age group (sleep habits)
function drawAdultsHeatmap() {
  var id = "chart-adults-heatmap";
  var m = { top: 16, right: 20, bottom: 60, left: 50 };
  var w = getW(id) - m.left - m.right;
  var h = 220 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "nhanes_sleep_habits.csv", d3.autoType).then(function(data) {
    var keys = Object.keys(data[0]);
    var ageKey   = keys.find(function(k){return k.toLowerCase().indexOf("age") > -1;}) || keys[0];
    var shortKey = keys.find(function(k){return k.toLowerCase().indexOf("short") > -1;}) || keys[1];
    var adKey    = keys.find(function(k){return k.toLowerCase().indexOf("adeq") > -1 || k.toLowerCase().indexOf("adequ") > -1;}) || keys[2];

    var ags   = data.map(function(d){return String(d[ageKey]);});
    var types = ["Short sleep","Adequate sleep"];
    var x0 = d3.scaleBand().domain(ags).range([0,w]).padding(0.28);
    var x1 = d3.scaleBand().domain(types).range([0,x0.bandwidth()]).padding(0.06);
    var y  = d3.scaleLinear().domain([0,100]).range([h,0]);
    addGrid(svg,y,w);

    var grp = svg.selectAll(".bg").data(data).join("g")
      .attr("transform",function(d){return "translate("+x0(String(d[ageKey]))+",0)";});
    grp.selectAll("rect").data(function(d){
      return [{t:"Short sleep",v:+d[shortKey]},{t:"Adequate sleep",v:+d[adKey]}];
    }).join("rect").attr("class","bar")
      .attr("x",function(d){return x1(d.t);}).attr("y",function(d){return y(d.v);})
      .attr("width",x1.bandwidth()).attr("height",function(d){return h-y(d.v);})
      .attr("fill",function(d){return d.t==="Short sleep"?C1:C4;});
    grp.selectAll(".bl").data(function(d){
      return [{t:"Short sleep",v:+d[shortKey]},{t:"Adequate sleep",v:+d[adKey]}];
    }).join("text").attr("class","annotation")
      .attr("x",function(d){return x1(d.t)+x1.bandwidth()/2;})
      .attr("y",function(d){return y(d.v)-4;}).attr("text-anchor","middle")
      .text(function(d){return d.v+"%";});

    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x0));
    svg.append("g").attr("class","axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d+"%";}));
    var leg = svg.append("g").attr("transform","translate(0,"+(h+42)+")");
    types.forEach(function(t,i){
      var g=leg.append("g").attr("transform","translate("+(i*150)+",0)");
      g.append("rect").attr("width",10).attr("height",10).attr("fill",i===0?C1:C4);
      g.append("text").attr("x",14).attr("y",9).attr("class","annotation").text(t);
    });
  });
}

// older adults lollipop — % insufficient by age subgroup
function drawOlderSleep() {
  var id = "chart-older-sleep";
  var m = { top: 16, right: 70, bottom: 36, left: 100 };
  var w = getW(id) - m.left - m.right;
  var h = 180 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");
  var data = [
    {label:"65–74",pct:29},{label:"75–84",pct:33},{label:"85+",pct:38}
  ];
  var x = d3.scaleLinear().domain([0,50]).range([0,w]);
  var y = d3.scaleBand().domain(data.map(function(d){return d.label;})).range([0,h]).padding(0.35);
  addGrid(svg, d3.scaleLinear().domain([0,50]).range([h,0]), w);
  svg.selectAll(".ll").data(data).join("line").attr("class","lollipop-line")
    .attr("x1",0).attr("x2",function(d){return x(d.pct);})
    .attr("y1",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("y2",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("stroke",RULE).attr("stroke-width",1.5);
  svg.selectAll(".ld").data(data).join("circle").attr("class","lollipop-dot")
    .attr("cx",function(d){return x(d.pct);}).attr("cy",function(d){return y(d.label)+y.bandwidth()/2;})
    .attr("r",7).attr("fill",function(d,i){return [C3,C2,C1][i];});
  svg.selectAll(".vl").data(data).join("text").attr("class","annotation")
    .attr("x",function(d){return x(d.pct)+10;})
    .attr("y",function(d){return y(d.label)+y.bandwidth()/2+4;})
    .text(function(d){return d.pct+"%";});
  svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
    .call(d3.axisBottom(x).ticks(5).tickFormat(function(d){return d+"%";}));
  svg.append("g").attr("class","axis").call(d3.axisLeft(y));
}

// older adults slope — cognitive / depression
function drawOlderMental() {
  var id = "chart-older-mental";
  var totalW = getW(id) || 520;
  var h = 260;
  var labelColW = 200;
  var lineW = Math.max(80, totalW - labelColW - 60);
  var m = { top: 28, left: 20, right: 20, bottom: 20 };

  var svg = d3.select("#" + id).append("svg")
    .attr("width", totalW).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "older_adults_mental_cognitive_sleep.csv", d3.autoType).then(function(raw) {
    // build rows: one per metric × sleep status
    var metrics = [
      { key: "pct_depression",             label: "Depression" },
      { key: "pct_cognitive_impairment_risk", label: "Cognitive impairment risk" },
      { key: "pct_poor_wellbeing",          label: "Poor wellbeing" }
    ];

    // find short and adequate rows
    var shortRow    = raw.find(function(d){ return d.sleep_status.indexOf("Short") > -1; });
    var adequateRow = raw.find(function(d){ return d.sleep_status.indexOf("Adequate") > -1; });
    if (!shortRow || !adequateRow) return;

    var rowH = h / metrics.length;
    var lineStartX = labelColW;
    var lineEndX   = labelColW + lineW;
    var cols = [C1, C2, C3];

    svg.append("text").attr("class","annotation")
      .attr("x", lineStartX).attr("y", -10)
      .attr("text-anchor","middle").attr("fill", C1).text("Short sleep");
    svg.append("text").attr("class","annotation")
      .attr("x", lineEndX).attr("y", -10)
      .attr("text-anchor","middle").attr("fill", C4).text("Adequate sleep");

    metrics.forEach(function(metric, i) {
      var col      = cols[i];
      var cy       = rowH * i + rowH / 2;
      var shortVal = +shortRow[metric.key];
      var adVal    = +adequateRow[metric.key];

      svg.append("text").attr("class","annotation")
        .attr("x", labelColW - 14).attr("y", cy + 4)
        .attr("text-anchor","end").attr("fill", col)
        .text(metric.label);

      svg.append("text").attr("class","annotation")
        .attr("x", lineStartX + 6).attr("y", cy - 7)
        .attr("text-anchor","start").attr("fill", col)
        .text(shortVal + "%");

      svg.append("line")
        .attr("x1", lineStartX).attr("x2", lineEndX)
        .attr("y1", cy).attr("y2", cy)
        .attr("stroke", col).attr("stroke-width", 2).attr("stroke-opacity", 0.7);

      svg.append("circle").attr("cx", lineStartX).attr("cy", cy)
        .attr("r", 6).attr("fill", col);

      svg.append("circle").attr("cx", lineEndX).attr("cy", cy)
        .attr("r", 6).attr("fill","#fff").attr("stroke", col).attr("stroke-width", 2);

      svg.append("text").attr("class","annotation")
        .attr("x", lineEndX + 10).attr("y", cy + 4)
        .attr("text-anchor","start").text(adVal + "%");
    });
  });
}

// older adults grouped bars — CVD, diabetes, obesity, hypertension
function drawOlderPhysical() {
  var id = "chart-older-physical";
  var m = { top: 16, right: 20, bottom: 60, left: 44 };
  var w = getW(id) - m.left - m.right;
  var h = 300 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");
  var data = [
    {c:"CVD",s:38,a:24},{c:"Diabetes",s:32,a:21},
    {c:"Obesity",s:41,a:29},{c:"Hypertension",s:68,a:54}
  ];
  var x0 = d3.scaleBand().domain(data.map(function(d){return d.c;})).range([0,w]).padding(0.28);
  var x1 = d3.scaleBand().domain(["s","a"]).range([0,x0.bandwidth()]).padding(0.08);
  var y  = d3.scaleLinear().domain([0,80]).range([h,0]);
  addGrid(svg,y,w);
  var grp = svg.selectAll(".bg").data(data).join("g")
    .attr("transform",function(d){return "translate("+x0(d.c)+",0)";});
  grp.selectAll("rect").data(function(d){return [{k:"s",v:d.s},{k:"a",v:d.a}];})
    .join("rect").attr("class","bar")
    .attr("x",function(d){return x1(d.k);}).attr("y",function(d){return y(d.v);})
    .attr("width",x1.bandwidth()).attr("height",function(d){return h-y(d.v);})
    .attr("fill",function(d){return d.k==="s"?C1:C4;});
  grp.selectAll(".bl").data(function(d){return [{k:"s",v:d.s},{k:"a",v:d.a}];})
    .join("text").attr("class","annotation")
    .attr("x",function(d){return x1(d.k)+x1.bandwidth()/2;})
    .attr("y",function(d){return y(d.v)-4;}).attr("text-anchor","middle")
    .text(function(d){return d.v+"%";});
  svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
    .call(d3.axisBottom(x0));
  svg.append("g").attr("class","axis")
    .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){return d+"%";}));
  var leg=svg.append("g").attr("transform","translate(0,"+(h+42)+")");
  [{k:"s",l:"Poor/short sleep"},{k:"a",l:"Adequate sleep"}].forEach(function(item,i){
    var g=leg.append("g").attr("transform","translate("+(i*170)+",0)");
    g.append("rect").attr("width",10).attr("height",10).attr("fill",i===0?C1:C4);
    g.append("text").attr("x",14).attr("y",9).attr("class","annotation").text(item.l);
  });
}


// teens by sex — slope chart: Male and Female, 2013 vs 2023
function drawTeensBySex() {
  var id = "chart-teens-by-sex";
  var totalW = getW(id) || 520;
  var h = 200;
  var labelColW = 80;
  var lineW = Math.max(80, totalW - labelColW - 80);
  var m = { top: 28, left: 20, right: 20, bottom: 20 };

  var svg = d3.select("#" + id).append("svg")
    .attr("width", totalW).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "teenagers_sleep_by_group.csv", d3.autoType).then(function(raw) {
    var sexData = raw.filter(function(d){ return d.group_type === "sex"; });
    var groups = ["Male", "Female"];
    var rowH = h / groups.length;
    var lineStartX = labelColW;
    var lineEndX   = labelColW + lineW;
    var cols = { Male: C2, Female: C3 };

    svg.append("text").attr("class","annotation")
      .attr("x", lineStartX).attr("y", -10)
      .attr("text-anchor","middle").attr("fill", MUTED).text("2013");
    svg.append("text").attr("class","annotation")
      .attr("x", lineEndX).attr("y", -10)
      .attr("text-anchor","middle").attr("fill", INK).text("2023");

    groups.forEach(function(grp, i) {
      var col  = cols[grp];
      var cy   = rowH * i + rowH / 2;
      var old  = sexData.find(function(d){ return d.group === grp && +d.year === 2013; });
      var now  = sexData.find(function(d){ return d.group === grp && +d.year === 2023; });
      if (!old || !now) return;

      svg.append("text").attr("class","annotation")
        .attr("x", labelColW - 10).attr("y", cy + 4)
        .attr("text-anchor","end").attr("fill", col).text(grp);

      svg.append("text").attr("class","annotation")
        .attr("x", lineStartX + 6).attr("y", cy - 7)
        .attr("text-anchor","start").attr("fill", col)
        .text(old.pct_sufficient_sleep + "%");

      svg.append("line")
        .attr("x1", lineStartX).attr("x2", lineEndX)
        .attr("y1", cy).attr("y2", cy)
        .attr("stroke", col).attr("stroke-width", 2.5).attr("stroke-opacity", 0.75);

      svg.append("circle").attr("cx", lineStartX).attr("cy", cy)
        .attr("r", 6).attr("fill", col);

      svg.append("circle").attr("cx", lineEndX).attr("cy", cy)
        .attr("r", 6).attr("fill","#fff").attr("stroke", col).attr("stroke-width", 2);

      svg.append("text").attr("class","annotation")
        .attr("x", lineEndX + 10).attr("y", cy + 4)
        .attr("text-anchor","start").text(now.pct_sufficient_sleep + "%");
    });
  });
}

// overview — all ages sleep sufficiency grouped bars
function drawAllAgesSufficiency() {
  var id = "chart-all-ages";
  var m = { top: 16, right: 20, bottom: 60, left: 50 };
  var w = getW(id) - m.left - m.right;
  var h = 280 - m.top - m.bottom;
  var svg = d3.select("#" + id).append("svg")
    .attr("width", w + m.left + m.right).attr("height", h + m.top + m.bottom)
    .append("g").attr("transform", "translate(" + m.left + "," + m.top + ")");

  d3.csv(DATA + "all_ages_sleep_sufficiency.csv", d3.autoType).then(function(data) {
    data = data.filter(function(d){ return d.age_group && !isNaN(+d.pct_insufficient); });

    var ages    = data.map(function(d){ return d.age_group; });
    var types   = ["pct_insufficient", "pct_sufficient"];
    var labels  = { pct_insufficient: "Not enough sleep", pct_sufficient: "Enough sleep" };
    var cols    = [C1, C4];

    var x0 = d3.scaleBand().domain(ages).range([0, w]).padding(0.28);
    var x1 = d3.scaleBand().domain(types).range([0, x0.bandwidth()]).padding(0.06);
    var y  = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    addGrid(svg, y, w);

    var grp = svg.selectAll(".bg").data(data).join("g")
      .attr("transform", function(d){ return "translate(" + x0(d.age_group) + ",0)"; });

    grp.selectAll("rect")
      .data(function(d){ return types.map(function(t){ return { t: t, v: +d[t] }; }); })
      .join("rect").attr("class","bar")
      .attr("x", function(d){ return x1(d.t); })
      .attr("y", function(d){ return y(d.v); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d){ return h - y(d.v); })
      .attr("fill", function(d, i){ return cols[i]; });

    grp.selectAll(".bl")
      .data(function(d){ return types.map(function(t){ return { t: t, v: +d[t] }; }); })
      .join("text").attr("class","annotation")
      .attr("x", function(d){ return x1(d.t) + x1.bandwidth() / 2; })
      .attr("y", function(d){ return y(d.v) - 4; })
      .attr("text-anchor","middle")
      .text(function(d){ return d.v + "%"; });

    svg.append("g").attr("class","axis").attr("transform","translate(0,"+h+")")
      .call(d3.axisBottom(x0).tickSize(0));
    svg.append("g").attr("class","axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){ return d + "%"; }));

    var leg = svg.append("g").attr("transform","translate(0,"+(h+42)+")");
    types.forEach(function(t, i){
      var g = leg.append("g").attr("transform","translate("+(i*180)+",0)");
      g.append("rect").attr("width",10).attr("height",10).attr("fill",cols[i]);
      g.append("text").attr("x",14).attr("y",9).attr("class","annotation").text(labels[t]);
    });
  });
}

function init() {
  drawAllAgesSufficiency();
  drawChildrenSleep();
  drawChildrenMental();
  drawChildrenPhysical();
  drawTeensSleep();
  drawTeensMental();
  drawTeensBySex();
  drawTeensPhysical();
  drawYoungAdultsSleep();
  drawYoungAdultsMental();
  drawYoungAdultsPhysical();
  drawAdultsSleep();
  drawAdultsMental();
  drawAdultsPhysical();
  drawAdultsHeatmap();
  drawOlderSleep();
  drawOlderMental();
  drawOlderPhysical();
}

init();
