import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Map = () => {

    const [mapHTML, setMapHTML] = useState('');

    useEffect(() => {
        axios.get('https://wichita-data-1.onrender.com/map')
            .then((response) => setMapHTML(response.data))
            .catch((error) => console.error('Error fetching map:', error));
    }, []);

    console.log(';)');

    // useEffect(() => {
    //     axios.get('https://wichita-data-1.onrender.com/test')
    //         .then((response) => setMapHTML(response.data))
    //         .catch((error) => console.error('Error fetching map:', error));
    // }, []);



    return <div dangerouslySetInnerHTML={{ __html: mapHTML }} />
}

export default Map; 