import pandas as pd
import geopandas as gpd
import numpy as np
import os
from flask import Flask, Response
from flask_cors import CORS
import folium
from dotenv import load_dotenv
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Load environment variables from .env file
load_dotenv()


app = Flask(__name__)
CORS(app)  # Allow all origins for testing

@app.route('/test')
def hello_world():
    return 'Hello, World!'

@app.route('/map')
def get_map(): 
      
    # Wichita, KS coordinates
    lat, lng = 37.6872, -97.3301

    # Create the Folium map centered on Wichita
    m = folium.Map(
        location=[lat, lng],
        zoom_start=12,
        control_scale=True
    )

    # Get the HTML for the map
    map_html = m.get_root().render()

    # Send the HTML back
    return Response(map_html, mimetype='text/html')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=10000)
