min_year = 1930;
max_year = 2018;
years = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018];

// set up the slider
var slider = d3.slider()
  .min(min_year)
  .max(max_year)
  .tickValues(years)
  .stepValues(years)
  .tickFormat(d3.format("d"))
  .value(max_year)
  .callback(function(event) {
    var year = String(self.slider.value());
    uncolor_map();
    color_countries(worldcup_data, year);
    create_country_list(worldcup_data, year);
  });

// render the slider
d3.select('.slider').call(slider);

$(".slider-button").click(function() {
  time_travel(0);
});

// update the slider based on year, and then the slider will color the map accordingly
function time_travel(index) {
  $(".slider-button").prop("disabled", true);
  setTimeout(function() {
    var year = years[index];
    slider.setValue(year);
    if (year < max_year) {
      time_travel(++index);
    } else {
      $(".slider-button").prop("disabled", false);
    }
  }, 180);
};