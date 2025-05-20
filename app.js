(function(){
  "use strict";

  var svg = d3.select("svg");
  var clockText;
  var countdownTime;
  var countdownInterval;

  function drawGlobe(width, height) {
    svg.selectAll("*").remove();

    var projection90 = d3.geo.orthographic()
      .scale(Math.min(width, height) / 2.5)
      .rotate([0,0])
      .translate([width / 2, height / 2])
      .clipAngle(90);

    var projection180 = d3.geo.orthographic()
      .scale(Math.min(width, height) / 2.5)
      .rotate([0,0])
      .translate([width / 2, height / 2])
      .clipAngle(180);

    var frontPath = d3.geo.path().projection(projection90);
    var backPath = d3.geo.path().projection(projection180);

    d3.json("https://github.com/mungeru/oz/blob/main/Landmasses.geojson", function(geojson){
      var stage = svg.append("g")
        .attr("transform", "rotate(23.4," + width/2 + "," + height/2 + ")");

      var backMap = stage.append("path")
        .attr("d", backPath(geojson))
        .attr("fill", "#EDE9F1");

      var frontMap = stage.append("path")
        .attr("d", frontPath(geojson))
        .attr("fill", "#FD81DB");

      var i = 0;
      setInterval(function(){
        i += 0.2;
        projection90.rotate([i,0]);
        projection180.rotate([i,0]);
        frontMap.attr("d", frontPath(geojson));
        backMap.attr("d", backPath(geojson));
      }, 100);

      drawClock(width, height);
    });
  }

  function drawClock(width, height) {
    var clockWidth = width * 0.6;
    var clockHeight = clockWidth * 0.2;
    var fontSize = Math.max(width, height) * 0.09;
    var jpnFontSize = fontSize * 0.4;

    var clockGroup = svg.append("g")
      .attr("transform", `translate(${(width - clockWidth) / 2}, ${(height - clockHeight) / 2})`);

    clockGroup.append("rect")
      .attr("width", clockWidth)
      .attr("height", clockHeight)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill", "#EDE9F1")
      .style("fill-opacity", 0.6);

    clockText = svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2 + 7)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", fontSize)
      .attr("font-weight", "bold")
      .attr("font-family", "Arial")
      .style("fill", "#333")
      .text("00:00:00");

    var jpnGroup = svg.append("g")
      .attr("transform", `translate(${(width - jpnFontSize * 3) / 2}, ${(height - clockHeight) / 2 - jpnFontSize * 1.8})`);

    jpnGroup.append("rect")
      .attr("width", jpnFontSize * 3)
      .attr("height", jpnFontSize * 1.1)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill", "#EDE9F1")
      .style("fill-opacity", 0.6);

    jpnGroup.append("text")
      .attr("x", (jpnFontSize * 3) / 2)
      .attr("y", jpnFontSize * 0.9)
      .attr("text-anchor", "middle")
      .attr("font-size", jpnFontSize)
      .attr("font-weight", "bold")
      .attr("font-family", "Arial")
      .style("fill", "#333")
      .text("JPN");

    // カウントダウン開始ボタン
    var btnWidth = 160;
    var btnHeight = 40;
    var btnFontSize = 14;

    var cdBtn = svg.append("g")
      .attr("transform", `translate(${20}, ${20})`);

    cdBtn.append("rect")
      .attr("width", btnWidth)
      .attr("height", btnHeight)
      .attr("rx", 8)
      .attr("ry", 8)
      .style("fill", "#FD81DB")
      .style("fill-opacity", 0.9);

    cdBtn.append("text")
      .attr("x", btnWidth / 2)
      .attr("y", btnHeight / 2 + btnFontSize * 0.35)
      .attr("text-anchor", "middle")
      .attr("font-size", btnFontSize)
      .attr("font-family", "Arial")
      .attr("font-weight", "bold")
      .style("fill", "white")
      .text("count down start");

    // ボタンクリック処理
    cdBtn.on("click", function () {
      countdownTime = Math.floor(Math.random() * 26) + 5;
clockText.remove();

const randHour = Math.floor(Math.random() * 24);
const randMin = Math.floor(Math.random() * 60);
const randSec = Math.floor(Math.random() * 60);
const randomTime = `${pad(randHour)}:${pad(randMin)}:${pad(randSec)}`;

clockText = svg.append("text")
  .attr("x", width / 2)
  .attr("y", height / 2 + 7)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("font-size", fontSize)
  .attr("font-weight", "bold")
  .attr("font-family", "Arial")
  .style("fill", "#333")
  .text(randomTime);

      countdownInterval = setInterval(function() {
        countdownTime--;
        clockText.text(formatTime(countdownTime));

        if (countdownTime <= 0) {
          clearInterval(countdownInterval);
          document.getElementById("clockSound").play();
          clockText.text("カウントダウン終了！");
        }
      }, 1000);
    });
  }

  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return `${pad(minutes)}:${pad(remainingSeconds)}:00`;
  }

  function pad(num) {
    return num < 10 ? "0" + num : num;
  }

  function resize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    drawGlobe(width, height);
  }

  setInterval(function(){
    var currentTime = moment();
    if (clockText) {
      clockText.text(currentTime.format("HH:mm:ss.SS"));
    }

    if (currentTime.minutes() === 0 && currentTime.seconds() === 0 && currentTime.milliseconds() === 0) {
      document.getElementById("clockSound").play();
    }
  }, 1);

  resize();
  window.addEventListener("resize", resize);
})();
