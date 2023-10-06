import { Marker, Popup, useMap } from "react-leaflet";
import icon from "./icon";
import { useEffect } from "react";

const MarkerPosition = ({address}) => {
  const position = [address.latitude, address.longitude]
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true
    })
  }, [map, position])
  return (
    <>
      <Marker
        position={position}
        icon={icon}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
};

export default MarkerPosition;
