/*******************************/
/*       Map preparation       */
/*******************************/

var width  = $(window).width() * 0.75,
    height = width / 1.75;

var projection = d3.geoMercator()
  .translate( [width / 2, height / 2] )
  .center([0, 30])  // center more north
  .rotate([-11, 0]) // connect Russia
  .scale([width / (2 * Math.PI)]);

var path = d3.geoPath()
  .projection(projection);

var zoom = d3.zoom()
  .scaleExtent([1, 15])                       // limits zooming and panning
  .translateExtent([[0,0], [width, height]])  // limits the moving around of the map
  .on("zoom", zoomed);

var svg = d3.select(".map-container").append("svg")
  .attr("id", "svg-map")
  .attr("width", width)
  .attr("height", height)
  .call(zoom);

g = svg.append("g");

function zoomed() {
  g.attr("transform", d3.event.transform);
};

/*******************************/
/*         Store data          */
/*******************************/

var map_data = (function () {
  var result = null;
  $.ajax({
    'async': false,
    'url': "data/map/50m.geo.json",
    'dataType': "json",
    'success': function (data) {
      result = data;
    }
  });
  return result;
})();

// create { year_1: [country_1, country_2, ...],
//          year_2: [country_1, country_2, ...],
//          ... }
var worldcup_data = (function () {
  var result = {};
  $.ajax({
    'async': false,
    'url': "data/worldcup/country_data.txt",
    'dataType': "text",
    'success': function (data) {
      var arr = data.split("\n");
      for (var row of arr) {
        var split_row = row.split(",");
        var year = split_row[0];
        var country = split_row[1];
        if (result.hasOwnProperty(year)) {
          result[year].push(country);
        } else {
          result[year] = [country];
        }
      }
    }
  });
  return result;
})();

var old_countries_dict = {
  "Serbia and Montenegro": ["Serbia", "Montenegro"],
  "Soviet Union": ["Armenia", "Azerbaijan", "Belarus", "Estonia", "Georgia", "Kazakhstan", "Kyrgyzstan",
                   "Latvia", "Lithuania", "Moldova", "Russia", "Tajikistan", "Turkmenistan", "Ukraine", "Uzbekistan"],
  "Yugoslavia": {
    "Pre1994": ["Bosnia and Herzegovina", "Croatia", "Kosovo", "Montenegro", "Macedonia", "Serbia", "Slovenia"],
    "Post1994": ["Serbia", "Montenegro"]
    },
  "Czechoslovakia": ["Czech Republic", "Slovakia"],
  "West Germany": ["Germany"],
  "East Germany": ["Germany"],
  "Zaire": ["Congo"],
  "Dutch East Indies": ["Indonesia"],
};

// return an array of old countries for an old country
function get_old_countries(country_name, year) {
  if ((country_name == "Yugoslavia") && (year < 1994)) {
    return old_countries_dict["Yugoslavia"]["Pre1994"];
  } else if ((country_name == "Yugoslavia") && (year >= 1994)) {
    return old_countries_dict["Yugoslavia"]["Post1994"];
  } else {
    return old_countries_dict[country_name];
  }
};

/*******************************/
/*     Tooltip in the map      */
/*******************************/

// Define the div for the tooltip
var tooltip = d3.select(".map-container")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function set_tooltip(map_data) {
  var leftPx = Math.min(d3.event.pageX, $("#svg-map").position().left + $("#svg-map").width() - $(".tooltip").width() - 15);
  var topPx = Math.max(d3.event.pageY, $("#svg-map").position().top + 60);

  tooltip.transition()
    .duration(200)
    .style("opacity", 0.9);
  tooltip.html(map_data.properties.name)
    .style("left", (leftPx) + "px")
    .style("top", (topPx - 28) + "px");
};

function unset_tooltip() {
  tooltip.transition()
    .duration(200)
    .style("opacity", 0);
};

/*******************************/
/*    Functions for the map    */
/*******************************/

// draw the map
function draw_map(map_data) {

  g.selectAll(".country")
    .data(map_data.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("id", function(map_data) {
      return map_data.properties.name.replace(/\s+/g, ''); // country name might have whitespace, and its id should not have one
    })
    .attr("d", path)
    .on("mouseover", function(map_data) {
      d3.select(this).classed("country-on", true);
      set_tooltip(map_data);
    })
    .on("mouseout", function(d) {
      d3.select(this).classed("country-on", false);
      unset_tooltip();
    });

};

// uncolor all countries
function uncolor_map() {
  g.selectAll(".country")
    .classed("country-selected", false);
};

// color the countries that played in the World Cup for the year
function color_countries(worldcup_data, year) {
  if (!worldcup_data.hasOwnProperty(year)) {
    return;
  }

  // get a list of current countries that made up the old countries
  var country_arr = worldcup_data[year].slice();
  var new_country_arr = [];

  for (var country_name of country_arr) {
    if (old_countries_dict.hasOwnProperty(country_name)) {
      new_country_arr = new_country_arr.concat(get_old_countries(country_name, year));
    } else {
      new_country_arr.push(country_name);
    }
  }

  for (var country_name of new_country_arr) {
    var country_name_no_space = country_name.replace(/\s+/g, '');
    g.select("#" + country_name_no_space)
      .classed("country-selected", true);
  }
};

// create a list of the World Cup countries for the year
function create_country_list(worldcup_data, year) {
  if (!worldcup_data.hasOwnProperty(year)) {
    return;
  }

  var country_arr = worldcup_data[year].sort();

  // empty the previous list
  $(".country-list").empty();
  $("#country-list-header").text(year + " World Cup");
  $("#country-list-number").text(country_arr.length + " countries");

  // fill the div with country names
  for (var country_name of country_arr) {

    $(".country-list").append(
      $("<div></div>")
        .attr("class", "country-name")
        .attr("id", country_name.replace(/\s+/g, ''))
        .html(country_name)
        // .on() needs $(this).text() or it uses the last country_name on the list
        .on("mouseover", function(d) {
          // highlight the name
          d3.select(this).classed("country-name-on", true);

          // highlight the country in the map
          var country_name = $(this).text();
          var country_name_no_space = country_name.replace(/\s+/g, '');

          if (old_countries_dict.hasOwnProperty(country_name)) {
            old_countries = get_old_countries(country_name, year);
            for (var old_country_name of old_countries) {
              old_country_name_no_space = old_country_name.replace(/\s+/g, '');
              g.select("#" + old_country_name_no_space)
                .classed("country-on", true);
            }
          } else {
            g.select("#" + country_name_no_space)
              .classed("country-on", true);
          }

        })
        .on("mouseout", function(d) {
          d3.select(this).classed("country-name-on", false);

          var country_name = $(this).text();
          var country_name_no_space = country_name.replace(/\s+/g, '');

          if (old_countries_dict.hasOwnProperty(country_name)) {
            old_countries = get_old_countries(country_name, year);
            for (var old_country_name of old_countries) {
              old_country_name_no_space = old_country_name.replace(/\s+/g, '');
              g.select("#" + old_country_name_no_space)
                .classed("country-on", false);
            }
          } else {
            g.select("#" + country_name_no_space)
              .classed("country-on", false);
          }

        })
    );
  }
};

/*******************************/
/*     Initialize the map      */
/*******************************/

draw_map(map_data);
color_countries(worldcup_data, 2018);
create_country_list(worldcup_data, 2018);
