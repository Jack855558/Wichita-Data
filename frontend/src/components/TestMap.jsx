import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TestMap.css';

const TestMap = () => {
    window.L = L;
    const [mapHTML, setMapHTML] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const mapInitialized = useRef(false);

    useEffect(() => {
        axios.get('https://wichita-data-1.onrender.com/map')
            .then((response) => setMapHTML(response.data))
            .catch((error) => console.error('Error fetching map:', error));
    }, []);

    useEffect(() => {
        if (containerRef.current && mapHTML) {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(mapHTML, 'text/html');

            const styles = htmlDoc.querySelectorAll('style, link');
            styles.forEach(style => {
                document.head.appendChild(style.cloneNode(true));
            });

            const mapContainer = htmlDoc.getElementById('map');
            if (mapContainer) {
                containerRef.current.innerHTML = mapContainer.innerHTML;
            }

            setTimeout(() => {
                if (!mapInitialized.current) {
                    console.log('Initializing map with Wichita coordinates');

                    if (mapRef.current) {
                        mapRef.current.remove();
                    }

                    const southWest = L.latLng(37.5372, -97.5301);
                    const northEast = L.latLng(37.8372, -97.1301);
                    const wichitaBounds = L.latLngBounds(southWest, northEast);
                    const wichitaCoords = [37.6872, -97.3301];

                    mapRef.current = L.map(containerRef.current, {
                        center: wichitaCoords,
                        zoom: 12,
                        maxBounds: wichitaBounds,
                        maxBoundsViscosity: 1.0,
                        minZoom: 11
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(mapRef.current);

                    L.rectangle(wichitaBounds, {
                        color: "#ff7800",
                        weight: 1,
                        fillOpacity: 0.05
                    }).addTo(mapRef.current);

                    mapInitialized.current = true;
                }
            }, 100);
        }
    }, [mapHTML]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://wichita-data-1.onrender.com/check-locations', {
                start: input1,
                end: input2
            });

            if (response.data.success) {
                const { start, end } = response.data;
                console.log("Start location:", start);
                console.log("End location:", end);

                // You can now use start.lat, start.lon, etc.
            }
        } catch (error) {
            console.error('Error validating locations:', error);
            alert("Failed to geocode one or both locations. Please check your input.");
        }
    };

    return (
        <div className="folium-map-container">
            <div className="form-overlay">
                <form onSubmit={handleSubmit} className="input-group">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Start Location:"
                        value={input1}
                        onChange={(e) => setInput1(e.target.value)}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Going to:"
                        value={input2}
                        onChange={(e) => setInput2(e.target.value)}
                    />
                    <button type="submit" className="submit-button">
                        Search
                    </button>
                </form>
            </div>

            <div
                ref={containerRef}
                id="map"
                className="map-container"
            />
        </div>
    );
};

export default TestMap;