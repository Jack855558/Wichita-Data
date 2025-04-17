import os
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import folium
import osmnx as ox

# Import the necessary utility function
from route_utils import get_nearest_node

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow all origins for testing

# Route to check locations (on-demand loading of the network)
@app.route('/check-locations', methods=['POST'])
def check_locations():
    # Load the road network on demand
    G = ox.graph_from_place("Wichita, Kansas, USA", network_type="drive")

    # Get the start and end addresses from the POST request
    data = request.json
    start_address = data.get('start')
    end_address = data.get('end')

    # Get nearest nodes for the start and end addresses
    start_info = get_nearest_node(G, start_address)
    end_info = get_nearest_node(G, end_address)

    # Check if both start and end info are found
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

# Route to serve the map (on-demand loading of the network)
@app.route('/map')
def get_map():
    # Load the road network on demand
    G = ox.graph_from_place("Wichita, Kansas, USA", network_type="drive")

    # Wichita, KS coordinates for map center
    lat, lng = 37.6872, -97.3301

    # Create the Folium map centered on Wichita
    m = folium.Map(
        location=[lat, lng],
        zoom_start=12,
        control_scale=True
    )

    # Get the HTML representation of the map
    map_html = m.get_root().render()

    # Return the HTML to the client
    return Response(map_html, mimetype='text/html')

# A simple test route to ensure Flask is working
@app.route('/test')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # default to 5000 locally
    app.run(host="0.0.0.0", port=port)
