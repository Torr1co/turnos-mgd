import React, { useEffect } from "react";
import { type MapContainerProps } from "react-leaflet";
import type LeafletType from "leaflet";
import type * as ReactLeafletType from "react-leaflet";

export interface MapProps extends Omit<MapContainerProps, "children"> {
  width?: number;
  height?: number;
  children: (
    reactLeaflet: typeof ReactLeafletType,
    leaftlet: typeof LeafletType
  ) => React.ReactNode;
}

const Map = ({ children, className, width, height, ...rest }: MapProps) => {
  const [ReactLeaflet, setReactLeaflet] = React.useState<
    typeof ReactLeafletType | null
  >(null);
  const [Leaflet, setLeaflet] = React.useState<typeof LeafletType | null>(null);

  useEffect(() => {
    async function initMap() {
      const Leaflet = await import("leaflet");
      const ReactLeaflet = await import("react-leaflet");

      setReactLeaflet(ReactLeaflet);
      setLeaflet(Leaflet);

      delete Leaflet.Icon.Default.prototype._getIconUrl;
      /* Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "leaflet/images/marker-icon-2x.png",
        iconUrl: "leaflet/images/marker-icon.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
      }); */
    }
    void initMap();
  }, []);

  if (!ReactLeaflet || !Leaflet) {
    return null;
  }

  return (
    <ReactLeaflet.MapContainer className={className} {...rest}>
      {children(ReactLeaflet, Leaflet)}
    </ReactLeaflet.MapContainer>
  );
};

export default Map;
