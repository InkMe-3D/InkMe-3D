import React, { useState } from 'react'
import VideoGuidePopup from './VideoGuidePopup'
import './Cart.css'
import { trackDownloadInkmeFile } from '../../utils/analytics'

const InkMeFile = ({ inkmeFile }) => {
    const [showGuide, setShowGuide] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const downloadFile = () => {
        if (inkmeFile?.url) {
            // Google Analytics tracking - Download Inkme File
            trackDownloadInkmeFile({
                sceneName: inkmeFile.sceneName || 'untitled',
                fileSize: 0 // File size không có sẵn
            });
            
            window.open(inkmeFile.url, '_blank');
        }
    };

    if (!inkmeFile) return null;

    return (
        <div className="inkme-file-container">
            <button
                className="download-button"
                onClick={downloadFile}
                onMouseEnter={() => setShowGuide(true)}
                onMouseLeave={() => setShowGuide(false)}
                title={`Tải file: ${inkmeFile.sceneName || 'Custom Design'}`}
            >
                <span className="button-content">
                    <i className="fas fa-download button-icon"></i>
                    Tải Model 3D
                </span>

                <div className="glass-overlay" />
            </button>

            <VideoGuidePopup
                isVisible={showGuide}
                onClose={() => setShowGuide(false)}
            />
        </div>
    )
}

export default InkMeFile