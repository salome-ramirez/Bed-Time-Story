// --- Globals & Color Palette ---
var COLOR_PAPER = "#f5ecd9";
var COLOR_PAPER_RULE = "#c9b896";
var COLOR_INK = "#3d2f1c";
var COLOR_INK_LIGHT = "#6b5638";
var COLOR_INK_RULE = "#8b6f47";

var COLOR_GOOD = "#c89432";
var COLOR_MID = "#5d4f8a";
var COLOR_BAD = "#1f3a6b";

var COLOR_NIGHT = "#1a2540";
var COLOR_MOON = "#f4d488";
var COLOR_RING = "#3d4a6e";
var COLOR_NIGHT_LABEL = "#ffffff";
var COLOR_NIGHT_CAPTION = "#e8e6e0";

var STAR_SIZE_TINY = 8;
var STAR_SIZE_LEGEND = 18;

// --- Helper Functions ---
var starPathCache = {};
function starPath(size) {
    if (!starPathCache[size]) {
        starPathCache[size] = d3.symbol().type(d3.symbolStar).size(size)();
    }
    return starPathCache[size];
}

function colorByAttention(score) {
    if (score >= 65) return COLOR_GOOD;
    if (score >= 45) return COLOR_MID;
    return COLOR_BAD;
}

function nightColorByAttention(score) {
    if (score >= 65) return COLOR_MOON;
    if (score >= 45) return "#c4a8d1";
    return "#7d8eb0";
}

function colorByBMI(p) {
    if (p <= 50) return COLOR_GOOD;
    if (p <= 75) return COLOR_MID;
    return COLOR_BAD;
}

function colorByAnxiety(score) {
    if (score < 5) return COLOR_GOOD;
    if (score < 10) return COLOR_MID;
    return COLOR_BAD;
}

function nightColorByAnxiety(score) {
    if (score < 5) return COLOR_MOON;
    if (score < 10) return "#c4a8d1";
    return "#7d8eb0";
}

function colorByBurnout(score) {
    if (score < 30) return COLOR_GOOD;
    if (score < 60) return COLOR_MID;
    return COLOR_BAD;
}

function nightColorByBurnout(score) {
    if (score < 30) return COLOR_MOON;
    if (score < 60) return "#c4a8d1";
    return "#7d8eb0";
}

function colorByBP(systolic) {
    if (systolic < 120) return COLOR_GOOD;
    if (systolic < 130) return COLOR_MID;
    return COLOR_BAD;
}

function nightColorByBP(systolic) {
    if (systolic < 120) return COLOR_MOON;
    if (systolic < 130) return "#c4a8d1";
    return "#7d8eb0";
}

function colorByCognitive(score) {
    if (score >= 26) return COLOR_GOOD;
    if (score >= 22) return COLOR_MID;
    return COLOR_BAD;
}

function nightColorByCognitive(score) {
    if (score >= 26) return COLOR_MOON;
    if (score >= 22) return "#c4a8d1";
    return "#7d8eb0";
}

var tooltip = d3.select("body").append("div")
    .attr("class", "chart-tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("background", "rgba(15, 22, 40, 0.96)")
    .style("color", "#f5ecd9")
    .style("border", "1px solid #4d4060")
    .style("border-left", "3px solid #c89432")
    .style("padding", "12px 18px 12px 16px")
    .style("font-family", "'Crimson Pro', Georgia, serif")
    .style("font-style", "italic")
    .style("font-size", "14px")
    .style("line-height", "1.55")
    .style("z-index", 100)
    .style("min-width", "180px")
    .style("max-width", "280px")
    .style("border-radius", "2px")
    .style("box-shadow", "0 4px 18px rgba(15, 22, 40, 0.45)");

function showTip(event, html) {
    tooltip.html(html)
        .style("left", (event.pageX + 16) + "px")
        .style("top", (event.pageY - 12) + "px")
        .transition().duration(150).style("opacity", 1);
}
function moveTip(event) {
    tooltip.style("left", (event.pageX + 16) + "px")
        .style("top", (event.pageY - 12) + "px");
}
function hideTip() {
    tooltip.transition().duration(200).style("opacity", 0);
}

function watchForScrollIn(canvasEl, onEnter) {
    var triggered = false;
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting && !triggered) {
                triggered = true;
                onEnter();
                io.disconnect();
            }
        });
    }, { threshold: 0.2 });
    io.observe(canvasEl);
}


// --- Chapter 1: Children ---

function drawPlate1Orbit(data) {
    var canvas = document.getElementById("canvas-1-1");

    var w = canvas.clientWidth;
    var h = 560;
    var cx = w / 2;
    var cy = h / 2 + 6;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var maxRadius = Math.min(cx - 60, cy - 80);
    var rScale = d3.scaleLinear().domain([12, 3]).range([0, maxRadius]).clamp(true);

    var ringHours = [10, 8, 6];
    svg.selectAll(".ring")
        .data(ringHours).enter().append("circle")
        .attr("class", "ring")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", function (d) { return rScale(d); })
        .attr("fill", "none")
        .attr("stroke", COLOR_RING)
        .attr("stroke-width", 1.1)
        .attr("opacity", 0.95);

    ringHours.forEach(function (hr) {
        var labelAngle = -Math.PI / 2 + 0.18;
        var lx = cx + Math.cos(labelAngle) * rScale(hr);
        var ly = cy + Math.sin(labelAngle) * rScale(hr);
        svg.append("rect")
            .attr("x", lx - 22).attr("y", ly - 9)
            .attr("width", 44).attr("height", 17).attr("rx", 2)
            .attr("fill", COLOR_NIGHT);
        svg.append("text")
            .attr("x", lx).attr("y", ly + 4)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(hr + " h");
    });

    svg.append("text")
        .attr("x", cx).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("distance from the moon = hours short of the recommended 10");

    var moonG = svg.append("g");
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 48).attr("fill", COLOR_MOON).attr("opacity", 0.14);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 38).attr("fill", COLOR_MOON).attr("opacity", 0.28);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 30).attr("fill", COLOR_MOON);
    moonG.append("circle").attr("cx", cx - 12).attr("cy", cy - 9).attr("r", 24).attr("fill", COLOR_NIGHT);

    data.sort(function (a, b) {
        var aTier = +a.attention_score >= 65 ? 0 : +a.attention_score >= 45 ? 1 : 2;
        var bTier = +b.attention_score >= 65 ? 0 : +b.attention_score >= 45 ? 1 : 2;
        return aTier - bTier;
    });

    data.forEach(function (d, i) {
        var randomAngle = (i / data.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
        var jitterR = (Math.random() - 0.5) * 8;
        d.angle = randomAngle;
        d.r = rScale(+d.total_sleep) + jitterR;
        d.x = cx + Math.cos(d.angle) * d.r;
        d.y = cy + Math.sin(d.angle) * d.r;
        d.color = nightColorByAttention(+d.attention_score);
    });

    var stars = svg.selectAll(".star")
        .data(data).enter().append("path")
        .attr("class", "star")
        .attr("d", starPath(STAR_SIZE_TINY))
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(0)"; })
        .attr("fill", function (d) { return d.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .raise()
                .transition().duration(120)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(2.5)")
                .attr("opacity", 1);
            showTip(event,
                "<strong style='color:" + d.color + ";font-style:normal;font-weight:500;'>Child #" + d.id + "</strong><br>" +
                "slept: " + (+d.total_sleep).toFixed(1) + " h<br>" +
                "attention score: " + Math.round(+d.attention_score)
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(1)")
                .attr("opacity", 0.65);
            hideTip();
        });

    var legendY = h - 24;
    svg.append("line")
        .attr("x1", 30).attr("x2", w - 30)
        .attr("y1", legendY - 22).attr("y2", legendY - 22)
        .attr("stroke", "#3a4868").attr("stroke-width", 0.5);

    svg.append("text")
        .attr("x", 30).attr("y", legendY)
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("color = attention score:");

    var legendItems = [
        { color: COLOR_MOON, label: "above average", x: 200 },
        { color: "#c4a8d1", label: "average", x: 348 },
        { color: "#7d8eb0", label: "below average", x: 458 }
    ];
    legendItems.forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (item.x + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", item.x + 20).attr("y", legendY)
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
    });

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return (i % 100) * 6 + Math.random() * 200; })
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(1)"; })
            .attr("opacity", 0.65);

        var avgSleep = d3.mean(data, function (d) { return +d.total_sleep; });
        var avgR = rScale(avgSleep);
        var avgAngle = Math.PI / 4;
        var avgX = cx + Math.cos(avgAngle) * avgR;
        var avgY = cy + Math.sin(avgAngle) * avgR;

        var labelX = cx + Math.cos(avgAngle) * (avgR + 60);
        var labelY = cy + Math.sin(avgAngle) * (avgR + 60);

        var ringEl = svg.append("circle")
            .attr("cx", avgX).attr("cy", avgY).attr("r", 0)
            .attr("fill", "none").attr("stroke", COLOR_MOON).attr("stroke-width", 1)
            .attr("opacity", 0.7);
        var leaderLine = svg.append("line")
            .attr("x1", avgX + Math.cos(avgAngle) * 14)
            .attr("y1", avgY + Math.sin(avgAngle) * 14)
            .attr("x2", avgX + Math.cos(avgAngle) * 14)
            .attr("y2", avgY + Math.sin(avgAngle) * 14)
            .attr("stroke", COLOR_MOON).attr("stroke-width", 0.6)
            .attr("opacity", 0.6).attr("stroke-dasharray", "2 3");
        var label1 = svg.append("text")
            .attr("x", labelX).attr("y", labelY - 4)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_MOON)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("the average child");
        var label2 = svg.append("text")
            .attr("x", labelX).attr("y", labelY + 12)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text("slept " + avgSleep.toFixed(1) + " hours");

        ringEl.transition().delay(1400).duration(700).attr("r", 16);
        leaderLine.transition().delay(1500).duration(500)
            .attr("x2", labelX - 4).attr("y2", labelY - 4);
        label1.transition().delay(1700).duration(500).attr("opacity", 1);
        label2.transition().delay(1900).duration(500).attr("opacity", 1);
    });
}

function drawPlate2Ridgeline(data) {
    var canvas = document.getElementById("canvas-1-2");

    var w = canvas.clientWidth;
    var h = 480;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var bands = [
        { label: "10\u201312 h", lo: 10, hi: 12.5, color: COLOR_GOOD },
        { label: "9\u201310 h", lo: 9, hi: 10, color: "#9d6f4a" },
        { label: "8\u20139 h", lo: 8, hi: 9, color: COLOR_MID },
        { label: "7\u20138 h", lo: 7, hi: 8, color: "#3d3f7a" },
        { label: "under 7 h", lo: 0, hi: 7, color: COLOR_BAD }
    ];

    var leftMargin = 110;
    var rightMargin = 30;
    var topMargin = 40;
    var bottomMargin = 60;
    var ridgeAreaW = w - leftMargin - rightMargin;
    var ridgeAreaH = h - topMargin - bottomMargin;
    var ridgeSpacing = ridgeAreaH / bands.length;

    var xScale = d3.scaleLinear().domain([20, 100]).range([leftMargin, w - rightMargin]);

    [{ v: 30, label: "low" }, { v: 50, label: "below avg" }, { v: 70, label: "average" }, { v: 90, label: "above avg" }].forEach(function (t) {
        svg.append("line")
            .attr("x1", xScale(t.v)).attr("x2", xScale(t.v))
            .attr("y1", topMargin).attr("y2", h - bottomMargin)
            .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.5).attr("stroke-dasharray", "2 4").attr("opacity", 0.7);
        svg.append("text")
            .attr("x", xScale(t.v)).attr("y", h - bottomMargin + 18)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(t.label);
    });

    svg.append("text")
        .attr("x", w / 2).attr("y", h - 12)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("attention score");

    function kde(values, bandwidth, xs) {
        return xs.map(function (x) {
            var sum = 0;
            values.forEach(function (v) {
                var u = (x - v) / bandwidth;
                sum += Math.exp(-0.5 * u * u);
            });
            return sum / (values.length * bandwidth * Math.sqrt(2 * Math.PI));
        });
    }

    var xs = d3.range(20, 101, 2);
    var ridges = [];

    bands.forEach(function (band, i) {
        var subset = data.filter(function (d) {
            var s = +d.total_sleep;
            return s >= band.lo && s < band.hi;
        });
        if (subset.length === 0) return;

        var values = subset.map(function (d) { return +d.attention_score; });
        var density = kde(values, 8, xs);
        var maxDens = d3.max(density);
        var ridgeBaseY = topMargin + (i + 0.6) * ridgeSpacing;
        var ridgeHeight = ridgeSpacing * 0.9;

        var area = d3.area()
            .x(function (d, j) { return xScale(xs[j]); })
            .y0(ridgeBaseY)
            .y1(function (d) { return ridgeBaseY - (d / maxDens) * ridgeHeight; })
            .curve(d3.curveCatmullRom);

        var line = d3.line()
            .x(function (d, j) { return xScale(xs[j]); })
            .y(function (d) { return ridgeBaseY - (d / maxDens) * ridgeHeight; })
            .curve(d3.curveCatmullRom);

        var areaPath = svg.append("path")
            .datum(density)
            .attr("d", area)
            .attr("fill", band.color)
            .attr("opacity", 0)
            .attr("transform", "translate(0, 30)");

        var linePath = svg.append("path")
            .datum(density)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", band.color)
            .attr("stroke-width", 1.4)
            .attr("opacity", 0)
            .attr("transform", "translate(0, 30)");

        var labelText = svg.append("text")
            .attr("x", 100).attr("y", ridgeBaseY - ridgeHeight + 8)
            .attr("text-anchor", "end")
            .attr("fill", band.color)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "15px")
            .style("font-weight", "500")
            .text(band.label);

        var nText = svg.append("text")
            .attr("x", 100).attr("y", ridgeBaseY - ridgeHeight + 26)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK_LIGHT)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "11px")
            .text("n = " + subset.length);

        ridges.push({ areaPath: areaPath, linePath: linePath, labelText: labelText, nText: nText, idx: i });

        var hoverArea = svg.append("rect")
            .attr("x", leftMargin)
            .attr("y", ridgeBaseY - ridgeHeight)
            .attr("width", ridgeAreaW)
            .attr("height", ridgeHeight)
            .attr("fill", "transparent")
            .style("cursor", "pointer");

        hoverArea
            .on("mouseover", function (event) {
                var meanAtt = d3.mean(values);
                showTip(event,
                    "<strong style='color:" + band.color + ";font-style:normal;font-weight:500;'>" + band.label + " of sleep</strong><br>" +
                    subset.length + " children<br>" +
                    "average attention: " + Math.round(meanAtt) + " / 100"
                );
            })
            .on("mousemove", moveTip)
            .on("mouseout", hideTip);
    });

    svg.append("line")
        .attr("x1", leftMargin).attr("x2", leftMargin)
        .attr("y1", topMargin).attr("y2", h - bottomMargin)
        .attr("stroke", COLOR_INK_RULE).attr("stroke-width", 0.5);
    svg.append("line")
        .attr("x1", leftMargin).attr("x2", w - rightMargin)
        .attr("y1", h - bottomMargin).attr("y2", h - bottomMargin)
        .attr("stroke", COLOR_INK_RULE).attr("stroke-width", 0.5);

    watchForScrollIn(canvas, function () {
        ridges.forEach(function (ridge) {
            var delay = ridge.idx * 180;
            ridge.areaPath
                .transition().delay(delay).duration(900)
                .attr("transform", "translate(0, 0)")
                .attr("opacity", 0.5);
            ridge.linePath
                .transition().delay(delay).duration(900)
                .attr("transform", "translate(0, 0)")
                .attr("opacity", 1);
            ridge.labelText
                .transition().delay(delay + 200).duration(500)
                .attr("opacity", 1);
            ridge.nText
                .transition().delay(delay + 300).duration(500)
                .attr("opacity", 1);
        });
    });
}

function hexbinChildren(data, xScale, yScale, hexRadius) {
    var bins = {};
    var hexHeight = hexRadius * Math.sqrt(3);

    data.forEach(function (d) {
        var px = xScale(+d.total_sleep);
        var py = yScale(+d.bmi_percentile);

        var col = Math.round(px / (hexRadius * 1.5));
        var rowOffset = (col % 2) * hexHeight / 2;
        var row = Math.round((py - rowOffset) / hexHeight);

        var key = col + "_" + row;
        if (!bins[key]) {
            bins[key] = {
                col: col, row: row,
                cx: col * hexRadius * 1.5,
                cy: row * hexHeight + rowOffset,
                children: []
            };
        }
        bins[key].children.push(d);
    });

    var binArray = Object.keys(bins).map(function (k) {
        var b = bins[k];
        var counts = { healthy: 0, elevated: 0, overweight: 0 };
        var sumSleep = 0;
        var sumBMI = 0;
        b.children.forEach(function (d) {
            sumSleep += +d.total_sleep;
            sumBMI += +d.bmi_percentile;
            var bmi = +d.bmi_percentile;
            if (bmi <= 50) counts.healthy++;
            else if (bmi <= 75) counts.elevated++;
            else counts.overweight++;
        });
        var dominant = "healthy";
        if (counts.elevated >= counts.healthy && counts.elevated >= counts.overweight) dominant = "elevated";
        if (counts.overweight >= counts.healthy && counts.overweight >= counts.elevated) dominant = "overweight";

        b.count = b.children.length;
        b.dominant = dominant;
        b.color = dominant === "healthy" ? COLOR_GOOD : dominant === "elevated" ? COLOR_MID : COLOR_BAD;
        b.avgSleep = sumSleep / b.count;
        b.avgBMI = sumBMI / b.count;
        return b;
    });

    return binArray;
}

function drawPlate3Fall(data) {
    var canvas = document.getElementById("canvas-1-3");

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var leftMargin = 100;
    var rightMargin = 40;
    var topMargin = 80;
    var bottomMargin = 80;
    var plotW = w - leftMargin - rightMargin;
    var plotH = h - topMargin - bottomMargin;

    var xScale = d3.scaleLinear().domain([5, 12]).range([leftMargin, w - rightMargin]);
    var yScale = d3.scaleLinear().domain([0, 100]).range([topMargin, h - bottomMargin]);

    [25, 50, 75, 95].forEach(function (yval) {
        svg.append("line")
            .attr("x1", leftMargin).attr("x2", w - rightMargin)
            .attr("y1", yScale(yval)).attr("y2", yScale(yval))
            .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.5).attr("stroke-dasharray", "2 4").attr("opacity", 0.7);
    });

    var yLabels = [
        { v: 25, label: "healthy" },
        { v: 50, label: "elevated" },
        { v: 75, label: "overweight" },
        { v: 95, label: "obese" }
    ];
    yLabels.forEach(function (l) {
        svg.append("text")
            .attr("x", leftMargin - 10).attr("y", yScale(l.v) + 5)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(l.label);
    });

    svg.append("text")
        .attr("x", 26).attr("y", topMargin + plotH / 2)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .attr("transform", "rotate(-90 26," + (topMargin + plotH / 2) + ")")
        .text("BMI percentile");

    [5, 7, 9, 11].forEach(function (hr) {
        svg.append("text")
            .attr("x", xScale(hr)).attr("y", h - bottomMargin + 24)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(hr + " h");
    });

    svg.append("text")
        .attr("x", w / 2).attr("y", h - 14)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("hours of sleep");

    svg.append("line")
        .attr("x1", leftMargin).attr("x2", leftMargin)
        .attr("y1", topMargin).attr("y2", h - bottomMargin)
        .attr("stroke", COLOR_INK_RULE).attr("stroke-width", 0.6);
    svg.append("line")
        .attr("x1", leftMargin).attr("x2", w - rightMargin)
        .attr("y1", h - bottomMargin).attr("y2", h - bottomMargin)
        .attr("stroke", COLOR_INK_RULE).attr("stroke-width", 0.6);

    var hexRadius = 28;
    var bins = hexbinChildren(data, xScale, yScale, hexRadius);

    bins = bins.filter(function (b) {
        return b.cx >= leftMargin - 4 && b.cx <= w - rightMargin + 4
            && b.cy >= topMargin - 4 && b.cy <= h - bottomMargin + 4;
    });

    var maxCount = d3.max(bins, function (b) { return b.count; });
    var sizeScale = d3.scaleSqrt().domain([1, maxCount]).range([24, 320]);

    var hexStars = svg.selectAll(".hex-star")
        .data(bins).enter().append("path")
        .attr("class", "hex-star")
        .attr("d", function (d) { return starPath(sizeScale(d.count)); })
        .attr("transform", function (d) { return "translate(" + d.cx + "," + d.cy + ") scale(0)"; })
        .attr("fill", function (d) { return d.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .raise()
                .transition().duration(120)
                .attr("transform", "translate(" + d.cx + "," + d.cy + ") scale(1.15)")
                .attr("opacity", 1)
                .attr("stroke", d.color).attr("stroke-width", 1.5);
            var dominantLabel = d.dominant === "healthy" ? "healthy BMI"
                : d.dominant === "elevated" ? "elevated BMI"
                : "overweight or higher";
            showTip(event,
                "<strong style='color:" + d.color + ";font-style:normal;font-weight:500;'>" + d.count + " children</strong><br>" +
                "average sleep: " + d.avgSleep.toFixed(1) + " h<br>" +
                "average BMI percentile: " + Math.round(d.avgBMI) + "<br>" +
                "mostly: " + dominantLabel
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + d.cx + "," + d.cy + ") scale(1)")
                .attr("opacity", 0.92)
                .attr("stroke", "none");
            hideTip();
        });

    var calloutTop = svg.append("text")
        .attr("x", w - rightMargin - 16).attr("y", topMargin - 8)
        .attr("text-anchor", "end")
        .attr("fill", COLOR_GOOD)
        .attr("opacity", 0)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("well rested, healthy bodies \u2192");

    var calloutBot = svg.append("text")
        .attr("x", leftMargin + 90).attr("y", h - bottomMargin - 10)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_BAD)
        .attr("opacity", 0)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("\u2190 the cohort that fell");

    var legendY = topMargin - 32;
    var legendItems = [
        { color: COLOR_GOOD, label: "mostly healthy BMI" },
        { color: COLOR_MID, label: "mostly elevated" },
        { color: COLOR_BAD, label: "mostly overweight" }
    ];
    var lx = leftMargin;
    legendItems.forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (lx + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", lx + 20).attr("y", legendY)
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
        lx += 18 + (item.label.length * 7) + 18;
    });

    svg.append("text")
        .attr("x", leftMargin).attr("y", legendY - 18)
        .attr("text-anchor", "start")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("each star aggregates the children near that point, size = how many");

    watchForScrollIn(canvas, function () {
        hexStars
            .transition()
            .delay(function (d, i) { return i * 25 + Math.random() * 100; })
            .duration(800)
            .ease(d3.easeBackOut.overshoot(1.2))
            .attr("transform", function (d) { return "translate(" + d.cx + "," + d.cy + ") scale(1)"; })
            .attr("opacity", 0.92);

        calloutTop.transition().delay(1400).duration(600).attr("opacity", 1);
        calloutBot.transition().delay(1700).duration(600).attr("opacity", 1);
    });
}


// --- Chapter 2: Teenagers ---

function drawPlate2_1Orbit(data) {
    var canvas = document.getElementById("canvas-2-1");

    var w = canvas.clientWidth;
    var h = 560;
    var cx = w / 2;
    var cy = h / 2 + 6;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var maxRadius = Math.min(cx - 60, cy - 80);
    var rScale = d3.scaleLinear().domain([12, 3]).range([0, maxRadius]).clamp(true);

    var ringHours = [9, 7, 5];
    svg.selectAll(".ring")
        .data(ringHours).enter().append("circle")
        .attr("class", "ring")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", function (d) { return rScale(d); })
        .attr("fill", "none")
        .attr("stroke", COLOR_RING)
        .attr("stroke-width", 1.1)
        .attr("opacity", 0.95);

    ringHours.forEach(function (hr) {
        var labelAngle = -Math.PI / 2 + 0.18;
        var lx = cx + Math.cos(labelAngle) * rScale(hr);
        var ly = cy + Math.sin(labelAngle) * rScale(hr);
        svg.append("rect")
            .attr("x", lx - 22).attr("y", ly - 9)
            .attr("width", 44).attr("height", 17).attr("rx", 2)
            .attr("fill", COLOR_NIGHT);
        svg.append("text")
            .attr("x", lx).attr("y", ly + 4)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(hr + " h");
    });

    svg.append("text")
        .attr("x", cx).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("distance from the moon = hours short of the recommended 9");

    var moonG = svg.append("g");
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 48).attr("fill", COLOR_MOON).attr("opacity", 0.14);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 38).attr("fill", COLOR_MOON).attr("opacity", 0.28);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 30).attr("fill", COLOR_MOON);
    moonG.append("circle").attr("cx", cx - 12).attr("cy", cy - 9).attr("r", 24).attr("fill", COLOR_NIGHT);

    data.sort(function (a, b) {
        var aTier = +a.anxiety_score < 5 ? 0 : +a.anxiety_score < 10 ? 1 : 2;
        var bTier = +b.anxiety_score < 5 ? 0 : +b.anxiety_score < 10 ? 1 : 2;
        return aTier - bTier;
    });

    data.forEach(function (d, i) {
        var randomAngle = (i / data.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
        var jitterR = (Math.random() - 0.5) * 8;
        d.angle = randomAngle;
        d.r = rScale(+d.total_sleep) + jitterR;
        d.x = cx + Math.cos(d.angle) * d.r;
        d.y = cy + Math.sin(d.angle) * d.r;
        d.color = nightColorByAnxiety(+d.anxiety_score);
    });

    var stars = svg.selectAll(".star")
        .data(data).enter().append("path")
        .attr("class", "star")
        .attr("d", starPath(STAR_SIZE_TINY))
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(0)"; })
        .attr("fill", function (d) { return d.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this).raise()
                .transition().duration(120)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(2.5)")
                .attr("opacity", 1);
            var tier = +d.anxiety_score < 5 ? "low anxiety" : +d.anxiety_score < 10 ? "moderate anxiety" : "elevated anxiety";
            showTip(event,
                "<strong style='color:" + d.color + ";font-style:normal;font-weight:500;'>Teen #" + d.id + "</strong><br>" +
                "slept: " + (+d.total_sleep).toFixed(1) + " h<br>" +
                "anxiety score: " + Math.round(+d.anxiety_score) + "  " + tier
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(1)")
                .attr("opacity", 0.65);
            hideTip();
        });

    var legendY = h - 24;
    svg.append("line")
        .attr("x1", 30).attr("x2", w - 30)
        .attr("y1", legendY - 22).attr("y2", legendY - 22)
        .attr("stroke", "#3a4868").attr("stroke-width", 0.5);

    svg.append("text")
        .attr("x", 30).attr("y", legendY)
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("color = anxiety:");

    var legendItems = [
        { color: COLOR_MOON, label: "low", x: 168 },
        { color: "#c4a8d1", label: "moderate", x: 248 },
        { color: "#7d8eb0", label: "elevated", x: 360 }
    ];
    legendItems.forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (item.x + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", item.x + 20).attr("y", legendY)
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
    });

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return (i % 100) * 6 + Math.random() * 200; })
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(1)"; })
            .attr("opacity", 0.65);

        var avgSleep = d3.mean(data, function (d) { return +d.total_sleep; });
        var avgAnx = d3.mean(data, function (d) { return +d.anxiety_score; });
        var avgR = rScale(avgSleep);
        var avgAngle = Math.PI / 4;
        var avgX = cx + Math.cos(avgAngle) * avgR;
        var avgY = cy + Math.sin(avgAngle) * avgR;

        var labelX = cx + Math.cos(avgAngle) * (avgR + 60);
        var labelY = cy + Math.sin(avgAngle) * (avgR + 60);

        var ringEl = svg.append("circle")
            .attr("cx", avgX).attr("cy", avgY).attr("r", 0)
            .attr("fill", "none").attr("stroke", COLOR_MOON).attr("stroke-width", 1)
            .attr("opacity", 0.7);
        var leaderLine = svg.append("line")
            .attr("x1", avgX + Math.cos(avgAngle) * 14)
            .attr("y1", avgY + Math.sin(avgAngle) * 14)
            .attr("x2", avgX + Math.cos(avgAngle) * 14)
            .attr("y2", avgY + Math.sin(avgAngle) * 14)
            .attr("stroke", COLOR_MOON).attr("stroke-width", 0.6)
            .attr("opacity", 0.6).attr("stroke-dasharray", "2 3");
        var label1 = svg.append("text")
            .attr("x", labelX).attr("y", labelY - 4)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_MOON)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("the average teen");
        var label2 = svg.append("text")
            .attr("x", labelX).attr("y", labelY + 12)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text("slept " + avgSleep.toFixed(1) + " hours");

        ringEl.transition().delay(1400).duration(700).attr("r", 16);
        leaderLine.transition().delay(1500).duration(500)
            .attr("x2", labelX - 4).attr("y2", labelY - 4);
        label1.transition().delay(1700).duration(500).attr("opacity", 1);
        label2.transition().delay(1900).duration(500).attr("opacity", 1);
    });
}


function drawPlate2_2Radar(data) {
    var canvas = document.getElementById("canvas-2-2");

    var w = canvas.clientWidth;
    var h = 560;
    var cx = w / 2;
    var cy = h / 2 + 8;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var groups = [
        { key: "short", label: "sleeps under 6 h", filter: function (d) { return +d.total_sleep < 6; }, color: COLOR_BAD, opacity: 0.65 },
        { key: "avg", label: "sleeps 6\u20139 h", filter: function (d) { return +d.total_sleep >= 6 && +d.total_sleep < 9; }, color: COLOR_MID, opacity: 0.5 },
        { key: "rested", label: "sleeps 9 h or more", filter: function (d) { return +d.total_sleep >= 9; }, color: COLOR_GOOD, opacity: 0.7 }
    ];

    var axes = [
        { key: "anxiety", label: "calm", invert: true, valueFn: function (d) { return +d.anxiety_score; }, max: 21 },
        { key: "depression", label: "low depression", invert: true, valueFn: function (d) { return +d.depression_score; }, max: 27 },
        { key: "sadness", label: "free of persistent sadness", invert: true, valueFn: function (d) { return +d.persistent_sadness; }, max: 1 },
        { key: "gpa", label: "GPA", invert: false, valueFn: function (d) { return +d.gpa; }, max: 4 },
        { key: "caffeine", label: "low caffeine", invert: true, valueFn: function (d) { return +d.caffeine_mg; }, max: 400 }
    ];

    var groupData = groups.map(function (g) {
        var subset = data.filter(g.filter);
        var values = axes.map(function (a) {
            var mean = d3.mean(subset, a.valueFn) || 0;
            var norm = mean / a.max;
            if (a.invert) norm = 1 - norm;
            return Math.max(0, Math.min(1, norm));
        });
        return { group: g, n: subset.length, values: values };
    });

    var radius = Math.min(cx, cy) - 110;
    var nAxes = axes.length;

    function pointAt(axisIndex, value) {
        var angle = -Math.PI / 2 + (axisIndex / nAxes) * 2 * Math.PI;
        return {
            x: cx + Math.cos(angle) * radius * value,
            y: cy + Math.sin(angle) * radius * value
        };
    }

    [0.25, 0.5, 0.75, 1].forEach(function (level) {
        var pts = axes.map(function (_, i) { return pointAt(i, level); });
        var pathStr = pts.map(function (p, i) { return (i === 0 ? "M" : "L") + p.x + "," + p.y; }).join(" ") + "Z";
        svg.append("path")
            .attr("d", pathStr)
            .attr("fill", "none")
            .attr("stroke", COLOR_PAPER_RULE)
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.6);
    });

    axes.forEach(function (a, i) {
        var endPt = pointAt(i, 1);
        svg.append("line")
            .attr("x1", cx).attr("y1", cy)
            .attr("x2", endPt.x).attr("y2", endPt.y)
            .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.5).attr("opacity", 0.6);

        var angle = -Math.PI / 2 + (i / nAxes) * 2 * Math.PI;
        var labelR = radius + 32;
        var lx = cx + Math.cos(angle) * labelR;
        var ly = cy + Math.sin(angle) * labelR;
        var anchor = "middle";
        if (Math.cos(angle) > 0.3) anchor = "start";
        else if (Math.cos(angle) < -0.3) anchor = "end";

        svg.append("text")
            .attr("x", lx).attr("y", ly + 4)
            .attr("text-anchor", anchor)
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(a.label);
    });

    svg.append("text")
        .attr("x", cx).attr("y", 32)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("five dimensions of teen wellbeing, outer is healthier");

    var polygons = [];

    groupData.forEach(function (gd, gi) {
        var pts = gd.values.map(function (v, i) { return pointAt(i, v); });
        var pathStr = pts.map(function (p, i) { return (i === 0 ? "M" : "L") + p.x + "," + p.y; }).join(" ") + "Z";

        var polyFill = svg.append("path")
            .attr("d", pathStr)
            .attr("fill", gd.group.color)
            .attr("opacity", 0)
            .attr("transform", "scale(0)")
            .attr("transform-origin", cx + "px " + cy + "px");

        var polyStroke = svg.append("path")
            .attr("d", pathStr)
            .attr("fill", "none")
            .attr("stroke", gd.group.color)
            .attr("stroke-width", 2.2)
            .attr("opacity", 0)
            .attr("transform", "scale(0)")
            .attr("transform-origin", cx + "px " + cy + "px");

        var vertexStars = pts.map(function (p, i) {
            return svg.append("path")
                .attr("d", starPath(28))
                .attr("transform", "translate(" + p.x + "," + p.y + ") scale(0)")
                .attr("fill", gd.group.color)
                .attr("opacity", 0)
                .style("cursor", "pointer")
                .datum({ axis: axes[i], group: gd.group, value: gd.values[i], n: gd.n })
                .on("mouseover", function (event, dd) {
                    d3.select(this).transition().duration(120).attr("transform", "translate(" + p.x + "," + p.y + ") scale(2.2)");
                    showTip(event,
                        "<strong style='color:" + dd.group.color + ";font-style:normal;font-weight:500;'>" + dd.group.label + "</strong><br>" +
                        "n = " + dd.n + " teens<br>" +
                        dd.axis.label + ": " + (dd.value * 100).toFixed(0) + " / 100"
                    );
                })
                .on("mousemove", moveTip)
                .on("mouseout", function () {
                    d3.select(this).transition().duration(150).attr("transform", "translate(" + p.x + "," + p.y + ") scale(1)");
                    hideTip();
                });
        });

        polygons.push({ fill: polyFill, stroke: polyStroke, vertices: vertexStars, idx: gi, opacity: gd.group.opacity });
    });

    var legendY = h - 22;
    svg.append("line")
        .attr("x1", 40).attr("x2", w - 40)
        .attr("y1", legendY - 22).attr("y2", legendY - 22)
        .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.5);

    var legendStartX = 40;
    var lx = legendStartX;
    groups.forEach(function (g) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (lx + 6) + "," + (legendY - 4) + ")")
            .attr("fill", g.color);
        svg.append("text")
            .attr("x", lx + 20).attr("y", legendY)
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(g.label);
        lx += 18 + (g.label.length * 7) + 22;
    });

    watchForScrollIn(canvas, function () {
        polygons.forEach(function (p) {
            var delay = p.idx * 350;
            p.fill.transition().delay(delay).duration(900).ease(d3.easeCubicOut)
                .attr("transform", "scale(1)")
                .attr("opacity", p.opacity * 0.12);
            p.stroke.transition().delay(delay).duration(900).ease(d3.easeCubicOut)
                .attr("transform", "scale(1)")
                .attr("opacity", 1);
            p.vertices.forEach(function (v, vi) {
                v.transition().delay(delay + 600 + vi * 60).duration(400)
                    .ease(d3.easeBackOut.overshoot(1.4))
                    .attr("transform", v.attr("transform").replace("scale(0)", "scale(1)"))
                    .attr("opacity", 1);
            });
        });
    });
}



function drawPlate2_3Quadrants(data) {
    var canvas = document.getElementById("canvas-2-3");

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var caffMedian = d3.median(data, function (d) { return +d.caffeine_mg; });
    var screenMedian = d3.median(data, function (d) { return +d.screen_hours_pre_bed; });

    var quadrants = [
        {
            id: "lo_lo",
            label: "low caffeine, low screens",
            sublabel: "below " + Math.round(caffMedian) + " mg, under " + screenMedian.toFixed(1) + " h",
            row: 1, col: 0,
            filter: function (d) { return +d.caffeine_mg <= caffMedian && +d.screen_hours_pre_bed <= screenMedian; }
        },
        {
            id: "hi_lo",
            label: "high caffeine, low screens",
            sublabel: "over " + Math.round(caffMedian) + " mg, under " + screenMedian.toFixed(1) + " h",
            row: 1, col: 1,
            filter: function (d) { return +d.caffeine_mg > caffMedian && +d.screen_hours_pre_bed <= screenMedian; }
        },
        {
            id: "lo_hi",
            label: "low caffeine, high screens",
            sublabel: "below " + Math.round(caffMedian) + " mg, over " + screenMedian.toFixed(1) + " h",
            row: 0, col: 0,
            filter: function (d) { return +d.caffeine_mg <= caffMedian && +d.screen_hours_pre_bed > screenMedian; }
        },
        {
            id: "hi_hi",
            label: "high caffeine, high screens",
            sublabel: "over " + Math.round(caffMedian) + " mg, over " + screenMedian.toFixed(1) + " h",
            row: 0, col: 1,
            filter: function (d) { return +d.caffeine_mg > caffMedian && +d.screen_hours_pre_bed > screenMedian; }
        }
    ];

    quadrants.forEach(function (q) {
        var subset = data.filter(q.filter);
        q.n = subset.length;
        q.avgSleep = d3.mean(subset, function (d) { return +d.total_sleep; }) || 0;
        q.avgAnxiety = d3.mean(subset, function (d) { return +d.anxiety_score; }) || 0;
        q.avgGPA = d3.mean(subset, function (d) { return +d.gpa; }) || 0;
        q.deficit = Math.max(0, 9 - q.avgSleep);

        var counts = { low: 0, mid: 0, high: 0 };
        subset.forEach(function (d) {
            var a = +d.anxiety_score;
            if (a < 5) counts.low++;
            else if (a < 10) counts.mid++;
            else counts.high++;
        });
        var dom = "low";
        if (counts.mid >= counts.low && counts.mid >= counts.high) dom = "mid";
        if (counts.high >= counts.low && counts.high >= counts.mid) dom = "high";
        q.dom = dom;
        q.color = dom === "low" ? COLOR_GOOD : dom === "mid" ? COLOR_MID : COLOR_BAD;
        q.subset = subset;
    });

    var topMargin = 70;
    var bottomMargin = 80;
    var leftMargin = 60;
    var rightMargin = 60;
    var gridW = w - leftMargin - rightMargin;
    var gridH = h - topMargin - bottomMargin;
    var cellW = gridW / 2;
    var cellH = gridH / 2;

    svg.append("text")
        .attr("x", leftMargin + gridW / 2).attr("y", 28)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "14px")
        .text("teens, sorted by how hard their bodies are coping");

    svg.append("text")
        .attr("x", leftMargin + gridW / 2).attr("y", 48)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("split at the median for caffeine and screen time before bed");

    svg.append("line")
        .attr("x1", leftMargin + cellW).attr("x2", leftMargin + cellW)
        .attr("y1", topMargin).attr("y2", topMargin + gridH)
        .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.6).attr("opacity", 0.7);

    svg.append("line")
        .attr("x1", leftMargin).attr("x2", leftMargin + gridW)
        .attr("y1", topMargin + cellH).attr("y2", topMargin + cellH)
        .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.6).attr("opacity", 0.7);

    svg.append("text")
        .attr("x", leftMargin - 8).attr("y", topMargin + cellH * 0.5)
        .attr("text-anchor", "end")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("\u2191 high screens");
    svg.append("text")
        .attr("x", leftMargin - 8).attr("y", topMargin + cellH * 1.5)
        .attr("text-anchor", "end")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("\u2193 low screens");
    svg.append("text")
        .attr("x", leftMargin + cellW * 0.5).attr("y", topMargin + gridH + 26)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("\u2190 low caffeine");
    svg.append("text")
        .attr("x", leftMargin + cellW * 1.5).attr("y", topMargin + gridH + 26)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("high caffeine \u2192");

    var maxDeficit = d3.max(quadrants, function (q) { return q.deficit; });
    var sizeScale = d3.scaleSqrt().domain([0, Math.max(maxDeficit, 1.5)]).range([180, 920]);

    var revealOrder = ["lo_lo", "lo_hi", "hi_lo", "hi_hi"];

    quadrants.forEach(function (q) {
        var cellLeft = leftMargin + q.col * cellW;
        var cellTop = topMargin + q.row * cellH;
        var qcx = cellLeft + cellW / 2;
        var qcy = cellTop + cellH / 2;

        var bgG = svg.append("g").attr("class", "quad-bg-" + q.id).style("opacity", 0);
        var sample = q.subset.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 32);
        sample.forEach(function (d) {
            var px = cellLeft + 30 + Math.random() * (cellW - 60);
            var py = cellTop + 30 + Math.random() * (cellH - 60);
            bgG.append("path")
                .attr("d", starPath(8))
                .attr("transform", "translate(" + px + "," + py + ")")
                .attr("fill", colorByAnxiety(+d.anxiety_score))
                .attr("opacity", 0.25);
        });

        var glowG = svg.append("g").attr("class", "quad-fg-" + q.id).style("opacity", 0);

        glowG.append("circle")
            .attr("cx", qcx).attr("cy", qcy - 8)
            .attr("r", 36)
            .attr("fill", q.color).attr("opacity", 0.08);
        glowG.append("circle")
            .attr("cx", qcx).attr("cy", qcy - 8)
            .attr("r", 24)
            .attr("fill", q.color).attr("opacity", 0.12);

        var bigStar = glowG.append("path")
            .attr("d", starPath(sizeScale(q.deficit)))
            .attr("transform", "translate(" + qcx + "," + (qcy - 8) + ") scale(0.35)")
            .attr("fill", q.color)
            .attr("opacity", 0)
            .style("cursor", "pointer")
            .on("mouseover", function (event) {
                d3.select(this).transition().duration(120).attr("transform", "translate(" + qcx + "," + (qcy - 8) + ") scale(1.08)");
                showTip(event,
                    "<strong style='color:" + q.color + ";font-style:normal;font-weight:500;font-size:15px;'>" + q.label + "</strong><br>" +
                    q.n + " teens<br>" +
                    "average sleep: " + q.avgSleep.toFixed(1) + " h<br>" +
                    "average anxiety: " + q.avgAnxiety.toFixed(1) + " / 21<br>" +
                    "average GPA: " + q.avgGPA.toFixed(2)
                );
            })
            .on("mousemove", moveTip)
            .on("mouseout", function () {
                d3.select(this).transition().duration(150).attr("transform", "translate(" + qcx + "," + (qcy - 8) + ") scale(1)");
                hideTip();
            });

        glowG.append("text")
            .attr("x", qcx).attr("y", cellTop + 28)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK)
            .style("font-family", "'Fraunces', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "14px")
            .style("font-weight", "500")
            .text(q.label);

        glowG.append("text")
            .attr("x", qcx).attr("y", cellTop + 44)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_RULE)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "11px")
            .text("n = " + q.n + " teens");

        var statsBaseY = cellTop + cellH - 56;
        glowG.append("text")
            .attr("x", qcx).attr("y", statsBaseY)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("avg sleep: " + q.avgSleep.toFixed(1) + " h");

        glowG.append("text")
            .attr("x", qcx).attr("y", statsBaseY + 18)
            .attr("text-anchor", "middle")
            .attr("fill", q.color)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("avg anxiety: " + q.avgAnxiety.toFixed(1));

        q.bgG = bgG;
        q.glowG = glowG;
        q.bigStar = bigStar;
        q.qcx = qcx;
        q.qcy = qcy;
    });

    var legendY = h - 22;
    svg.append("line")
        .attr("x1", leftMargin).attr("x2", w - rightMargin)
        .attr("y1", legendY - 18).attr("y2", legendY - 18)
        .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.5);

    svg.append("text")
        .attr("x", leftMargin).attr("y", legendY)
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("size = sleep deficit, color = dominant anxiety tier in that group");

    watchForScrollIn(canvas, function () {
        revealOrder.forEach(function (qId, idx) {
            var q = quadrants.find(function (x) { return x.id === qId; });
            if (!q) return;
            var delay = idx * 500;

            q.bgG.transition().delay(delay).duration(700).style("opacity", 1);
            q.glowG.transition().delay(delay + 200).duration(800).style("opacity", 1);
            q.bigStar.transition().delay(delay + 400).duration(900).ease(d3.easeBackOut.overshoot(1.3))
                .attr("transform", "translate(" + q.qcx + "," + (q.qcy - 8) + ") scale(1)")
                .attr("opacity", 0.92);
        });
    });
}


// --- Chapter 3: Young Adults ---

function drawPlate3_1PairedOrbit(data) {
    var canvas = document.getElementById("canvas-3-1");

    var w = canvas.clientWidth;
    var h = 560;
    var cx = w / 2;
    var cy = h / 2 + 6;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var maxRadius = Math.min(cx - 60, cy - 80);
    var rScale = d3.scaleLinear().domain([12, 3]).range([0, maxRadius]).clamp(true);

    var ringHours = [9, 7, 5];
    svg.selectAll(".ring")
        .data(ringHours).enter().append("circle")
        .attr("class", "ring")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", function (d) { return rScale(d); })
        .attr("fill", "none")
        .attr("stroke", COLOR_RING)
        .attr("stroke-width", 1.1)
        .attr("opacity", 0.95);

    ringHours.forEach(function (hr) {
        var labelAngle = -Math.PI / 2 + 0.18;
        var lx = cx + Math.cos(labelAngle) * rScale(hr);
        var ly = cy + Math.sin(labelAngle) * rScale(hr);
        svg.append("rect")
            .attr("x", lx - 22).attr("y", ly - 9)
            .attr("width", 44).attr("height", 17).attr("rx", 2)
            .attr("fill", COLOR_NIGHT);
        svg.append("text")
            .attr("x", lx).attr("y", ly + 4)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(hr + " h");
    });

    svg.append("text")
        .attr("x", cx).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("distance from the moon = hours short of the recommended 9");

    var moonG = svg.append("g");
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 48).attr("fill", COLOR_MOON).attr("opacity", 0.14);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 38).attr("fill", COLOR_MOON).attr("opacity", 0.28);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 30).attr("fill", COLOR_MOON);
    moonG.append("circle").attr("cx", cx - 12).attr("cy", cy - 9).attr("r", 24).attr("fill", COLOR_NIGHT);

    data.sort(function (a, b) {
        var aTier = +a.burnout_score < 30 ? 0 : +a.burnout_score < 60 ? 1 : 2;
        var bTier = +b.burnout_score < 30 ? 0 : +b.burnout_score < 60 ? 1 : 2;
        return aTier - bTier;
    });

    data.forEach(function (d, i) {
        var randomAngle = (i / data.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
        var jitterR = (Math.random() - 0.5) * 8;
        d.angle = randomAngle;
        d.r = rScale(+d.weekday_sleep) + jitterR;
        d.x = cx + Math.cos(d.angle) * d.r;
        d.y = cy + Math.sin(d.angle) * d.r;
        d.color = nightColorByBurnout(+d.burnout_score);
    });

    var stars = svg.selectAll(".star")
        .data(data).enter().append("path")
        .attr("class", "star")
        .attr("d", starPath(STAR_SIZE_TINY))
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(0)"; })
        .attr("fill", function (d) { return d.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this).raise()
                .transition().duration(120)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(2.5)")
                .attr("opacity", 1);
            var tier = +d.burnout_score < 30 ? "low burnout" : +d.burnout_score < 60 ? "moderate burnout" : "high burnout";
            showTip(event,
                "<strong style='color:" + d.color + ";font-style:normal;font-weight:500;'>Person #" + d.id + "</strong><br>" +
                "weekday sleep: " + (+d.weekday_sleep).toFixed(1) + " h<br>" +
                "burnout score: " + Math.round(+d.burnout_score) + "  " + tier
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(1)")
                .attr("opacity", 0.65);
            hideTip();
        });

    var legendY = h - 24;
    svg.append("line")
        .attr("x1", 30).attr("x2", w - 30)
        .attr("y1", legendY - 22).attr("y2", legendY - 22)
        .attr("stroke", "#3a4868").attr("stroke-width", 0.5);

    svg.append("text")
        .attr("x", 30).attr("y", legendY)
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("color = burnout:");

    var legendItems = [
        { color: COLOR_MOON, label: "low", x: 168 },
        { color: "#c4a8d1", label: "moderate", x: 248 },
        { color: "#7d8eb0", label: "high", x: 360 }
    ];
    legendItems.forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (item.x + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", item.x + 20).attr("y", legendY)
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
    });

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return (i % 100) * 6 + Math.random() * 200; })
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(1)"; })
            .attr("opacity", 0.65);

        var avgSleep = d3.mean(data, function (d) { return +d.weekday_sleep; });
        var avgR = rScale(avgSleep);
        var avgAngle = Math.PI / 4;
        var avgX = cx + Math.cos(avgAngle) * avgR;
        var avgY = cy + Math.sin(avgAngle) * avgR;

        var labelX = cx + Math.cos(avgAngle) * (avgR + 60);
        var labelY = cy + Math.sin(avgAngle) * (avgR + 60);

        var ringEl = svg.append("circle")
            .attr("cx", avgX).attr("cy", avgY).attr("r", 0)
            .attr("fill", "none").attr("stroke", COLOR_MOON).attr("stroke-width", 1)
            .attr("opacity", 0.7);
        var leaderLine = svg.append("line")
            .attr("x1", avgX + Math.cos(avgAngle) * 14)
            .attr("y1", avgY + Math.sin(avgAngle) * 14)
            .attr("x2", avgX + Math.cos(avgAngle) * 14)
            .attr("y2", avgY + Math.sin(avgAngle) * 14)
            .attr("stroke", COLOR_MOON).attr("stroke-width", 0.6)
            .attr("opacity", 0.6).attr("stroke-dasharray", "2 3");
        var label1 = svg.append("text")
            .attr("x", labelX).attr("y", labelY - 4)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_MOON)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("the average young adult");
        var label2 = svg.append("text")
            .attr("x", labelX).attr("y", labelY + 12)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text("slept " + avgSleep.toFixed(1) + " hours on weekdays");

        ringEl.transition().delay(1400).duration(700).attr("r", 16);
        leaderLine.transition().delay(1500).duration(500)
            .attr("x2", labelX - 4).attr("y2", labelY - 4);
        label1.transition().delay(1700).duration(500).attr("opacity", 1);
        label2.transition().delay(1900).duration(500).attr("opacity", 1);
    });
}


function drawPlate3_2BurnoutRidge(data) {
    var canvas = document.getElementById("canvas-3-2");

    var w = canvas.clientWidth;
    var h = 480;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var leftMargin = 130;
    var rightMargin = 60;
    var topMargin = 70;
    var bottomMargin = 70;
    var plotW = w - leftMargin - rightMargin;
    var plotH = h - topMargin - bottomMargin;

    var bands = [
        { key: "rested", label: "sleeps 7+ h", filter: function (d) { return +d.weekday_sleep >= 7; }, color: COLOR_GOOD, idx: 0 },
        { key: "average", label: "sleeps 6\u20137 h", filter: function (d) { return +d.weekday_sleep >= 6 && +d.weekday_sleep < 7; }, color: COLOR_MID, idx: 1 },
        { key: "deficit", label: "sleeps under 6 h", filter: function (d) { return +d.weekday_sleep < 6; }, color: COLOR_BAD, idx: 2 }
    ];

    var burnoutScale = d3.scaleLinear().domain([0, 100]).range([leftMargin, w - rightMargin]);
    var rowH = plotH / bands.length;

    [0, 25, 50, 75, 100].forEach(function (b) {
        svg.append("line")
            .attr("x1", burnoutScale(b)).attr("x2", burnoutScale(b))
            .attr("y1", topMargin).attr("y2", topMargin + plotH)
            .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.4)
            .attr("opacity", b === 0 || b === 100 ? 0.7 : 0.3);
        svg.append("text")
            .attr("x", burnoutScale(b)).attr("y", topMargin + plotH + 22)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(b);
    });

    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", topMargin + plotH + 44)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("burnout score \u2192 (higher is worse)");

    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("how burnout shifts as weekday sleep falls");

    var ridges = bands.map(function (band) {
        var subset = data.filter(band.filter).map(function (d) { return +d.burnout_score; });
        var n = subset.length;
        var bandY = topMargin + (band.idx + 0.5) * rowH;

        var bins = d3.bin().domain([0, 100]).thresholds(20)(subset);
        var maxCount = d3.max(bins, function (b) { return b.length; }) || 1;
        var ridgeHeight = rowH * 0.7;
        var ridgeYScale = d3.scaleLinear().domain([0, maxCount]).range([0, ridgeHeight]);

        var ridgePoints = bins.map(function (b) {
            return { x: burnoutScale((b.x0 + b.x1) / 2), y: bandY - ridgeYScale(b.length) };
        });

        var areaPath = d3.area()
            .x(function (d) { return d.x; })
            .y0(bandY)
            .y1(function (d) { return d.y; })
            .curve(d3.curveBasis);
        var linePath = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .curve(d3.curveBasis);

        var areaEl = svg.append("path")
            .datum(ridgePoints)
            .attr("d", areaPath)
            .attr("fill", band.color)
            .attr("opacity", 0)
            .attr("transform", "translate(0," + (rowH * 0.6) + ")");
        var lineEl = svg.append("path")
            .datum(ridgePoints)
            .attr("d", linePath)
            .attr("fill", "none")
            .attr("stroke", band.color)
            .attr("stroke-width", 1.5)
            .attr("opacity", 0)
            .attr("transform", "translate(0," + (rowH * 0.6) + ")");

        svg.append("text")
            .attr("x", leftMargin - 14).attr("y", bandY + 4)
            .attr("text-anchor", "end")
            .attr("fill", band.color)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .text(band.label);

        svg.append("text")
            .attr("x", leftMargin - 14).attr("y", bandY + 20)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK_RULE)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "11px")
            .text("n = " + n);

        var meanBurnout = d3.mean(subset);
        var meanX = burnoutScale(meanBurnout || 0);
        var meanLine = svg.append("line")
            .attr("x1", meanX).attr("x2", meanX)
            .attr("y1", bandY).attr("y2", bandY)
            .attr("stroke", band.color).attr("stroke-width", 0.8)
            .attr("stroke-dasharray", "3 3")
            .attr("opacity", 0);

        return { area: areaEl, line: lineEl, idx: band.idx, meanLine: meanLine, bandY: bandY, ridgeHeight: ridgeHeight };
    });

    watchForScrollIn(canvas, function () {
        ridges.forEach(function (r) {
            var delay = r.idx * 200;
            r.area.transition().delay(delay).duration(900).ease(d3.easeCubicOut)
                .attr("transform", "translate(0,0)")
                .attr("opacity", 0.45);
            r.line.transition().delay(delay).duration(900).ease(d3.easeCubicOut)
                .attr("transform", "translate(0,0)")
                .attr("opacity", 1);
            r.meanLine.transition().delay(delay + 700).duration(500)
                .attr("y1", r.bandY - r.ridgeHeight - 4)
                .attr("opacity", 0.7);
        });
    });
}


function drawPlate3_3CortisolHexbin(data) {
    var canvas = document.getElementById("canvas-3-3");

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var leftMargin = 100;
    var rightMargin = 60;
    var topMargin = 70;
    var bottomMargin = 80;
    var plotW = w - leftMargin - rightMargin;
    var plotH = h - topMargin - bottomMargin;

    var jlExtent = [0, d3.max(data, function (d) { return +d.social_jet_lag; }) + 0.5];
    var cortExtent = [0, d3.max(data, function (d) { return +d.cortisol_am; }) + 2];

    var xScale = d3.scaleLinear().domain(jlExtent).range([leftMargin, w - rightMargin]);
    var yScale = d3.scaleLinear().domain(cortExtent).range([h - bottomMargin, topMargin]);

    [0, 1, 2, 3, 4, 5].forEach(function (jl) {
        if (jl > jlExtent[1]) return;
        svg.append("text")
            .attr("x", xScale(jl)).attr("y", h - bottomMargin + 22)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(jl + " h");
    });
    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", h - bottomMargin + 44)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("social jet lag (weekend minus weekday hours) \u2192");

    [10, 15, 20, 25].forEach(function (c) {
        if (c > cortExtent[1]) return;
        svg.append("line")
            .attr("x1", leftMargin).attr("x2", w - rightMargin)
            .attr("y1", yScale(c)).attr("y2", yScale(c))
            .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.4)
            .attr("stroke-dasharray", "2 5").attr("opacity", 0.5);
        svg.append("text")
            .attr("x", leftMargin - 10).attr("y", yScale(c) + 4)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(c + " \u00b5g/dL");
    });
    svg.append("text")
        .attr("x", 28).attr("y", topMargin + plotH / 2)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .attr("transform", "rotate(-90 28," + (topMargin + plotH / 2) + ")")
        .text("\u2191 morning cortisol");

    var hexRadius = 12;
    var hexbin = function (points) {
        var bins = {};
        points.forEach(function (p) {
            var px = xScale(+p.social_jet_lag);
            var py = yScale(+p.cortisol_am);
            if (px < leftMargin || px > w - rightMargin || py < topMargin || py > h - bottomMargin) return;
            var col = Math.round(px / (hexRadius * 1.5));
            var row = Math.round(py / (hexRadius * Math.sqrt(3)));
            var key = col + "_" + row;
            if (!bins[key]) bins[key] = { x: col * hexRadius * 1.5, y: row * hexRadius * Math.sqrt(3), points: [] };
            bins[key].points.push(p);
        });
        return Object.values(bins);
    };

    var bins = hexbin(data);
    var maxCount = d3.max(bins, function (b) { return b.points.length; });
    var sizeScale = d3.scaleSqrt().domain([1, maxCount]).range([8, 80]);

    bins.forEach(function (bin) {
        var meanHR = d3.mean(bin.points, function (p) { return +p.resting_hr; });
        var color = meanHR < 65 ? COLOR_GOOD : meanHR < 75 ? COLOR_MID : COLOR_BAD;
        bin.color = color;
        bin.size = sizeScale(bin.points.length);
        bin.meanHR = meanHR;
    });

    var stars = svg.selectAll(".cort-star")
        .data(bins).enter().append("path")
        .attr("class", "cort-star")
        .attr("d", function (b) { return starPath(b.size); })
        .attr("transform", function (b) { return "translate(" + b.x + "," + b.y + ") scale(0)"; })
        .attr("fill", function (b) { return b.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, b) {
            d3.select(this).raise()
                .transition().duration(120)
                .attr("transform", "translate(" + b.x + "," + b.y + ") scale(1.15)")
                .attr("opacity", 1);
            var hrTier = b.meanHR < 65 ? "calm" : b.meanHR < 75 ? "elevated" : "racing";
            showTip(event,
                "<strong style='color:" + b.color + ";font-style:normal;font-weight:500;'>" + b.points.length + " people</strong><br>" +
                "in this region<br>" +
                "avg resting HR: " + b.meanHR.toFixed(0) + " bpm  " + hrTier
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, b) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + b.x + "," + b.y + ") scale(1)")
                .attr("opacity", 0.92);
            hideTip();
        });

    var legendY = topMargin - 32;
    var lx = leftMargin;
    [
        { color: COLOR_GOOD, label: "calm (HR < 65)" },
        { color: COLOR_MID, label: "elevated" },
        { color: COLOR_BAD, label: "racing (HR \u2265 75)" }
    ].forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (lx + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", lx + 20).attr("y", legendY)
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
        lx += 18 + (item.label.length * 7) + 24;
    });
    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", h - bottomMargin + 60)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "11px")
        .text("size of star = number of people in that region");

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return i * 25 + Math.random() * 100; })
            .duration(800)
            .ease(d3.easeBackOut.overshoot(1.2))
            .attr("transform", function (b) { return "translate(" + b.x + "," + b.y + ") scale(1)"; })
            .attr("opacity", 0.92);
    });
}


// --- Chapter 4: Adults ---

function drawPlate4_1Orbit(data) {
    var canvas = document.getElementById("canvas-4-1");

    var w = canvas.clientWidth;
    var h = 560;
    var cx = w / 2;
    var cy = h / 2 + 6;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var maxRadius = Math.min(cx - 60, cy - 80);
    var rScale = d3.scaleLinear().domain([12, 3]).range([0, maxRadius]).clamp(true);

    var ringHours = [7.5, 6, 4.5];
    svg.selectAll(".ring")
        .data(ringHours).enter().append("circle")
        .attr("class", "ring")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", function (d) { return rScale(d); })
        .attr("fill", "none")
        .attr("stroke", COLOR_RING)
        .attr("stroke-width", 1.1)
        .attr("opacity", 0.95);

    ringHours.forEach(function (hr) {
        var labelAngle = -Math.PI / 2 + 0.18;
        var lx = cx + Math.cos(labelAngle) * rScale(hr);
        var ly = cy + Math.sin(labelAngle) * rScale(hr);
        svg.append("rect")
            .attr("x", lx - 22).attr("y", ly - 9)
            .attr("width", 44).attr("height", 17).attr("rx", 2)
            .attr("fill", COLOR_NIGHT);
        svg.append("text")
            .attr("x", lx).attr("y", ly + 4)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(hr + " h");
    });

    svg.append("text")
        .attr("x", cx).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("distance from the moon = hours short of the recommended 7.5");

    var moonG = svg.append("g");
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 48).attr("fill", COLOR_MOON).attr("opacity", 0.14);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 38).attr("fill", COLOR_MOON).attr("opacity", 0.28);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 30).attr("fill", COLOR_MOON);
    moonG.append("circle").attr("cx", cx - 12).attr("cy", cy - 9).attr("r", 24).attr("fill", COLOR_NIGHT);

    data.sort(function (a, b) {
        var aTier = +a.systolic_bp < 120 ? 0 : +a.systolic_bp < 130 ? 1 : 2;
        var bTier = +b.systolic_bp < 120 ? 0 : +b.systolic_bp < 130 ? 1 : 2;
        return aTier - bTier;
    });

    data.forEach(function (d, i) {
        var randomAngle = (i / data.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
        var jitterR = (Math.random() - 0.5) * 8;
        d.angle = randomAngle;
        d.r = rScale(+d.total_sleep) + jitterR;
        d.x = cx + Math.cos(d.angle) * d.r;
        d.y = cy + Math.sin(d.angle) * d.r;
        d.color = nightColorByBP(+d.systolic_bp);
    });

    var stars = svg.selectAll(".star")
        .data(data).enter().append("path")
        .attr("class", "star")
        .attr("d", starPath(STAR_SIZE_TINY))
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(0)"; })
        .attr("fill", function (d) { return d.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this).raise()
                .transition().duration(120)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(2.5)")
                .attr("opacity", 1);
            var tier = +d.systolic_bp < 120 ? "normal BP" : +d.systolic_bp < 130 ? "elevated BP" : "high BP";
            showTip(event,
                "<strong style='color:" + d.color + ";font-style:normal;font-weight:500;'>Adult #" + d.id + "</strong><br>" +
                "slept: " + (+d.total_sleep).toFixed(1) + " h<br>" +
                "systolic BP: " + Math.round(+d.systolic_bp) + "  " + tier
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(1)")
                .attr("opacity", 0.65);
            hideTip();
        });

    var legendY = h - 24;
    svg.append("line")
        .attr("x1", 30).attr("x2", w - 30)
        .attr("y1", legendY - 22).attr("y2", legendY - 22)
        .attr("stroke", "#3a4868").attr("stroke-width", 0.5);

    svg.append("text")
        .attr("x", 30).attr("y", legendY)
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("color = blood pressure:");

    var legendItems = [
        { color: COLOR_MOON, label: "normal", x: 200 },
        { color: "#c4a8d1", label: "elevated", x: 280 },
        { color: "#7d8eb0", label: "high", x: 380 }
    ];
    legendItems.forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (item.x + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", item.x + 20).attr("y", legendY)
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
    });

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return (i % 100) * 6 + Math.random() * 200; })
            .duration(900)
            .ease(d3.easeCubicOut)
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ") scale(1)"; })
            .attr("opacity", 0.65);

        var avgSleep = d3.mean(data, function (d) { return +d.total_sleep; });
        var avgR = rScale(avgSleep);
        var avgAngle = Math.PI / 4;
        var avgX = cx + Math.cos(avgAngle) * avgR;
        var avgY = cy + Math.sin(avgAngle) * avgR;
        var labelX = cx + Math.cos(avgAngle) * (avgR + 60);
        var labelY = cy + Math.sin(avgAngle) * (avgR + 60);

        var ringEl = svg.append("circle")
            .attr("cx", avgX).attr("cy", avgY).attr("r", 0)
            .attr("fill", "none").attr("stroke", COLOR_MOON).attr("stroke-width", 1)
            .attr("opacity", 0.7);
        var leaderLine = svg.append("line")
            .attr("x1", avgX + Math.cos(avgAngle) * 14).attr("y1", avgY + Math.sin(avgAngle) * 14)
            .attr("x2", avgX + Math.cos(avgAngle) * 14).attr("y2", avgY + Math.sin(avgAngle) * 14)
            .attr("stroke", COLOR_MOON).attr("stroke-width", 0.6)
            .attr("opacity", 0.6).attr("stroke-dasharray", "2 3");
        var label1 = svg.append("text")
            .attr("x", labelX).attr("y", labelY - 4)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_MOON)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("the average adult");
        var label2 = svg.append("text")
            .attr("x", labelX).attr("y", labelY + 12)
            .attr("text-anchor", "start")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .attr("opacity", 0)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text("slept " + avgSleep.toFixed(1) + " hours");

        ringEl.transition().delay(1400).duration(700).attr("r", 16);
        leaderLine.transition().delay(1500).duration(500)
            .attr("x2", labelX - 4).attr("y2", labelY - 4);
        label1.transition().delay(1700).duration(500).attr("opacity", 1);
        label2.transition().delay(1900).duration(500).attr("opacity", 1);
    });
}


function drawPlate4_2Slope(data) {
    var canvas = document.getElementById("canvas-4-2");

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var rested = data.filter(function (d) { return +d.total_sleep >= 7; });
    var deficit = data.filter(function (d) { return +d.total_sleep < 6; });

    var metrics = [
        { key: "stress_score", label: "stress score", restedFmt: ".1f", deficitFmt: ".1f", direction: "more" },
        { key: "depression_score", label: "depression score", restedFmt: ".1f", deficitFmt: ".1f", direction: "more" },
        { key: "systolic_bp", label: "systolic blood pressure", restedFmt: ".0f", deficitFmt: ".0f", direction: "more" },
        { key: "wakings_per_night", label: "nightly wakings", restedFmt: ".1f", deficitFmt: ".1f", direction: "more" },
        { key: "diabetes_risk", label: "diabetes risk score", restedFmt: ".0f", deficitFmt: ".0f", direction: "more" }
    ];

    metrics.forEach(function (m) {
        m.restedVal = d3.mean(rested, function (d) { return +d[m.key]; });
        m.deficitVal = d3.mean(deficit, function (d) { return +d[m.key]; });
    });

    var topMargin = 90;
    var bottomMargin = 60;
    var labelColW = 180;
    var rightColX = w - 130;
    var leftColX = labelColW + 40;
    var lineW = rightColX - leftColX;
    var rowH = (h - topMargin - bottomMargin) / metrics.length;

    function fmt(val, spec) {
        if (spec === ".0f") return Math.round(val).toString();
        return val.toFixed(1);
    }

    svg.append("text")
        .attr("x", leftColX).attr("y", topMargin - 36)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_GOOD)
        .style("font-family", "'Fraunces', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "16px")
        .style("font-weight", "500")
        .text("rested adults");
    svg.append("text")
        .attr("x", leftColX).attr("y", topMargin - 18)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("sleeps 7+ hours  n = " + rested.length);

    svg.append("text")
        .attr("x", rightColX).attr("y", topMargin - 36)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_BAD)
        .style("font-family", "'Fraunces', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "16px")
        .style("font-weight", "500")
        .text("deficit adults");
    svg.append("text")
        .attr("x", rightColX).attr("y", topMargin - 18)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("sleeps under 6 hours  n = " + deficit.length);

    metrics.forEach(function (m, i) {
        var rowY = topMargin + (i + 0.5) * rowH;

        svg.append("text")
            .attr("x", labelColW).attr("y", rowY + 4)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "14px")
            .text(m.label);

        svg.append("path")
            .attr("d", starPath(36))
            .attr("transform", "translate(" + leftColX + "," + rowY + ")")
            .attr("fill", COLOR_GOOD)
            .attr("opacity", 0)
            .attr("class", "slope-rested-" + i);

        svg.append("text")
            .attr("x", leftColX).attr("y", rowY - 18)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_GOOD)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .attr("opacity", 0)
            .attr("class", "slope-rested-val-" + i)
            .text(fmt(m.restedVal, m.restedFmt));

        svg.append("path")
            .attr("d", starPath(36))
            .attr("transform", "translate(" + rightColX + "," + rowY + ")")
            .attr("fill", COLOR_BAD)
            .attr("opacity", 0)
            .attr("class", "slope-deficit-" + i);

        svg.append("text")
            .attr("x", rightColX).attr("y", rowY - 18)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_BAD)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .attr("opacity", 0)
            .attr("class", "slope-deficit-val-" + i)
            .text(fmt(m.deficitVal, m.deficitFmt));

        svg.append("line")
            .attr("x1", leftColX + 14).attr("y1", rowY)
            .attr("x2", leftColX + 14).attr("y2", rowY)
            .attr("stroke", "#8d6a4a").attr("stroke-width", 1)
            .attr("opacity", 0)
            .attr("class", "slope-line-" + i);
    });

    watchForScrollIn(canvas, function () {
        metrics.forEach(function (m, i) {
            var delay = i * 200;
            svg.select(".slope-rested-" + i).transition().delay(delay).duration(500)
                .ease(d3.easeBackOut.overshoot(1.4)).attr("opacity", 1);
            svg.select(".slope-rested-val-" + i).transition().delay(delay + 200).duration(400).attr("opacity", 1);

            svg.select(".slope-line-" + i).transition().delay(delay + 400).duration(700)
                .attr("x2", rightColX - 14)
                .attr("opacity", 0.5);

            svg.select(".slope-deficit-" + i).transition().delay(delay + 1000).duration(500)
                .ease(d3.easeBackOut.overshoot(1.4)).attr("opacity", 1);
            svg.select(".slope-deficit-val-" + i).transition().delay(delay + 1200).duration(400).attr("opacity", 1);
        });
    });
}


function drawPlate4_3BPHexbin(data) {
    var canvas = document.getElementById("canvas-4-3");

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var leftMargin = 100;
    var rightMargin = 60;
    var topMargin = 70;
    var bottomMargin = 80;
    var plotW = w - leftMargin - rightMargin;
    var plotH = h - topMargin - bottomMargin;

    var sleepExtent = [3, 10];
    var bpExtent = [90, 170];

    var xScale = d3.scaleLinear().domain(sleepExtent).range([leftMargin, w - rightMargin]);
    var yScale = d3.scaleLinear().domain(bpExtent).range([h - bottomMargin, topMargin]);

    [4, 5, 6, 7, 8, 9].forEach(function (hr) {
        svg.append("text")
            .attr("x", xScale(hr)).attr("y", h - bottomMargin + 22)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(hr + " h");
    });
    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", h - bottomMargin + 44)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("hours of sleep \u2192");

    [100, 120, 140, 160].forEach(function (bp) {
        if (bp === 120) return;
        svg.append("line")
            .attr("x1", leftMargin).attr("x2", w - rightMargin)
            .attr("y1", yScale(bp)).attr("y2", yScale(bp))
            .attr("stroke", COLOR_PAPER_RULE)
            .attr("stroke-width", 0.4)
            .attr("stroke-dasharray", "2 5")
            .attr("opacity", 0.4);
        svg.append("text")
            .attr("x", leftMargin - 10).attr("y", yScale(bp) + 4)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(bp);
    });
    svg.append("text")
        .attr("x", leftMargin - 10).attr("y", yScale(120) + 4)
        .attr("text-anchor", "end")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("120");

    svg.append("text")
        .attr("x", 28).attr("y", topMargin + plotH / 2)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .attr("transform", "rotate(-90 28," + (topMargin + plotH / 2) + ")")
        .text("\u2191 systolic blood pressure (mmHg)");

    var hexRadius = 11;
    var bins = {};
    data.forEach(function (p) {
        var px = xScale(+p.total_sleep);
        var py = yScale(+p.systolic_bp);
        if (px < leftMargin || px > w - rightMargin || py < topMargin || py > h - bottomMargin) return;
        var col = Math.round(px / (hexRadius * 1.5));
        var row = Math.round(py / (hexRadius * Math.sqrt(3)));
        var key = col + "_" + row;
        if (!bins[key]) bins[key] = { x: col * hexRadius * 1.5, y: row * hexRadius * Math.sqrt(3), points: [] };
        bins[key].points.push(p);
    });

    var binArr = Object.values(bins);
    var maxCount = d3.max(binArr, function (b) { return b.points.length; });
    var sizeScale = d3.scaleSqrt().domain([1, maxCount]).range([7, 70]);

    binArr.forEach(function (bin) {
        var meanRisk = d3.mean(bin.points, function (p) { return +p.diabetes_risk; });
        bin.color = meanRisk < 30 ? COLOR_GOOD : meanRisk < 50 ? COLOR_MID : COLOR_BAD;
        bin.size = sizeScale(bin.points.length);
        bin.meanRisk = meanRisk;
    });

    var stars = svg.selectAll(".bp-star")
        .data(binArr).enter().append("path")
        .attr("class", "bp-star")
        .attr("d", function (b) { return starPath(b.size); })
        .attr("transform", function (b) { return "translate(" + b.x + "," + b.y + ") scale(0)"; })
        .attr("fill", function (b) { return b.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, b) {
            d3.select(this).raise()
                .transition().duration(120)
                .attr("transform", "translate(" + b.x + "," + b.y + ") scale(1.15)")
                .attr("opacity", 1);
            var riskTier = b.meanRisk < 30 ? "low diabetes risk" : b.meanRisk < 50 ? "moderate" : "high";
            showTip(event,
                "<strong style='color:" + b.color + ";font-style:normal;font-weight:500;'>" + b.points.length + " adults</strong><br>" +
                "in this region<br>" +
                "avg diabetes risk: " + b.meanRisk.toFixed(0) + "  " + riskTier
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, b) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + b.x + "," + b.y + ") scale(1)")
                .attr("opacity", 0.92);
            hideTip();
        });

    svg.append("line")
        .attr("x1", leftMargin).attr("x2", w - rightMargin)
        .attr("y1", yScale(120)).attr("y2", yScale(120))
        .attr("stroke", "#a87474")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4 4")
        .attr("opacity", 0.9);

    svg.append("rect")
        .attr("x", w - rightMargin - 232).attr("y", yScale(120) - 18)
        .attr("width", 228).attr("height", 16).attr("rx", 2)
        .attr("fill", COLOR_PAPER)
        .attr("opacity", 0.95);
    svg.append("text")
        .attr("x", w - rightMargin - 8).attr("y", yScale(120) - 5)
        .attr("text-anchor", "end")
        .attr("fill", "#a87474")
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .text("hypertension threshold (120 mmHg)");

    var legendY = topMargin - 32;
    var lx = leftMargin;
    [
        { color: COLOR_GOOD, label: "low diabetes risk" },
        { color: COLOR_MID, label: "moderate" },
        { color: COLOR_BAD, label: "high" }
    ].forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (lx + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", lx + 20).attr("y", legendY)
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
        lx += 18 + (item.label.length * 7) + 24;
    });

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return i * 25 + Math.random() * 100; })
            .duration(800)
            .ease(d3.easeBackOut.overshoot(1.2))
            .attr("transform", function (b) { return "translate(" + b.x + "," + b.y + ") scale(1)"; })
            .attr("opacity", 0.92);
    });
}


// --- Chapter 5: Seniors ---

function drawPlate5_1FragmentedOrbit(data) {
    var canvas = document.getElementById("canvas-5-1");

    var w = canvas.clientWidth;
    var h = 560;
    var cx = w / 2;
    var cy = h / 2 + 6;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var maxRadius = Math.min(cx - 60, cy - 80);
    var rScale = d3.scaleLinear().domain([12, 3]).range([0, maxRadius]).clamp(true);

    var ringHours = [7, 5.5, 4];
    svg.selectAll(".ring")
        .data(ringHours).enter().append("circle")
        .attr("class", "ring")
        .attr("cx", cx).attr("cy", cy)
        .attr("r", function (d) { return rScale(d); })
        .attr("fill", "none")
        .attr("stroke", COLOR_RING)
        .attr("stroke-width", 1.1)
        .attr("opacity", 0.95);

    ringHours.forEach(function (hr) {
        var labelAngle = -Math.PI / 2 + 0.18;
        var lx = cx + Math.cos(labelAngle) * rScale(hr);
        var ly = cy + Math.sin(labelAngle) * rScale(hr);
        svg.append("rect")
            .attr("x", lx - 22).attr("y", ly - 9)
            .attr("width", 44).attr("height", 17).attr("rx", 2)
            .attr("fill", COLOR_NIGHT);
        svg.append("text")
            .attr("x", lx).attr("y", ly + 4)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(hr + " h");
    });

    svg.append("text")
        .attr("x", cx).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("each person, broken into the pieces of their night");

    var moonG = svg.append("g");
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 48).attr("fill", COLOR_MOON).attr("opacity", 0.14);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 38).attr("fill", COLOR_MOON).attr("opacity", 0.28);
    moonG.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 30).attr("fill", COLOR_MOON);
    moonG.append("circle").attr("cx", cx - 12).attr("cy", cy - 9).attr("r", 24).attr("fill", COLOR_NIGHT);

    data.sort(function (a, b) {
        var aTier = +a.cognitive_score >= 26 ? 0 : +a.cognitive_score >= 22 ? 1 : 2;
        var bTier = +b.cognitive_score >= 26 ? 0 : +b.cognitive_score >= 22 ? 1 : 2;
        return aTier - bTier;
    });

    var fragments = [];
    data.forEach(function (d, i) {
        var pieces = Math.max(1, Math.min(6, +d.fragmentation_count + 1));
        var baseAngle = (i / data.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
        var baseR = rScale(+d.total_sleep);
        var color = nightColorByCognitive(+d.cognitive_score);

        for (var p = 0; p < pieces; p++) {
            var angleOffset = (p / pieces) * 0.18 - 0.09 + (Math.random() - 0.5) * 0.04;
            var rOffset = (Math.random() - 0.5) * 12;
            var fAngle = baseAngle + angleOffset;
            var fr = baseR + rOffset;
            fragments.push({
                personId: d.id,
                pieces: pieces,
                cognitive: +d.cognitive_score,
                totalSleep: +d.total_sleep,
                efficiency: +d.sleep_efficiency,
                x: cx + Math.cos(fAngle) * fr,
                y: cy + Math.sin(fAngle) * fr,
                color: color,
                size: pieces > 4 ? 4 : pieces > 2 ? 5 : 7
            });
        }
    });

    var stars = svg.selectAll(".frag-star")
        .data(fragments).enter().append("path")
        .attr("class", "frag-star")
        .attr("d", function (f) { return starPath(f.size); })
        .attr("transform", function (f) { return "translate(" + f.x + "," + f.y + ") scale(0)"; })
        .attr("fill", function (f) { return f.color; })
        .attr("opacity", 0)
        .style("cursor", "pointer")
        .on("mouseover", function (event, f) {
            d3.select(this).raise()
                .transition().duration(120)
                .attr("transform", "translate(" + f.x + "," + f.y + ") scale(2.2)")
                .attr("opacity", 1);
            var tier = f.cognitive >= 26 ? "strong cognition" : f.cognitive >= 22 ? "fair" : "declining";
            showTip(event,
                "<strong style='color:" + f.color + ";font-style:normal;font-weight:500;'>Person #" + f.personId + "</strong><br>" +
                "slept " + f.totalSleep.toFixed(1) + " h in " + f.pieces + " piece" + (f.pieces === 1 ? "" : "s") + "<br>" +
                "sleep efficiency: " + f.efficiency.toFixed(0) + "%<br>" +
                tier
            );
        })
        .on("mousemove", moveTip)
        .on("mouseout", function (event, f) {
            d3.select(this)
                .transition().duration(150)
                .attr("transform", "translate(" + f.x + "," + f.y + ") scale(1)")
                .attr("opacity", 0.55);
            hideTip();
        });

    var legendY = h - 24;
    svg.append("line")
        .attr("x1", 30).attr("x2", w - 30)
        .attr("y1", legendY - 22).attr("y2", legendY - 22)
        .attr("stroke", "#3a4868").attr("stroke-width", 0.5);

    svg.append("text")
        .attr("x", 30).attr("y", legendY)
        .attr("fill", COLOR_NIGHT_LABEL)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("color = cognitive score:");

    var legendItems = [
        { color: COLOR_MOON, label: "strong", x: 220 },
        { color: "#c4a8d1", label: "fair", x: 290 },
        { color: "#7d8eb0", label: "declining", x: 360 }
    ];
    legendItems.forEach(function (item) {
        svg.append("path")
            .attr("d", starPath(STAR_SIZE_LEGEND))
            .attr("transform", "translate(" + (item.x + 6) + "," + (legendY - 4) + ")")
            .attr("fill", item.color);
        svg.append("text")
            .attr("x", item.x + 20).attr("y", legendY)
            .attr("fill", COLOR_NIGHT_CAPTION)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text(item.label);
    });

    svg.append("text")
        .attr("x", w - 30).attr("y", legendY)
        .attr("text-anchor", "end")
        .attr("fill", COLOR_NIGHT_CAPTION)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("each cluster = one person, broken");

    watchForScrollIn(canvas, function () {
        stars
            .transition()
            .delay(function (d, i) { return (i % 200) * 4 + Math.random() * 200; })
            .duration(700)
            .ease(d3.easeCubicOut)
            .attr("transform", function (f) { return "translate(" + f.x + "," + f.y + ") scale(1)"; })
            .attr("opacity", 0.55);
    });
}


function drawPlate5_2Slope(data) {
    var canvas = document.getElementById("canvas-5-2");

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var intact = data.filter(function (d) { return +d.sleep_efficiency >= 85; });
    var fragmented = data.filter(function (d) { return +d.sleep_efficiency < 75; });

    var metrics = [
        { key: "cognitive_score", label: "cognitive score", fmt: ".1f", goodIsHigh: true },
        { key: "memory_recall_pct", label: "memory recall (%)", fmt: ".0f", goodIsHigh: true },
        { key: "fall_risk_score", label: "fall risk score", fmt: ".0f", goodIsHigh: false },
        { key: "crp_mg_l", label: "inflammation (CRP)", fmt: ".1f", goodIsHigh: false },
        { key: "loneliness_score", label: "loneliness score", fmt: ".1f", goodIsHigh: false }
    ];

    metrics.forEach(function (m) {
        m.intactVal = d3.mean(intact, function (d) { return +d[m.key]; });
        m.fragVal = d3.mean(fragmented, function (d) { return +d[m.key]; });
    });

    var topMargin = 100;
    var bottomMargin = 60;
    var labelColW = 180;
    var rightColX = w - 130;
    var leftColX = labelColW + 40;
    var lineW = rightColX - leftColX;
    var rowH = (h - topMargin - bottomMargin) / metrics.length;

    function fmt(val, spec) {
        if (spec === ".0f") return Math.round(val).toString();
        return val.toFixed(1);
    }

    svg.append("text")
        .attr("x", leftColX + lineW / 2).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("five late-life outcomes, sorted by sleep continuity");

    svg.append("text")
        .attr("x", leftColX).attr("y", topMargin - 36)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_GOOD)
        .style("font-family", "'Fraunces', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "16px")
        .style("font-weight", "500")
        .text("intact sleepers");
    svg.append("text")
        .attr("x", leftColX).attr("y", topMargin - 18)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("efficiency 85% or higher  n = " + intact.length);

    svg.append("text")
        .attr("x", rightColX).attr("y", topMargin - 36)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_BAD)
        .style("font-family", "'Fraunces', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "16px")
        .style("font-weight", "500")
        .text("fragmented sleepers");
    svg.append("text")
        .attr("x", rightColX).attr("y", topMargin - 18)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("efficiency under 75%  n = " + fragmented.length);

    metrics.forEach(function (m, i) {
        var rowY = topMargin + (i + 0.5) * rowH;

        svg.append("text")
            .attr("x", labelColW).attr("y", rowY + 4)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "14px")
            .text(m.label);

        var leftColor = m.goodIsHigh ? COLOR_GOOD : COLOR_GOOD;
        var rightColor = m.goodIsHigh ? COLOR_BAD : COLOR_BAD;

        svg.append("path")
            .attr("d", starPath(36))
            .attr("transform", "translate(" + leftColX + "," + rowY + ")")
            .attr("fill", leftColor)
            .attr("opacity", 0)
            .attr("class", "slope5-rested-" + i);

        svg.append("text")
            .attr("x", leftColX).attr("y", rowY - 18)
            .attr("text-anchor", "middle")
            .attr("fill", leftColor)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .attr("opacity", 0)
            .attr("class", "slope5-rested-val-" + i)
            .text(fmt(m.intactVal, m.fmt));

        svg.append("path")
            .attr("d", starPath(36))
            .attr("transform", "translate(" + rightColX + "," + rowY + ")")
            .attr("fill", rightColor)
            .attr("opacity", 0)
            .attr("class", "slope5-deficit-" + i);

        svg.append("text")
            .attr("x", rightColX).attr("y", rowY - 18)
            .attr("text-anchor", "middle")
            .attr("fill", rightColor)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .attr("opacity", 0)
            .attr("class", "slope5-deficit-val-" + i)
            .text(fmt(m.fragVal, m.fmt));

        svg.append("line")
            .attr("x1", leftColX + 14).attr("y1", rowY)
            .attr("x2", leftColX + 14).attr("y2", rowY)
            .attr("stroke", "#8d6a4a").attr("stroke-width", 1)
            .attr("opacity", 0)
            .attr("class", "slope5-line-" + i);
    });

    watchForScrollIn(canvas, function () {
        metrics.forEach(function (m, i) {
            var delay = i * 200;
            svg.select(".slope5-rested-" + i).transition().delay(delay).duration(500)
                .ease(d3.easeBackOut.overshoot(1.4)).attr("opacity", 1);
            svg.select(".slope5-rested-val-" + i).transition().delay(delay + 200).duration(400).attr("opacity", 1);

            svg.select(".slope5-line-" + i).transition().delay(delay + 400).duration(700)
                .attr("x2", rightColX - 14)
                .attr("opacity", 0.5);

            svg.select(".slope5-deficit-" + i).transition().delay(delay + 1000).duration(500)
                .ease(d3.easeBackOut.overshoot(1.4)).attr("opacity", 1);
            svg.select(".slope5-deficit-val-" + i).transition().delay(delay + 1200).duration(400).attr("opacity", 1);
        });
    });
}


function drawPlate5_3CognitiveRidge(data) {
    var canvas = document.getElementById("canvas-5-3");

    var w = canvas.clientWidth;
    var h = 480;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    var leftMargin = 140;
    var rightMargin = 60;
    var topMargin = 70;
    var bottomMargin = 70;
    var plotW = w - leftMargin - rightMargin;
    var plotH = h - topMargin - bottomMargin;

    var bands = [
        { key: "long", label: "sleeps 7+ h", filter: function (d) { return +d.total_sleep >= 7; }, color: COLOR_GOOD, idx: 0 },
        { key: "mid", label: "sleeps 6\u20137 h", filter: function (d) { return +d.total_sleep >= 6 && +d.total_sleep < 7; }, color: COLOR_MID, idx: 1 },
        { key: "short", label: "sleeps under 6 h", filter: function (d) { return +d.total_sleep < 6; }, color: COLOR_BAD, idx: 2 }
    ];

    var allCog = data.map(function (d) { return +d.cognitive_score; });
    var cogMin = d3.min(allCog) - 1;
    var cogMax = d3.max(allCog) + 1;
    var cogScale = d3.scaleLinear().domain([cogMin, cogMax]).range([leftMargin, w - rightMargin]);
    var rowH = plotH / bands.length;

    [16, 20, 24, 28].forEach(function (c) {
        if (c < cogMin || c > cogMax) return;
        svg.append("line")
            .attr("x1", cogScale(c)).attr("x2", cogScale(c))
            .attr("y1", topMargin).attr("y2", topMargin + plotH)
            .attr("stroke", COLOR_PAPER_RULE).attr("stroke-width", 0.4)
            .attr("opacity", 0.3);
        svg.append("text")
            .attr("x", cogScale(c)).attr("y", topMargin + plotH + 22)
            .attr("text-anchor", "middle")
            .attr("fill", COLOR_INK_LIGHT)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "12px")
            .text(c);
    });

    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", topMargin + plotH + 44)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_RULE)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "13px")
        .text("cognitive score \u2192 (higher is stronger)");

    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", COLOR_INK_LIGHT)
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px")
        .text("how cognitive scores shift as nightly sleep falls");

    var ridges = bands.map(function (band) {
        var subset = data.filter(band.filter).map(function (d) { return +d.cognitive_score; });
        var n = subset.length;
        var bandY = topMargin + (band.idx + 0.5) * rowH;

        var bins = d3.bin().domain([cogMin, cogMax]).thresholds(20)(subset);
        var maxCount = d3.max(bins, function (b) { return b.length; }) || 1;
        var ridgeHeight = rowH * 0.7;
        var ridgeYScale = d3.scaleLinear().domain([0, maxCount]).range([0, ridgeHeight]);

        var ridgePoints = bins.map(function (b) {
            return { x: cogScale((b.x0 + b.x1) / 2), y: bandY - ridgeYScale(b.length) };
        });

        var areaPath = d3.area()
            .x(function (d) { return d.x; })
            .y0(bandY)
            .y1(function (d) { return d.y; })
            .curve(d3.curveBasis);
        var linePath = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .curve(d3.curveBasis);

        var areaEl = svg.append("path")
            .datum(ridgePoints)
            .attr("d", areaPath)
            .attr("fill", band.color)
            .attr("opacity", 0)
            .attr("transform", "translate(0," + (rowH * 0.6) + ")");
        var lineEl = svg.append("path")
            .datum(ridgePoints)
            .attr("d", linePath)
            .attr("fill", "none")
            .attr("stroke", band.color)
            .attr("stroke-width", 1.5)
            .attr("opacity", 0)
            .attr("transform", "translate(0," + (rowH * 0.6) + ")");

        svg.append("text")
            .attr("x", leftMargin - 14).attr("y", bandY + 4)
            .attr("text-anchor", "end")
            .attr("fill", band.color)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("font-weight", "500")
            .text(band.label);

        svg.append("text")
            .attr("x", leftMargin - 14).attr("y", bandY + 20)
            .attr("text-anchor", "end")
            .attr("fill", COLOR_INK_RULE)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "11px")
            .text("n = " + n);

        var meanCog = d3.mean(subset);
        var meanX = cogScale(meanCog || 0);
        var meanLine = svg.append("line")
            .attr("x1", meanX).attr("x2", meanX)
            .attr("y1", bandY).attr("y2", bandY)
            .attr("stroke", band.color).attr("stroke-width", 0.8)
            .attr("stroke-dasharray", "3 3")
            .attr("opacity", 0);

        return { area: areaEl, line: lineEl, idx: band.idx, meanLine: meanLine, bandY: bandY, ridgeHeight: ridgeHeight };
    });

    watchForScrollIn(canvas, function () {
        ridges.forEach(function (r) {
            var delay = r.idx * 200;
            r.area.transition().delay(delay).duration(900).ease(d3.easeCubicOut)
                .attr("transform", "translate(0,0)")
                .attr("opacity", 0.45);
            r.line.transition().delay(delay).duration(900).ease(d3.easeCubicOut)
                .attr("transform", "translate(0,0)")
                .attr("opacity", 1);
            r.meanLine.transition().delay(delay + 700).duration(500)
                .attr("y1", r.bandY - r.ridgeHeight - 4)
                .attr("opacity", 0.7);
        });
    });
}


// --- Finale: Lifespan Deficit Calculator ---

function drawFinale(allChapters) {
    var canvas = document.getElementById("finale-canvas");

    var slider = document.getElementById("finale-age-slider");
    var ageDisplay = document.getElementById("finale-age-display");
    var deficitPre = document.getElementById("finale-deficit-pre");
    var deficitNumber = document.getElementById("finale-deficit-number");

    function ageRange(stage) {
        if (stage === "child") return [6, 12];
        if (stage === "teen") return [13, 17];
        if (stage === "young") return [18, 25];
        if (stage === "adult") return [26, 64];
        return [65, 85];
    }

    function recommendedHours(age) {
        if (age <= 12) return 10;
        if (age <= 17) return 9;
        if (age <= 25) return 8;
        return 7.5;
    }

    function lifeFromRow(row, stage) {
        var sleep, well, label;
        if (stage === "child") {
            sleep = +row.total_sleep;
            well = (+row.attention_score - 30) / 50;
            label = "attention";
        } else if (stage === "teen") {
            sleep = +row.total_sleep;
            well = (15 - +row.anxiety_score) / 15;
            label = "anxiety";
        } else if (stage === "young") {
            sleep = +row.weekday_sleep;
            well = (80 - +row.burnout_score) / 80;
            label = "burnout";
        } else if (stage === "adult") {
            sleep = +row.total_sleep;
            well = (160 - +row.systolic_bp) / 50;
            label = "blood pressure";
        } else {
            sleep = +row.total_sleep;
            well = (+row.cognitive_score - 15) / 15;
            label = "cognition";
        }
        well = Math.max(0, Math.min(1, well));
        var rng = ageRange(stage);
        var age = rng[0] + Math.random() * (rng[1] - rng[0]);
        return { age: age, sleep: sleep, well: well, label: label, stage: stage };
    }

    var lives = [];
    allChapters.child.forEach(function (r) { lives.push(lifeFromRow(r, "child")); });
    allChapters.teen.forEach(function (r) { lives.push(lifeFromRow(r, "teen")); });
    allChapters.young.forEach(function (r) { lives.push(lifeFromRow(r, "young")); });
    allChapters.adult.forEach(function (r) { lives.push(lifeFromRow(r, "adult")); });
    allChapters.older.forEach(function (r) { lives.push(lifeFromRow(r, "older")); });

    var w = canvas.clientWidth;
    var h = 540;

    var svg = d3.select(canvas).append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("width", "100%")
        .attr("height", h)
        .style("display", "block");

    svg.append("rect").attr("x", 0).attr("y", 0).attr("width", w).attr("height", h).attr("fill", COLOR_NIGHT);

    var defs = svg.append("defs");

    var textShadow = defs.append("filter")
        .attr("id", "finale-text-shadow")
        .attr("x", "-20%").attr("y", "-20%")
        .attr("width", "140%").attr("height", "140%");
    textShadow.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", "2");
    textShadow.append("feFlood").attr("flood-color", "#1a2540").attr("flood-opacity", "0.95");
    textShadow.append("feComposite").attr("in2", "SourceAlpha").attr("operator", "in");
    var merge = textShadow.append("feMerge");
    merge.append("feMergeNode");
    merge.append("feMergeNode");
    merge.append("feMergeNode");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    var grad = defs.append("linearGradient").attr("id", "lifespan-grad").attr("x1", "0%").attr("x2", "100%").attr("y1", "0%").attr("y2", "0%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#f4d488");
    grad.append("stop").attr("offset", "12%").attr("stop-color", "#ecc880");
    grad.append("stop").attr("offset", "22%").attr("stop-color", "#dab68f");
    grad.append("stop").attr("offset", "35%").attr("stop-color", "#b8a4c2");
    grad.append("stop").attr("offset", "55%").attr("stop-color", "#9d9bbf");
    grad.append("stop").attr("offset", "75%").attr("stop-color", "#8a93b6");
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#7d8eb0");

    var leftMargin = 80;
    var rightMargin = 60;
    var topMargin = 100;
    var bottomMargin = 90;
    var plotW = w - leftMargin - rightMargin;
    var plotH = h - topMargin - bottomMargin;

    var xScale = d3.scaleLinear().domain([6, 85]).range([leftMargin, w - rightMargin]);
    var yScale = d3.scaleLinear().domain([3.5, 12]).range([h - bottomMargin, topMargin]);

    var bgStarsG = svg.append("g").attr("class", "finale-bg-stars");

    function quantile(arr, q) {
        var sorted = arr.slice().sort(function (a, b) { return a - b; });
        var pos = (sorted.length - 1) * q;
        var base = Math.floor(pos);
        var rest = pos - base;
        if (sorted[base + 1] !== undefined) return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        return sorted[base];
    }

    var bandCenters = [];
    for (var a = 6; a <= 85; a += 1) {
        var stage = a <= 12 ? "child" : a <= 17 ? "teen" : a <= 25 ? "young" : a <= 64 ? "adult" : "older";
        var sample = lives.filter(function (l) { return l.stage === stage && Math.abs(l.age - a) <= 3; });
        if (sample.length < 8) sample = lives.filter(function (l) { return l.stage === stage; });
        var sleeps = sample.map(function (l) { return l.sleep; });
        bandCenters.push({
            age: a,
            median: quantile(sleeps, 0.5),
            p25: quantile(sleeps, 0.25),
            p75: quantile(sleeps, 0.75),
            p10: quantile(sleeps, 0.1),
            p90: quantile(sleeps, 0.9)
        });
    }

    function smoothColumn(arr, key, windowSize) {
        var smoothed = arr.map(function (d, i) {
            var lo = Math.max(0, i - windowSize);
            var hi = Math.min(arr.length - 1, i + windowSize);
            var sum = 0, count = 0;
            for (var j = lo; j <= hi; j++) { sum += arr[j][key]; count++; }
            return sum / count;
        });
        smoothed.forEach(function (v, i) { arr[i][key + "_smooth"] = v; });
    }
    smoothColumn(bandCenters, "median", 7);
    smoothColumn(bandCenters, "p25", 6);
    smoothColumn(bandCenters, "p75", 6);
    smoothColumn(bandCenters, "p10", 7);
    smoothColumn(bandCenters, "p90", 7);

    var outerRibbonArea = d3.area()
        .x(function (d) { return xScale(d.age); })
        .y0(function (d) { return yScale(d.p10_smooth); })
        .y1(function (d) { return yScale(d.p90_smooth); })
        .curve(d3.curveBumpX);

    var innerRibbonArea = d3.area()
        .x(function (d) { return xScale(d.age); })
        .y0(function (d) { return yScale(d.p25_smooth); })
        .y1(function (d) { return yScale(d.p75_smooth); })
        .curve(d3.curveBumpX);

    var medianLine = d3.line()
        .x(function (d) { return xScale(d.age); })
        .y(function (d) { return yScale(d.median_smooth); })
        .curve(d3.curveBumpX);

    [10, 8, 6, 4].forEach(function (hr) {
        svg.append("line")
            .attr("x1", leftMargin).attr("x2", w - rightMargin)
            .attr("y1", yScale(hr)).attr("y2", yScale(hr))
            .attr("stroke", "#2e3a5e").attr("stroke-width", 0.4)
            .attr("stroke-dasharray", "2 5").attr("opacity", 0.4);
        svg.append("text")
            .attr("x", leftMargin - 10).attr("y", yScale(hr) + 4)
            .attr("text-anchor", "end")
            .attr("fill", "#fff")
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "14px")
            .text(hr + " h");
    });

    [10, 25, 40, 55, 70, 85].forEach(function (a) {
        svg.append("text")
            .attr("x", xScale(a)).attr("y", h - bottomMargin + 22)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "14px")
            .text(a);
    });
    svg.append("text")
        .attr("x", leftMargin + plotW / 2).attr("y", h - bottomMargin + 44)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "14px")
        .text("age");

    svg.append("text")
        .attr("x", 26).attr("y", topMargin + plotH / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "14px")
        .attr("transform", "rotate(-90 26," + (topMargin + plotH / 2) + ")")
        .text("hours of sleep");

    var stageMarkers = [
        { age: 9, text: "childhood" },
        { age: 15, text: "teens" },
        { age: 21.5, text: "young adult" },
        { age: 45, text: "adult" },
        { age: 75, text: "older adult" }
    ];
    stageMarkers.forEach(function (s) {
        svg.append("text")
            .attr("x", xScale(s.age)).attr("y", h - bottomMargin - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .attr("opacity", 0.55)
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .style("letter-spacing", "1.2px")
            .text(s.text);
    });

    var outerRibbon = svg.append("path")
        .datum(bandCenters)
        .attr("d", outerRibbonArea)
        .attr("fill", "#5d6580")
        .attr("opacity", 0);

    var innerRibbon = svg.append("path")
        .datum(bandCenters)
        .attr("d", innerRibbonArea)
        .attr("fill", "#7a7a9a")
        .attr("opacity", 0);

    var medianPath = svg.append("path")
        .datum(bandCenters)
        .attr("d", medianLine)
        .attr("fill", "none")
        .attr("stroke", "url(#lifespan-grad)")
        .attr("stroke-width", 1.2)
        .attr("stroke-linecap", "round")
        .attr("opacity", 0);

    var medianLength;
    medianPath.node && (medianLength = medianPath.node().getTotalLength());

    var minorStarsG = svg.append("g").attr("class", "finale-minor-stars").style("opacity", 0);
    bandCenters.forEach(function (d, i) {
        if (i % 4 !== 0) return;
        var jitter = (Math.random() - 0.5) * 4;
        minorStarsG.append("path")
            .attr("d", starPath(6))
            .attr("transform", "translate(" + xScale(d.age) + "," + (yScale(d.median_smooth) + jitter) + ")")
            .attr("fill", "#fff")
            .attr("opacity", 0.5);
    });

    var exemplarG = svg.append("g").attr("class", "finale-exemplars").style("opacity", 0);

    function pickExemplar(stage, targetAge, sleepRange) {
        var pool = lives.filter(function (l) {
            return l.stage === stage && l.sleep >= sleepRange[0] && l.sleep <= sleepRange[1];
        });
        if (!pool.length) pool = lives.filter(function (l) { return l.stage === stage; });
        var pick = pool[Math.floor(Math.random() * pool.length)];
        return { age: targetAge, sleep: pick.sleep, well: pick.well, label: pick.label, stage: stage };
    }

    var exemplars = [
        Object.assign(pickExemplar("child", 8, [9.5, 10.5]), { name: "a child, age 8" }),
        Object.assign(pickExemplar("teen", 15, [6.5, 7.5]), { name: "a teen, age 15" }),
        Object.assign(pickExemplar("young", 23, [6.5, 7.5]), { name: "a college student, age 23" }),
        Object.assign(pickExemplar("adult", 42, [6.5, 7.5]), { name: "a parent, age 42" }),
        Object.assign(pickExemplar("older", 76, [5.5, 6.5]), { name: "a retiree, age 76" })
    ];

    for (var ei = 0; ei < exemplars.length - 1; ei++) {
        var e1 = exemplars[ei];
        var e2 = exemplars[ei + 1];
        exemplarG.append("line")
            .attr("x1", xScale(e1.age)).attr("y1", yScale(e1.sleep))
            .attr("x2", xScale(e2.age)).attr("y2", yScale(e2.sleep))
            .attr("stroke", "#fff").attr("stroke-width", 1)
            .attr("stroke-dasharray", "3 3").attr("opacity", 0.6);
    }

    exemplars.forEach(function (e, ei) {
        var ex = xScale(e.age);
        var ey = yScale(e.sleep);
        exemplarG.append("circle")
            .attr("cx", ex).attr("cy", ey).attr("r", 7)
            .attr("fill", "#fff").attr("opacity", 0.08);
        exemplarG.append("path")
            .attr("d", starPath(36))
            .attr("transform", "translate(" + ex + "," + ey + ")")
            .attr("fill", "#fff");

        var anchor = "middle";
        var anchorOffsetX = 0;
        if (ei === 0) { anchor = "start"; anchorOffsetX = 14; }
        else if (ei === exemplars.length - 1) { anchor = "end"; anchorOffsetX = -14; }

        var labelOffsetY = e.stage === "teen" || e.stage === "older" ? 28 : -22;
        exemplarG.append("text")
            .attr("x", ex + anchorOffsetX).attr("y", ey + labelOffsetY)
            .attr("text-anchor", anchor)
            .attr("fill", "#fff")
            .attr("filter", "url(#finale-text-shadow)")
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "15px")
            .text(e.name);

        var subOffsetY = labelOffsetY > 0 ? labelOffsetY + 16 : labelOffsetY - 14;
        exemplarG.append("text")
            .attr("x", ex + anchorOffsetX).attr("y", ey + subOffsetY)
            .attr("text-anchor", anchor)
            .attr("fill", "#fff")
            .attr("filter", "url(#finale-text-shadow)")
            .style("font-family", "'Crimson Pro', Georgia, serif")
            .style("font-style", "italic")
            .style("font-size", "13px")
            .text("sleeps " + e.sleep.toFixed(1) + " h");
    });

    var lineG = svg.append("g").attr("class", "finale-line").style("opacity", 0);

    var youLine = lineG.append("line")
        .attr("y1", topMargin - 60).attr("y2", h - bottomMargin)
        .attr("stroke", "#fff").attr("stroke-width", 0.8)
        .attr("stroke-dasharray", "3 4").attr("opacity", 0.55);

    var youGlow = lineG.append("circle")
        .attr("r", 22).attr("fill", "#fff").attr("opacity", 0.06);
    var youGlowMid = lineG.append("circle")
        .attr("r", 12).attr("fill", "#fff").attr("opacity", 0.16);
    var youStar = lineG.append("path")
        .attr("d", starPath(56))
        .attr("fill", "#fff");

    var youLabelBg = lineG.append("rect")
        .attr("rx", 2)
        .attr("fill", COLOR_NIGHT)
        .attr("stroke", "#fff").attr("stroke-width", 0.5).attr("opacity", 0.96);
    var youLabel = lineG.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "16px");
    var youSubLabel = lineG.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-family", "'Crimson Pro', Georgia, serif")
        .style("font-style", "italic")
        .style("font-size", "12px");

    function deficitForAge(age) {
        var totalLost = 0;
        for (var a = 6; a < age; a++) {
            var rec = recommendedHours(a);
            var stage = a <= 12 ? "child" : a <= 17 ? "teen" : a <= 25 ? "young" : a <= 64 ? "adult" : "older";
            var sample = lives.filter(function (l) { return l.stage === stage; });
            var avgSleep = d3.mean(sample, function (l) { return l.sleep; });
            var nightlyShort = Math.max(0, rec - avgSleep);
            totalLost += nightlyShort * 365;
        }
        return totalLost;
    }

    function formatDeficit(hours) {
        var days = hours / 8;
        if (days < 30) return Math.round(days) + " days";
        if (days < 365) return Math.round(days / 7) + " weeks";
        if (days < 730) {
            var months = days / 30;
            return months.toFixed(1) + " months";
        }
        var years = days / 365;
        return years.toFixed(1) + " years";
    }

    function medianAtAge(age) {
        var i = Math.max(0, Math.min(bandCenters.length - 1, Math.round(age - 6)));
        return bandCenters[i].median_smooth;
    }

    function updateMarker(targetAge) {
        var lineX = xScale(targetAge);
        var med = medianAtAge(targetAge);
        var starY = yScale(med);

        youLine.transition().duration(180).attr("x1", lineX).attr("x2", lineX);
        youGlow.transition().duration(180).attr("cx", lineX).attr("cy", starY);
        youGlowMid.transition().duration(180).attr("cx", lineX).attr("cy", starY);
        youStar.transition().duration(180).attr("transform", "translate(" + lineX + "," + starY + ")");

        var labelText = "you, age " + targetAge;
        var subText = "typical sleep: " + med.toFixed(1) + " h";

        var labelBoxX = lineX;
        var labelW = 150;
        if (labelBoxX - labelW / 2 < leftMargin + 4) labelBoxX = leftMargin + labelW / 2 + 4;
        if (labelBoxX + labelW / 2 > w - rightMargin - 4) labelBoxX = w - rightMargin - labelW / 2 - 4;

        youLabelBg.transition().duration(180)
            .attr("x", labelBoxX - labelW / 2).attr("y", topMargin - 80)
            .attr("width", labelW).attr("height", 44);
        youLabel.transition().duration(180)
            .attr("x", labelBoxX).attr("y", topMargin - 60)
            .text(labelText);
        youSubLabel.transition().duration(180)
            .attr("x", labelBoxX).attr("y", topMargin - 44)
            .text(subText);

        var totalLostHours = deficitForAge(targetAge);
        deficitPre.textContent = "By age " + targetAge + ", your body has likely been owed";
        deficitNumber.textContent = "~ " + formatDeficit(totalLostHours);
    }

    function placeBackgroundStars() {
        for (var bi = 0; bi < 90; bi++) {
            var bx = leftMargin + Math.random() * plotW;
            var byTop = topMargin + Math.random() * plotH;
            var ageAt = xScale.invert(bx);
            var medAt = medianAtAge(ageAt);
            var sleepAt = yScale.invert(byTop);
            var distance = Math.abs(sleepAt - medAt);
            if (distance < 1.5) continue;

            var size = 0.3 + Math.random() * 0.8;
            var op = 0.18 + Math.random() * 0.35;
            bgStarsG.append("circle")
                .attr("cx", bx).attr("cy", byTop)
                .attr("r", size)
                .attr("fill", "#f4d488")
                .attr("opacity", op);
        }

        for (var ti = 0; ti < 18; ti++) {
            var tx = leftMargin + Math.random() * plotW;
            var ty = topMargin - 8 - Math.random() * 50;
            bgStarsG.append("circle")
                .attr("cx", tx).attr("cy", ty)
                .attr("r", 0.4 + Math.random() * 0.7)
                .attr("fill", "#f4d488")
                .attr("opacity", 0.3 + Math.random() * 0.4);
        }
    }
    placeBackgroundStars();

    var initialized = false;
    var hintEl = document.getElementById("finale-hint");
    var hintFaded = false;

    function fadeHint() {
        if (hintFaded || !hintEl) return;
        hintFaded = true;
        hintEl.classList.add("is-faded");
    }

    watchForScrollIn(canvas, function () {
        initialized = true;

        outerRibbon.transition().delay(200).duration(1100).attr("opacity", 0.07);
        innerRibbon.transition().delay(500).duration(1100).attr("opacity", 0.18);

        if (medianLength) {
            medianPath
                .attr("stroke-dasharray", medianLength + " " + medianLength)
                .attr("stroke-dashoffset", medianLength)
                .attr("opacity", 1)
                .transition().delay(700).duration(2000).ease(d3.easeCubicOut)
                .attr("stroke-dashoffset", 0);
        } else {
            medianPath.transition().delay(700).duration(900).attr("opacity", 1);
        }

        minorStarsG.transition().delay(1800).duration(900).style("opacity", 1);
        exemplarG.transition().delay(2400).duration(1000).style("opacity", 1);
        lineG.transition().delay(3200).duration(800).style("opacity", 1);

        updateMarker(+slider.value);
    });

    slider.addEventListener("input", function () {
        var v = +slider.value;
        ageDisplay.textContent = v;
        fadeHint();
        if (initialized) updateMarker(v);
    });

    updateMarker(+slider.value);
}

// --- Data Loading & Initialization ---
Promise.all([
    d3.csv("data/01_children.csv"),
    d3.csv("data/02_teenagers.csv"),
    d3.csv("data/03_young_adults.csv"),
    d3.csv("data/04_adults.csv"),
    d3.csv("data/05_older_adults.csv")
]).then(function (results) {
    var children = results[0];
    var teens = results[1];
    var young = results[2];
    var adults = results[3];
    var older = results[4];

    drawPlate1Orbit(children);
    drawPlate2Ridgeline(children);
    drawPlate3Fall(children);

    drawPlate2_1Orbit(teens);
    drawPlate2_2Radar(teens);
    drawPlate2_3Quadrants(teens);

    drawPlate3_1PairedOrbit(young);
    drawPlate3_2BurnoutRidge(young);
    drawPlate3_3CortisolHexbin(young);

    drawPlate4_1Orbit(adults);
    drawPlate4_2Slope(adults);
    drawPlate4_3BPHexbin(adults);

    drawPlate5_1FragmentedOrbit(older);
    drawPlate5_2Slope(older);
    drawPlate5_3CognitiveRidge(older);

    drawFinale({
        child: children,
        teen: teens,
        young: young,
        adult: adults,
        older: older
    });
}).catch(function (err) {
    console.error("Failed to load data:", err);
});
