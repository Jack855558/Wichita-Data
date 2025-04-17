# utils.py
from geopy.geocoders import Nominatim
import osmnx as ox
import certifi
import ssl

ssl_context = ssl.create_default_context(cafile=certifi.where())
geolocator = Nominatim(user_agent='wichita_nav', ssl_context=ssl_context)

def get_nearest_node(G, address):
    location = geolocator.geocode(address, timeout=5)
    if location:
        print(f"Geocoded Address: {address} -> ({location.latitude}, {location.longitude})")
        return {
            "lat": location.latitude,
            "lon": location.longitude,
            "node": ox.distance.nearest_nodes(G, X=location.longitude, Y=location.latitude)
        }
    else:
        print(f"Failed to geocode address: {address}")
        return None
