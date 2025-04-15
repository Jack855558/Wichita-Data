import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Map = () => {

    const [mapHTML, setMapHTML] = useState('');

    // useEffect(() => {
    //     axios.get('https://your-backend-service-name.onrender.com/map')
    //         .then((response) => setMapHTML(response.data))
    //         .catch((error) => console.error('Error fetching map:', error));
    // }, []);

    console.log('Axios default base URL:', axios.defaults.baseURL);

    useEffect(() => {
        axios.get('https://Wichita-Data-1.onrender.com/test')
            .then((response) => setMapHTML(response.data))
            .catch((error) => console.error('Error fetching map:', error));
    }, []);



    //return <div dangerouslySetInnerHTML={{ __html: mapHTML }} />
    return <div>{mapHTML}</div>
}

export default Map; 