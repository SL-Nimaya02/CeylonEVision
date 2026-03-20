/**
 * CeylonEVision: Geospatial Visualization Interface (Map Engine)
 * 
 * this component orchestrates the Leaflet-based map rendering. It manages:
 * 1. Spatial Context: Center points and zoom levels for Sri Lanka.
 * 2. Real-time Routing: Integrates with OSRM (Open Source Routing Machine) 
 *    to visualize the optimal path from user origin to station destination.
 * 3. Point-of-Interest (POI) Rendering: Displays candidate charging stations.
 */

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBounds } from 'leaflet';

// Leaflet Dependency Patch: Resolves asset path issues for default marker sprites
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MapMapProps {
    userPosition: [number, number] | null;
    destination?: [number, number] | null;
}

/**
 * Component: LocationController
 * Dynamically shifts the map focus (camera) when user origin changes.
 */
const LocationController: React.FC<{ userPosition: [number, number] | null; destination?: [number, number] | null }> = ({ userPosition, destination }) => {
    const map = useMap();
    useEffect(() => {
        if (userPosition && !destination) {
            map.flyTo(userPosition, 13);
        }
    }, [userPosition, destination, map]);
    return null;
};

/**
 * Component: RoutingController
 * Interfaces with the OSRM Routing API to fetch and render the geometry 
 * between the current GPS coordinate and the selected AI station.
 */
const RoutingController: React.FC<{ userPosition: [number, number] | null; destination?: [number, number] | null }> = ({ userPosition, destination }) => {
    const map = useMap();
    const [routePath, setRoutePath] = useState<[number, number][]>([]);

    useEffect(() => {
        if (!userPosition || !destination) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRoutePath([]);
            return;
        }

        const fetchRoute = async () => {
            try {
                // Coordinates Transformation: OSRM uses [Lon, Lat]
                const start = `${userPosition[1]},${userPosition[0]}`;
                const end = `${destination[1]},${destination[0]}`;
                const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates;
                    // Transform geometry back to [Lat, Lon] for Leaflet rendering
                    const latLngs: [number, number][] = coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
                    setRoutePath(latLngs);

                    // Dynamic Bounds Fitting: Ensures both start and end are visible
                    const bounds = new LatLngBounds(userPosition, destination);
                    latLngs.forEach(pt => bounds.extend(pt));
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            } catch (error) {
                console.error("OSRM Failure:", error);
            }
        };

        fetchRoute();
    }, [userPosition, destination, map]);

    return routePath.length > 0 ? (
        <Polyline positions={routePath} color="#2563eb" weight={6} opacity={1.0} />
    ) : null;
};

export const MapMap: React.FC<MapMapProps> = ({ userPosition, destination }) => {
    // Default Analytical Center Header: Colombo, Sri Lanka
    const colomboPosition: [number, number] = [6.9271, 79.8612];

    const stations = [
        { id: 1, name: "Fast Charge Colombo", pos: [6.9271, 79.8612], status: 'green' },
        { id: 2, name: "Galle Face Green Station", pos: [6.9310, 79.8450], status: 'yellow' },
        { id: 3, name: "Cinnamon Gardens Point", pos: [6.9150, 79.8650], status: 'red' },
    ];

    return (
        <div className="w-full h-full z-0 relative">
            <MapContainer center={colomboPosition} zoom={13} scrollWheelZoom={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationController userPosition={userPosition} destination={destination} />
                <RoutingController userPosition={userPosition} destination={destination} />

                {/* User Origin Marker */}
                {userPosition && (
                    <Marker position={userPosition}>
                        <Popup>Detected Origin</Popup>
                    </Marker>
                )}

                {/* AI-Selected Destination Marker */}
                {destination && (
                    <Marker position={destination}>
                        <Popup>AI Optimal Target</Popup>
                    </Marker>
                )}

                {/* Candidate Search Space */}
                {stations.map(st => (
                    <Marker key={st.id} position={st.pos as [number, number]}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-gray-900">{st.name}</h3>
                                <p className={`text-xs font-semibold uppercase ${st.status === 'green' ? 'text-emerald-600' :
                                    st.status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    Status: {st.status === 'green' ? 'Available' : st.status === 'yellow' ? 'Busy' : 'Full'}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
