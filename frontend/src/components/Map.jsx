import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Map = () => {

    const [mapHTML, setMapHTML] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/map')
            .then((response) => setMapHTML(response.data))
    }, [])

    return <div dangerouslySetInnerHTML={{ __html: mapHTML }} />
}

export default Map; 