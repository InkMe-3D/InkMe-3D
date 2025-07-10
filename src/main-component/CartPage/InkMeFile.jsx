import React, { useState } from 'react'
import VideoGuidePopup from './VideoGuidePopup'
import './Cart.css'
import { trackDownloadInkmeFile } from '../../utils/analytics'

const InkMeFile = ({ inkmeFile }) => {
    const [showGuide, setShowGuide] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const previewModel = () => {
        if (inkmeFile?.url) {
            // Google Analytics tracking - Preview Inkme File
            trackDownloadInkmeFile({
                sceneName: inkmeFile.sceneName || 'untitled',
                fileSize: 0 // File size không có sẵn
            });

            // Create shareable link
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const baseUrl = isDevelopment
                ? 'http://0.0.0.0:3000/3d-custom/tshirt-sizingtest.html'
                : 'https://inkme-3d-page-custom-production.up.railway.app/tshirt-sizingtest.html';
            const shareableLink = `${baseUrl}?layout=${encodeURIComponent(inkmeFile.url)}`;

            window.open(shareableLink, '_blank');
        }
    };

    if (!inkmeFile) return null;

    return (
        <div className="inkme-file-container">
            <button
                className="download-button"
                onClick={previewModel}
                onMouseEnter={() => setShowGuide(true)}
                onMouseLeave={() => setShowGuide(false)}
                title={`Xem model 3D: ${inkmeFile.sceneName || 'Custom Design'}`}
            >
                <span className="button-content">
                    <i className="fas fa-eye button-icon"></i>
                    Xem Model 3D
                </span>

                <div className="glass-overlay" />
            </button>

            {/* <VideoGuidePopup
                isVisible={showGuide}
                onClose={() => setShowGuide(false)}
                inkmeFile={inkmeFile}
            /> */}
        </div>
    )
}

export default InkMeFile