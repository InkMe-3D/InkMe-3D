import React, { useEffect, useState } from 'react';
import './Cart.css';

const VideoGuidePopup = ({ isVisible, onClose }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setMounted(true);
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!mounted) return null;

    return (
        <div
            className={`video-guide-popup ${isVisible ? 'popup-visible' : 'popup-hidden'}`}
            onMouseLeave={onClose}
        >
            <div className="popup-content">
               

                <div className="popup-header">
                    <h6 className="header-title">
                        🎥 Hướng dẫn sử dụng file 3D
                    </h6>
                </div>

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
            </div>

            <div className="popup-arrow" />
            <div className="popup-arrow-inner" />
        </div>
    );
};

export default VideoGuidePopup; 