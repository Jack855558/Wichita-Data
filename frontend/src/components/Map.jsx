import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Map = () => {

    const [mapHTML, setMapHTML] = useState('');

    useEffect(() => {
        axios.get('https://your-backend-service-name.onrender.com/map')
            .then((response) => setMapHTML(response.data))
            .catch((error) => console.error('Error fetching map:', error));
    }, []);


    return <div dangerouslySetInnerHTML={{ __html: mapHTML }} />
}

export default Map; 