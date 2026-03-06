import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const SecureImage = ({ src, alt, className = '', fallback = null }) => {
    const [objectUrl, setObjectUrl] = useState('');
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let currentUrl = '';

        const loadImage = async () => {
            if (!src) {
                setObjectUrl('');
                setFailed(true);
                return;
            }

            try {
                setFailed(false);
                const response = await api.get(src, { responseType: 'blob' });
                currentUrl = URL.createObjectURL(response.data);
                setObjectUrl(currentUrl);
            } catch {
                setObjectUrl('');
                setFailed(true);
            }
        };

        loadImage();

        return () => {
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }
        };
    }, [src]);

    if (!src || failed || !objectUrl) {
        return fallback;
    }

    return <img src={objectUrl} alt={alt} className={className} />;
};

export default SecureImage;
