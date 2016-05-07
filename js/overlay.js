
// Zan Armstrong - May, 2015
// parts of the code adapted from Mike Bostock's Lambert Azimuthal Equal Area http://bl.ocks.org/mbostock/3757101
"use strict";

// set up variables
var 
  largeWidth = 280,
  largeHeight = 280;

var margin = {
  top: 0
}

var padding = 5;
var transitionDuration = 800;

// to hold land and border data
var land;
var borders;
var stateborder;
var basemap;
var targetmap;
var baseid;
var targetid;

// land colors
var colors = ["#EEEAE2", "#FFA500"]

// define state, with default values
var state = {
  scale: 700,
  area : 500000,
  latLon: [{
    lat: 6.52865,
    lon: 20.3586336
  }, {
    lat: 48.2392291,
    lon: -98.9443219
  }]
}

// use hash fragment from URl to set state
// if (window.location.hash.split("&").length != 0) {
//   var windowState = window.location.hash.split("&");
//   for (var i = 0; i < windowState.length; i++) {
//     var k = windowState[i].replace('#', '').split('=');
//     if (k[0] == "scale") {
//       state.scale = +k[1];
//     } else if (k[0] == "center0") {
//       state.latLon[0] = {
//         lat: k[1].split(",")[0],
//         lon: k[1].split(",")[1]
//       };
//     } else if (k[0] == "center1") {
//       state.latLon[1] = {
//         lat: k[1].split(",")[0],
//         lon: k[1].split(",")[1]
//       };
//     }
//   }
// }

var zoomRange = [100, 800]

// define canvas object and context for large canvas
var largeCanvasObj = d3.select("#large").append("canvas")
  .attr("width", largeWidth)
  .attr("height", largeHeight)

var largeCanvasContext = largeCanvasObj.node().getContext("2d")
largeCanvasContext.globalAlpha = .9

var graticule = d3.geo.graticule()()

var mapObjects = []
var largeMapObjects = []

// set up ranges/scales
var zoomToBoxScale = d3.scale.log().domain([17098242, 50]).range([100,600]);


function slided(d) {
  var duration = 0;
  //updateCenterBoxSize(zoomToBoxScale(state.scale), zoomToBoxScale(d3.select(this).property("value")), duration)

  state.scale = d3.select(this).property("value");
  updateLargeScaleOnly();

  updateHash()
}

function updateLargeScaleOnly() {
  (function transition() {
    d3.select("#large").select("canvas")
      .transition()
      .duration(0)
      .tween("d", scaleTween)
  })()
}
// set up initial visable state
for (var i = 0; i < 2; i++) {
  largeMapObjects[i] = setUpLargeMaps(state.latLon[i].lat, state.latLon[i].lon, i)

}

function setUpLargeMaps(lat, lon, name) {
  var projectionLarge = d3.geo.azimuthalEqualArea()
    .translate([largeWidth / 2, largeHeight / 2])
    // .scale(state.scale)
    .scale(state.scale)
    .center([0, 0])
    .clipAngle(180 - 1e-3)
    .clipExtent([
      [2 * padding, 2 * padding],
      [largeWidth - 2 * padding, largeHeight - 2 * padding]
    ])
    .rotate([-lon, -lat])
    .precision(.7);

  var path = d3.geo.path()
    .projection(projectionLarge)
    .context(largeCanvasContext);

  largeCanvasObj.call(dragSetupLarge())

  return {
    "projection": projectionLarge,
    "path": path,
  }
}

// what to draw on the canvas for large/small
var drawCanvasLarge = function() {
  largeCanvasContext.clearRect(0, 0, largeWidth, largeHeight);
  largeCanvasContext.strokeStyle = "#333", largeCanvasContext.lineWidth = 1, largeCanvasContext.strokeRect(2 * padding, 2 * padding, largeWidth - 4 * padding, largeHeight - 4 * padding);
  largeCanvasContext.fillStyle = "#b2d0d0", largeCanvasContext.fillRect(2 * padding, 2 * padding, largeWidth - 4 * padding, largeHeight - 4 * padding);

  largeCanvasContext.fillStyle = colors[0], largeCanvasContext.beginPath(), largeMapObjects[0].path(basemap), largeCanvasContext.fill();
  largeCanvasContext.strokeStyle = "black", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[0].path(basemap), largeCanvasContext.stroke();
  largeCanvasContext.fillStyle = colors[1], largeCanvasContext.beginPath(), largeMapObjects[1].path(targetmap), largeCanvasContext.fill();
  largeCanvasContext.strokeStyle = "#4C3100", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[1].path(targetmap), largeCanvasContext.stroke();
  largeCanvasContext.strokeStyle = "gray", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[0].path(stateborder), largeCanvasContext.stroke();
  
}

var topoid;
function drawfromarticle(matchObject, center_lat,center_lon, userarea, this_country_lat, this_country_lon, this_country_area, scale,topoid,topoidState) {
  topoidState = 53073;
  console.log(matchObject, center_lat,center_lon, userarea, this_country_lat, this_country_lon, this_country_area, scale);
  state.latLon[0] = {
          lat: center_lat,
          lon: center_lon
      }
  state.latLon[1] = {
        lat: this_country_lat,
        lon: this_country_lon
    }

  if (topoid != '') {
       d3.json(chrome.extension.getURL("topofile/us.json"), function(error, world) {
      stateborder = topojson.feature(world, world.objects.states);  
      })

    d3.json(chrome.extension.getURL("topofile/world-110m.json"), function(error, world) {
      // land = topojson.feature(world, world.objects.land);
      // borders = topojson.mesh(world, world.objects.countries);
      baseid = d3.set([840]);
      if (topoid == 156) {
        baseid = d3.set([643]);
      }
      console.log(topoid);
      targetid = d3.set([topoid]);
      console.log(baseid,targetid);
      basemap = topojson.merge(world, world.objects.countries.geometries.filter(function(d) { return baseid.has(d.id); }));
      targetmap = topojson.merge(world, world.objects.countries.geometries.filter(function(d) { return targetid.has(d.id); }));
      
      largeCanvasContext.clearRect(0, 0, largeWidth, largeHeight);
      largeCanvasContext.strokeStyle = "#333", largeCanvasContext.lineWidth = 1, largeCanvasContext.strokeRect(2 * padding, 2 * padding, largeWidth - 4 * padding, largeHeight - 4 * padding);
      largeCanvasContext.fillStyle = "#b2d0d0", largeCanvasContext.fillRect(2 * padding, 2 * padding, largeWidth - 4 * padding, largeHeight - 4 * padding);

      largeCanvasContext.fillStyle = colors[0], largeCanvasContext.beginPath(), largeMapObjects[0].path(basemap), largeCanvasContext.fill();
      largeCanvasContext.strokeStyle = "black", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[0].path(basemap), largeCanvasContext.stroke();
      largeCanvasContext.fillStyle = colors[1], largeCanvasContext.beginPath(), largeMapObjects[1].path(targetmap), largeCanvasContext.fill();
      largeCanvasContext.strokeStyle = "#4C3100", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[1].path(targetmap), largeCanvasContext.stroke();
      largeCanvasContext.strokeStyle = "gray", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[0].path(stateborder), largeCanvasContext.stroke();

    })
  } else {
     d3.json("us.json", function(error, world) {
      baseid = d3.set([840]);
      console.log(topoidState);
      targetid = d3.set([topoidState]);
      basemap = topojson.merge(world, world.objects.counties.geometries.filter(function(d) { return baseid.has(d.id); }));
      targetmap = topojson.merge(world, world.objects.counties.geometries.filter(function(d) { return targetid.has(d.id); }));
      largeCanvasContext.clearRect(0, 0, largeWidth, largeHeight);
      largeCanvasContext.strokeStyle = "#333", largeCanvasContext.lineWidth = 1, largeCanvasContext.strokeRect(2 * padding, 2 * padding, largeWidth - 4 * padding, largeHeight - 4 * padding);
      largeCanvasContext.fillStyle = "#b2d0d0", largeCanvasContext.fillRect(2 * padding, 2 * padding, largeWidth - 4 * padding, largeHeight - 4 * padding);

      largeCanvasContext.fillStyle = colors[0], largeCanvasContext.beginPath(), largeMapObjects[0].path(basemap), largeCanvasContext.fill();
      largeCanvasContext.strokeStyle = "black", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[0].path(basemap), largeCanvasContext.stroke();
      largeCanvasContext.fillStyle = colors[1], largeCanvasContext.beginPath(), largeMapObjects[1].path(targetmap), largeCanvasContext.fill();
      largeCanvasContext.strokeStyle = "#4C3100", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[1].path(targetmap), largeCanvasContext.stroke();
      largeCanvasContext.strokeStyle = "gray", largeCanvasContext.lineWidth = .5, largeCanvasContext.beginPath(), largeMapObjects[0].path(stateborder), largeCanvasContext.stroke();
      })

  }

  state.scale = this_country_area;
  rotateAndScale()
  updateHash()

}

// update large & small smallContext, based on update function (either rotationAndScaleTween or rotationTween)
function rotateAndScale() {
  (function transition() {
    d3.select("#large").select("canvas")
      .transition()
      .duration(transitionDuration)
      .tween("d", rotationAndScaleTween)
  })()
}

function rotationAndScaleTween() {
  var r1 = d3.interpolate(largeMapObjects[0].projection.rotate(), [-state.latLon[0].lon, -state.latLon[0].lat]);
  var r2 = d3.interpolate(largeMapObjects[1].projection.rotate(), [-state.latLon[1].lon, -state.latLon[1].lat]);
  // var interpolateScale = d3.interpolate(largeMapObjects[0].projection.scale(), state.scale);
  var interpolateScale = d3.interpolate(zoomToBoxScale(largeMapObjects[0].projection.scale()), zoomToBoxScale(largeMapObjects[1].projection.scale()))

  return function(t) {
    // update rotation
    largeMapObjects[0].projection.rotate(r1(t));
    largeMapObjects[1].projection.rotate(r2(t));

    // update scale
    largeMapObjects[0].projection.scale(interpolateScale(t));
    largeMapObjects[1].projection.scale(interpolateScale(t));

    drawCanvasLarge()
  };
}

// update functions
var updateHash = function() {
  // window.location.hash = "scale=" + state.scale + "&center0=" + state.latLon[0].lat + "," + state.latLon[0].lon + "&center1=" + state.latLon[1].lat + "," + state.latLon[1].lon;
  // slider.property("value", state.scale)
}

// DRAG
function dragSetupSmall(name) {
  function resetDrag() {
    dragDistance = {
      x: 0,
      y: 0
    };
  }

  var dragDistance = {
    x: 0,
    y: 0
  };

  return d3.behavior.drag()
    .on("dragstart", function() {
      d3.event.sourceEvent.preventDefault();
    })
    .on("drag", function() {
      dragDistance.x = dragDistance.x + d3.event.dx;
      dragDistance.y = dragDistance.y + d3.event.dy;
      resetDrag()
    })
    .on("dragend", function() {
      resetDrag()
    })
}

function dragSetupLarge() {

  function resetDrag() {
    dragDistance = {
      x: 0,
      y: 0
    };
  }

  var dragDistance = {
    x: 0,
    y: 0
  };

  return d3.behavior.drag()
    .on("dragstart", function() {
      d3.event.sourceEvent.preventDefault();
    })
    .on("drag", function() {
      dragDistance.x = dragDistance.x + d3.event.dx;
      dragDistance.y = dragDistance.y + d3.event.dy;
      updateRotateFromLargeDrag(dragDistance)
      resetDrag()
    })
    .on("dragend", function() {
      updateRotateFromLargeDrag(dragDistance)
      resetDrag()
    });
}

function updateRotateFromLargeDrag(pixelDifference) {
  var newRotate0 = pixelDiff_to_rotation_large(largeMapObjects[0].projection, pixelDifference)
  var newRotate1 = pixelDiff_to_rotation_large(largeMapObjects[1].projection, pixelDifference)

  // set new rotate
  // mapObjects[0].projection.rotate(newRotate0)
  // mapObjects[1].projection.rotate(newRotate1)
  largeMapObjects[0].projection.rotate(newRotate0)
  largeMapObjects[1].projection.rotate(newRotate1)
  updateStateRotation(newRotate0, 0)
  updateStateRotation(newRotate1, 1)

  updateRotationFromLargePan(name)
}

function pixelDiff_to_rotation_small(projection, pxDiff) {
  var k = projection.rotate()
  return ([k[0] + pxDiff.x / 136 * 90, k[1] - pxDiff.y, k[2]])
}

function pixelDiff_to_rotation_large(projection, pxDiff) {
  var k = projection.invert([largeWidth / 2 - pxDiff.x, largeHeight / 2 - pxDiff.y])
  return [-k[0], -k[1], 0]
}

function updateStateRotation(rotateCoord, name) {
  state.latLon[name] = {
    lon: rotateCoord[0],
    lat: rotateCoord[1]
  }
  updateHash()
}


function scaleTween() {
  // var interpolateScale = d3.interpolate(largeMapObjects[0].projection.scale(), state.scale);
  var interpolateScale = d3.interpolate(zoomToBoxScale(largeMapObjects[0].projection.scale()), zoomToBoxScale(largeMapObjects[1].projection.scale()))
  var halfSideTween = d3.interpolate(zoomToBoxScale(largeMapObjects[0].projection.scale()), zoomToBoxScale(largeMapObjects[1].projection.scale()))

  return function(t) {
    // update scale for large projections
    largeMapObjects[0].projection.scale(interpolateScale(t));
    largeMapObjects[1].projection.scale(interpolateScale(t));

    // and redraw large
    drawCanvasLarge()

  };
}

function updateRotationFromLargePan() {
  // drawCanvasSmall(0)
  // addBoxSmall(0, zoomToBoxScale(largeMapObjects[0].projection.scale()))
  // drawCanvasSmall(1)
  // addBoxSmall(1, zoomToBoxScale(largeMapObjects[1].projection.scale()))
  drawCanvasLarge()
}
