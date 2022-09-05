import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/WebGLTile';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';

proj4.defs(
  'EPSG:2193',
  '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
);
register(proj4);

// URL to COG tile
const urls = [
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/HM_COG.tif',
  'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/HN_COG.tif',
];

function getSourceURLs(urls) {
  var urlArray = [];
  urls.forEach((address) =>
    urlArray.push(
      new GeoTIFF({
        sources: [
          {
            url: address,
            tileSize: 256,
          },
        ],
        convertToRGB: true,
        interpolate: false,
      })
    )
  );
  return urlArray;
}

const source = new GeoTIFF({
  sources: [
    {
      url:
        'https://tile-service-raster.s3.us-east-1.amazonaws.com/cogs/as-raster-tile/HM_COG.tif',
    },
  ],
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new TileLayer({
      //source: source,
      crossOrigin: 'anonymous',
      sources: getSourceURLs(urls),
    }),
  ],
  view: source.getView().then(function (options) {
    return {
      projection: options.projection,
      center: options.center,
      resolution: options.resolutions[options.zoom],
    };
  }),
});
