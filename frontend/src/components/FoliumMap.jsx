import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FoliumMap = () => {
    window.L = L;
    const [mapHTML, setMapHTML] = useState('');
    const mapRef = useRef(null);
    const containerRef = useRef(null);
    const mapInitialized = useRef(false);

    useEffect(() => {
        axios.get('https://wichita-data-1.onrender.com/map')
            .then((response) => setMapHTML(response.data))
            .catch((error) => console.error('Error fetching map:', error));
    }, []);

    // Inject HTML and execute embedded scripts.
    useEffect(() => {
        if (containerRef.current && mapHTML) {
            // Extract only the necessary styles and container divs from the HTML
            // but ignore the script that initializes the map
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(mapHTML, 'text/html');

            // Get the styles
            const styles = htmlDoc.querySelectorAll('style, link');
            styles.forEach(style => {
                document.head.appendChild(style.cloneNode(true));
            });

            // Find the map container and copy its structure
            const mapContainer = htmlDoc.getElementById('map');
            if (mapContainer) {
                containerRef.current.innerHTML = mapContainer.innerHTML;
            }

            // Now initialize our own map with the correct coordinates
            setTimeout(() => {
                if (!mapInitialized.current) {
                    console.log('Initializing map with Wichita coordinates');

                    // First, check if there's any existing map to destroy
                    if (mapRef.current) {
                        mapRef.current.remove();
                    }

                    // Define Wichita city boundaries (approximate)
                    // These coordinates define a rectangular bounding area around Wichita
                    const southWest = L.latLng(37.5372, -97.5301); // SW corner
                    const northEast = L.latLng(37.8372, -97.1301); // NE corner
                    const wichitaBounds = L.latLngBounds(southWest, northEast);

                    // Create a new map with the Wichita coordinates
                    const wichitaCoords = [37.6872, -97.3301]; // Center of Wichita

                    mapRef.current = L.map(containerRef.current, {
                        center: wichitaCoords,
                        zoom: 12,
                        maxBounds: wichitaBounds, // Restrict panning to these bounds
                        maxBoundsViscosity: 1.0, // Makes the bounds completely solid (0 is default and allows some slack)
                        minZoom: 11 // Prevent zooming out too far
                    });

                    // Add the tile layer
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(mapRef.current);

                    // Add a rectangle to visualize the restricted area (optional)
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

    console.log(';)');

    return (
        <div
            ref={containerRef}
            id="map"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default FoliumMap;