# Map Of The World Cup

Check it out at [junsooshin.github.io/worldcupmap](junsooshin.github.io/worldcupmap)

By Derek Shin

August 2018

* * *

#### Data sources
- **World geojson data** from (https://geojson-maps.ash.ms) and selected medium resolution and all regions, which resulted in '50m.geo.json'.
- **UK geojson data** from (https://gadm.org/download_country_v3.html), imported 'gadm36_GBR_1.shp' and 'gadm36_GBR_1.dbf' files
into (http://mapshaper.org), used 'detect line intersections' and 'snap vertices' options, and simplified using 'Visvalingam / weighted area' method
to 0.08% to match the border details of the world geojson data. All of that resulted in 'gadm36_GBR_1.json'.
- **List of countries** that participated in the FIFA World Cup was gathered manually from Wikipedia. (Countries that qualified but withdrew were not used).

* * *

#### Modifications to the data
- I had to split up the United Kingdom because the countries of the United Kingdom compete separately in the FIFA World Cup.
- On the '50m.geo.json', I deleted the feature for the United Kingdom and added the features from 'gadm36_GBR_1.json', which represents
England, Northern Ireland, Scotland and Wales.
- Lastly, I changed the name attribute for those four countries from 'NAME_1' to 'name' in order to match the name attribute for the other countries.

- On the '50m.geo.json', I changed the name of:
  "Korea" to "South Korea",
  "Dem. Rep. Korea" to "North Korea",
  "Bosnia and Herz." to "Bosnia and Herzegovina",
  "Côte d'Ivoire" to "Ivory Coast"
  "Czech Rep." to "Czech Republic".

* * *

#### How I dealt with the "old countries"
- For the 2006 World Cup, Serbia and Montenegro are colored, separately, for Serbia and Montenegro.
- Until the 1994 World Cup, Yugoslavia includes Bosnia and Herzegovina, Croatia, Kosovo, Macedonia, Montenegro, Serbia and Slovenia.
- For the 1994 World Cup, Yugoslavia includes Serbia and Montenegro.
- Soviet Union includes Armenia, Azerbaijan, Belarus, Estonia, Georgia, Kazakhstan, Kyrgyzstan, Latvia, Lithuania, Moldova, Russia, Tajikistan, Turkmenistan, Ukraine and Uzbekistan.
- Czechoslovakia includes Czech Republic and Slovakia.
- Germany is colored for both East Germany and West Germany.
- For the 1974 World Cup, Congo is colored for Zaire.
- For the 1938 World Cup, Indonesia is colored for Dutch East Indies.

* * *

#### Other sources that helped immensely
- [Andy Barefoot's Making a map using D3.js](https://medium.com/@andybarefoot/making-a-map-using-d3-js-8aa3637304ee)
- [Download vector maps](https://geojson-maps.ash.ms/)
- [Richard Zimenman's How to convert and prepare TopoJSON files for interactive mapping with d3](https://hackernoon.com/how-to-convert-and-prepare-topojson-files-for-interactive-mapping-with-d3-499cf0ced5f)
- [Mapshaper](http://mapshaper.org/)
- [Individual countries' shapefiles](https://gadm.org/download_country_v3.html)
- [Projection explorer](https://bl.ocks.org/d3indepth/f7ece0ab9a3df06a8cecd2c0e33e54ef)
- [D3.slider](http://sujeetsr.github.io/d3.slider/)
- [Simple d3.js tooltips](http://bl.ocks.org/d3noob/a22c42db65eb00d4e369)

* * *

#### Updating code on 'd3.slider.js' library from d3 v3 to d3 v4
- 'd3.scale.linear()' was changed to 'd3.scaleLinear()'.
- 'd3.svg.axis().scale().orient()' was changed to 'd3.axisBottom()'.
- 'd3.behavior.drag()' was changed to 'd3.drag()'.

* * *

#### Features
- **Timeline Map** shows the countries that participated in the FIFA World Cup from 1930 to 2018.

* * *

#### Features to come
- **Aggregate Map** will show a map that colors countries based on their numbers of participations.
- **Analysis** will list the findings from looking at the maps.