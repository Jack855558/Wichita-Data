import os
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import folium
import networkx as nx
import osmnx as ox

from route_utils import (
    get_nearest_node
)

# from dotenv import load_dotenv
# Load environment variables from .env file
# load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow all origins for testing

# Load your road network
G = ox.graph_from_place("Wichita, Kansas, USA", network_type="drive")

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

@app.route('/check-locations', methods=['POST', 'OPTIONS'])
def check_locations():
    if request.method == 'OPTIONS':
        # CORS preflight response
        response = app.make_default_options_response()
        headers = response.headers

        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type'

        return response

    data = request.json
    start_address = data.get('start')
    end_address = data.get('end')

    start_info = get_nearest_node(G, start_address)
    end_info = get_nearest_node(G, end_address)

    if start_info and end_info:
        return jsonify({
            "start": start_info,
            "end": end_info,
            "success": True
        })
    else:
        return jsonify({
            "success": False,
            "message": "One or both addresses could not be geocoded."
        }), 400

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=10000)
