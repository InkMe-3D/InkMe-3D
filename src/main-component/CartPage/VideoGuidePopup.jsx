import React, { useEffect, useState } from 'react';
import './Cart.css';

const VideoGuidePopup = ({ isVisible, onClose, inkmeFile }) => {
    const [mounted, setMounted] = useState(false);
    const [shareableLink, setShareableLink] = useState(null);

    useEffect(() => {
        if (isVisible) {
            setMounted(true);

            // Tạo shareable link từ inkmeFile.url
            if (inkmeFile?.url) {
                const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://0.0.0.0:3000/3d-custom/tshirt-sizingtest.html'
                    : 'https://inkme-3d-page-custom-production.up.railway.app/tshirt-sizingtest.html';
                const link = `${baseUrl}?layout=${encodeURIComponent(inkmeFile.url)}`;
                setShareableLink(link);
            }
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, inkmeFile]);

    if (!mounted) return null;

    return (
        <div
            className={`video-guide-popup ${isVisible ? 'popup-visible' : 'popup-hidden'}`}
            onMouseLeave={onClose}
        >
            <div className="popup-content">


                <div className="popup-header">
                    <h6 className="header-title">
                        {shareableLink ? '🎨 Xem trước Model 3D' : '🎥 Hướng dẫn sử dụng file 3D'}
                    </h6>
                </div>

                {shareableLink ? (
                    <div className="model-preview-container">
                        <iframe
                            src={shareableLink}
                            className="model-preview-iframe"
                            frameBorder="0"
                            allowFullScreen
                            title="Model 3D Preview"
                        />
                        <div className="model-preview-overlay">
                            <div className="preview-info">
                                <p className="preview-description">
                                    ✨ Thiết kế 3D của bạn
                                </p>
                                <div className="preview-buttons">
                                    <button
                                        className="download-file-button"
                                        onClick={() => window.open(inkmeFile.url, '_blank')}
                                        title="Tải file .sav"
                                    >
                                        <i className="fas fa-download"></i>
                                        Tải file
                                    </button>
                                    <button
                                        className="open-full-button"
                                        onClick={() => window.open(shareableLink, '_blank')}
                                    >
                                        <i className="fas fa-external-link-alt"></i>
                                        Toàn màn hình
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="video-container">
                        <video
                            className="video-player"
                            autoPlay
                            muted
                            loop
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.classList.add('fallback-visible');
                            }}
                        >
                            <source src="/videos/inkme-guide.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        <div className="video-fallback">
                            <i className="fas fa-play-circle fallback-icon"></i>
                            <div className="fallback-content">
                                <strong className="fallback-title">Hướng dẫn sử dụng:</strong><br />
                                <div className="fallback-steps">
                                    1. Nhấn nút "Tải Model 3D"<br />
                                    2. File .sav sẽ được tải về<br />
                                    3. Mở file bằng phần mềm 3D<br />
                                    4. In hoặc chỉnh sửa theo ý muốn
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="popup-arrow" />
            <div className="popup-arrow-inner" />
        </div>
    );
};

export default VideoGuidePopup; 