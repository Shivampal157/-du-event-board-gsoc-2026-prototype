import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function hasCoords(e) {
  return (
    typeof e.lat === "number" &&
    typeof e.lng === "number" &&
    e.lat >= -90 &&
    e.lat <= 90 &&
    e.lng >= -180 &&
    e.lng <= 180
  );
}

export default function EventMap({ events }) {
  const withCoords = events.filter(hasCoords);
  const center =
    withCoords.length > 0
      ? [withCoords[0].lat, withCoords[0].lng]
      : [20, 0];

  if (withCoords.length === 0) {
    return (
      <div className="panel panel--empty">
        <p>
          <strong>Nothing to put on the map.</strong> These filtered events
          don&apos;t have lat/lng. Upstream you&apos;d get coords from YAML or
          geocoding when it makes sense.
        </p>
      </div>
    );
  }

  return (
    <div className="map-wrap">
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((e) => (
          <CircleMarker
            key={e.id}
            center={[e.lat, e.lng]}
            radius={10}
            pathOptions={{
              color: "#5b21b6",
              fillColor: "#7c3aed",
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <strong>{e.title}</strong>
              <br />
              <small>{e.org_name}</small>
              <br />
              {e.end_date && e.end_date !== e.date
                ? `${e.date} → ${e.end_date}`
                : e.date}{" "}
              · {e.event_type} · {e.cost}
              {e.url && (
                <>
                  <br />
                  <a href={e.url} target="_blank" rel="noreferrer">
                    Link
                  </a>
                </>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="map-caption">
        Leaflet + OpenStreetMap tiles (no API key). Same idea as the real board.
      </p>
    </div>
  );
}
