import { useState, useMemo, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Leaflet custom marker icon (using unpkg CDN assets for absolute reliability in Vite)
const leafIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Leaflet View Change controller component
function LeafletChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Google Maps premium dark mode styles
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#111827" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#111827" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fbbf24" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fbbf24" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#065f46" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#34d399" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1f2937" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#042f2e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0d9488" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2dd4bf" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#030712" }],
  },
];

function TripMap({ pins = [] }) {
  const [selectedGooglePin, setSelectedGooglePin] = useState(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  // Parse pins coordinates safely
  const validPins = useMemo(() => {
    return pins
      .map((pin) => ({
        ...pin,
        lat: parseFloat(pin.lat),
        lng: parseFloat(pin.lng),
      }))
      .filter((pin) => !isNaN(pin.lat) && !isNaN(pin.lng));
  }, [pins]);

  // Center coordinate - Leaflet Array format
  const centerArray = useMemo(() => {
    if (validPins.length > 0) {
      return [
        validPins.reduce((sum, p) => sum + p.lat, 0) / validPins.length,
        validPins.reduce((sum, p) => sum + p.lng, 0) / validPins.length,
      ];
    }
    return [22.9734, 78.6569];
  }, [validPins]);

  // Center coordinate - Google Map Object format
  const centerObject = useMemo(() => ({
    lat: centerArray[0],
    lng: centerArray[1],
  }), [centerArray]);

  const zoom = validPins.length > 0 ? 11 : 5;

  // Only load Google Map JS scripts if API key is present
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  const hasGoogleKey = googleMapsApiKey && googleMapsApiKey.trim() !== "";

  // ENGINE 1: Google Maps (If API Key is provided)
  if (hasGoogleKey && isLoaded && !loadError) {
    return (
      <div className="h-[400px] w-full relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-4 right-4 z-[99] bg-gray-950/80 border border-teal-500/20 text-teal-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md">
          Google Maps Premium
        </div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerObject}
          zoom={zoom}
          options={{
            styles: darkMapStyle,
            disableDefaultUI: false,
            zoomControl: true,
          }}
        >
          {validPins.map((pin, idx) => (
            <MarkerF
              key={idx}
              position={{ lat: pin.lat, lng: pin.lng }}
              onClick={() => setSelectedGooglePin(pin)}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: "#fbbf24", // Amber dot marker
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#ffffff",
                scale: 1.5,
                anchor: { x: 12, y: 24 }
              }}
            />
          ))}

          {selectedGooglePin && (
            <InfoWindowF
              position={{ lat: selectedGooglePin.lat, lng: selectedGooglePin.lng }}
              onCloseClick={() => setSelectedGooglePin(null)}
            >
              <div className="p-1 text-gray-900 max-w-[200px] text-left">
                <span className="inline-block bg-teal-100 text-teal-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                  Day {selectedGooglePin.day || 1}
                </span>
                <h4 className="font-bold text-xs">{selectedGooglePin.name}</h4>
                <p className="text-[10px] text-gray-600 mt-1 leading-tight">{selectedGooglePin.description}</p>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>
    );
  }

  // ENGINE 2: Leaflet Fallback (If key is missing, defaults to 100% Free OpenStreetMap)
  return (
    <div className="h-[400px] w-full relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="absolute top-4 right-4 z-[99] bg-gray-950/80 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md">
        OpenStreetMap Free Tier
      </div>
      <MapContainer
        center={centerArray}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="h-full w-full"
      >
        <LeafletChangeView center={centerArray} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPins.map((pin, idx) => (
          <Marker key={idx} position={[pin.lat, pin.lng]} icon={leafIcon}>
            <Popup>
              <div className="p-1 text-gray-900 text-left">
                <span className="inline-block bg-teal-150 text-teal-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                  Day {pin.day || 1}
                </span>
                <h4 className="font-bold text-xs">{pin.name}</h4>
                <p className="text-[10px] text-gray-600 mt-1 leading-tight">{pin.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default TripMap;
