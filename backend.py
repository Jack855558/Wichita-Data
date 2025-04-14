import pandas as pd
import geopandas as gpd
import numpy as np
from flask import Flask, Response
from flask_cors import CORS
import folium


app = Flask(__name__)
CORS(app, origins="http://localhost:3000") #Allow frontend requeset

@app.route('/map')
def get_map(): 
    # Create the Folium map
    m = folium.Map(location=[45.5236, -122.6750], zoom_start=13)

    # Get the HTML for the map
    map_html = m.get_root().render()

    # Debugging log
    print(map_html[:100])  # Print the first 1000 characters of HTML

    # Send the HTML back
    return Response(map_html, mimetype='text/html')

if __name__ == '__main__':
    app.run(debug=True)

