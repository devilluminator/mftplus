"use client";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import React, { useEffect } from "react";
type LocationProps = {
  lat: number;
  lng: number;
};
function Location(props: LocationProps) {
  useEffect(() => {
    const iconFeature = new Feature({
      geometry: new Point(
        fromLonLat([
          props.lng || Number(localStorage.getItem("lng")),
          props.lat || Number(localStorage.getItem("lat")),
        ]),
      ), // Longitude, Latitude
    });
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: "/location.webp", // URL to your icon image
      }),
    });
    iconFeature.setStyle(iconStyle);
    const vectorSource = new VectorSource({ features: [iconFeature] });
    const vectorLayer = new VectorLayer({ source: vectorSource });
    const map = new Map({
      target: "map",
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: fromLonLat([
          props.lng || Number(localStorage.getItem("lng")),
          props.lat || Number(localStorage.getItem("lat")),
        ]),
        zoom: 15,
      }),
    });

    return () => map.setTarget(undefined);
  }, [props.lat, props.lng]);
  return (
    <div
      id='map'
      className='border rounded-md w-full h-[270px] md:h-[420px] overflow-clip'></div>
  );
}

export default Location;
