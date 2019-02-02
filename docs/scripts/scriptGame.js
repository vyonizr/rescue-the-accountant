/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */

// game mechanics
window.addEventListener("keydown",function (e) {
    if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        e.preventDefault();
    }
});

var display = "";
var map = 6;
var people = ["1", "l", "¦"];
var targetSymbol = "<span id=\"itswolf\"></span>";
var targetRow = Math.floor(Math.random() * map);
var targetColumn = Math.floor(Math.random() * map);
while (targetRow === map - 1 && (targetColumn === map / 3 || targetColumn === (map / 3) + 1)) {
  targetRow = Math.floor(Math.random() * map);
  targetColumn = Math.floor(Math.random() * map);
}
var targetLocation = Math.floor(Math.random() * 5);
var attempt = 0;

for (var i = 0; i < map; i++) {
  var row = "";

  for (var j = 0; j < map; j++) {
    if (i === map - 1 && j === map / 3) {
      // building entrance
      row += "<td id = \"entrance\" colspan=\"2\">&nbsp</td>";
      j = 3;
    }
    else {
      var windows = "";

      for (var k = 0; k < 5; k++) {
        if (i === targetRow && j === targetColumn && k === targetLocation) {
          windows += targetSymbol;
        }
        else {
          windows += people[Math.floor(Math.random() * people.length)];
        }
      }
      row += "<td>" + windows + "</td>";
    }
  }

  display += "<tr>" + row + "</tr>";
}

var officeName = "<th colspan=" + "\"" + map + "\"" + ">42 exchange</th>";
document.getElementById("building").innerHTML += officeName + display;

// input checker
function submittedFormCheck(event) {
  var isInputTrue = false;
  var floorInput = document.getElementById("target-floor").value;
  var windowInput = document.getElementById("target-window").value;

  if((isNaN(floorInput) || floorInput === "") && (isNaN(windowInput) || windowInput === "")){
    event.preventDefault();
    alert("\"Floor\" and \"Window\" input must be a number between 1 and 6");
  }
  else if(isNaN(floorInput) || floorInput === "" || floorInput < 1 || floorInput > 6) {
    event.preventDefault();
    alert("\"Floor\" input must be a number between 1 and 6");
  }
  else if(isNaN(windowInput) || windowInput === "" || windowInput < 1 || windowInput > 6) {
    event.preventDefault();
    alert("\"Window\" input must be a number between 1 and 6");
  }

  if (isNaN(floorInput) === false && isNaN(windowInput) === false) {
    if (floorInput >= 1 && floorInput <= 6 && windowInput >= 1 &&windowInput <= 6) {
      isInputTrue = true;
    }
  }

  if (isInputTrue) {
    var jasonAsks = [
      "Are you sure he's here?",
      "Clock's ticking. Make it count.",
      "We don't have enough time now. Abort mission."
    ];

    var actualFloor = map - floorInput;
    var actualWindow = windowInput - 1;

    // if input is right
    if (targetRow === actualFloor && targetColumn === actualWindow) {
      var iIndex = display.indexOf(targetSymbol);
      document.getElementById("building").innerHTML = officeName + display.substring(0, iIndex) + "<span>*</span>" + display.slice(iIndex + targetSymbol.length);
      document.getElementById("location-input").remove();
      document.getElementById("jason-negative").remove();
      document.getElementById("secured-wolf").innerHTML = "Bourne: <em>\"I found the <strong>\"vertical bar\"</strong>. We'll meet you at the scrapyard.\"</em>";
    }
    else if (attempt < 2 && (targetRow !== actualFloor || targetColumn !== actualWindow)) {
      // if not foundl
      document.getElementById("jason-negative").innerHTML = "Bourne: <em>\"" + jasonAsks[attempt] + "\"</em>";
      attempt++;
    }
    else if (attempt === 2 && (targetRow !== actualFloor || targetColumn !== actualWindow)) {
      // if attempt's over
      document.getElementById("location-input").remove();
      document.getElementById("jason-negative").innerHTML = "Bourne: <em>\"" + jasonAsks[attempt] + "\"</em>";

      var pCountdown = document.createElement("p");
      pCountdown.setAttribute("id", "countdown-restart");

      var response = document.getElementById("response");
      response.insertBefore(pCountdown, response.childNodes[0]);

      var countdownRestart = document.getElementById("countdown-restart");
      countdownRestart.innerHTML = "&nbsp";

      var secondsLeft = 4;
      var interval = setInterval(function() {
        document.getElementById("countdown-restart").innerHTML = "Game restarts in: " + --secondsLeft;

        if (secondsLeft < 0) {
          clearInterval(interval);
          window.location.reload(true);
        }
      }, 1000);
    }
  }
}