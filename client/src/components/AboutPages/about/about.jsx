import React from 'react';

/* image  */
import Abimg1 from '../../../img/about/dot-1.png'
import Abimg2 from '../../../img/about/dot-2.png'
import Abimg3 from '../../../img/about/circle.png'
import Abimg4 from '../../../img/about/cap.png'
import Abimg5 from '../../../img/about/shape.png'
import Abimg6 from '../../../img/about/01.jpg'
import Abimg7 from '../../../img/about/02.jpg'
import Abimg8 from '../../../img/about/03.jpg'
import Abimg9 from '../../../img/line.png'
import Abimg10 from '../../../img/icon/01.svg'
import Abimg11 from '../../../img/about/author.png'
import Abimg12 from '../../../img/about/line.png'
import Abimg13 from '../../../img/icon/02.svg'
import { Link, useNavigate } from 'react-router-dom';
import video from '../../../img/about/demo custom.mp4'
import Custom3D from '../../../main-component/Custom3D/Custom3D'
import { useMyContext } from '../../../context/MyContext';
import { trackCTAClick } from '../../../utils/analytics';

const About = () => {
    const [showPopup, setShowPopup] = React.useState(false);
    const { userId, setAlterBox } = useMyContext();
    const navigate = useNavigate();

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    const handleCustom3D = (e) => {
        e.preventDefault();

        // Google Analytics tracking - CTA Click
        trackCTAClick('Trải nghiệm ngay', 'About Section');

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user || !userId) {
            setAlterBox({
                open: true,
                error: true,
                message: "Bạn cần đăng nhập để sử dụng tính năng thiết kế 3D"
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);

            return;
        }

        setShowPopup(true);
    }

    const closePopup = () => setShowPopup(false);
    return (
        <section className="about-section section-padding pt-0" style={{ marginTop: '60px' }}>
            <div className="dot-shape">
                <img src={Abimg1} alt="img" />
            </div>
            <div className="dot-shape-2">
                <img src={Abimg2} alt="img" />
            </div>
            <div className="container">
                <div className="about-wrapper">
                    <div className="row g-4">
                        <div className="col-lg-7 d-flex align-items-center">
                            <div className="about-image-items w-100">
                                {/* <div className="circle-shape float-bob-y">
                                    <img src={Abimg3} alt="img" />
                                </div>
                                <div className="cap-shape float-bob-x">
                                    <img src={Abimg4} alt="img" />
                                </div>
                                <div className="shape-img">
                                    <img src={Abimg5} alt="img" />
                                </div>
                                <div className="about-image-1 wow fadeInUp">
                                    <img src={Abimg6} alt="img" />
                                </div>
                                <div className="about-image-2">
                                    <img src={Abimg7} alt="img" />
                                </div>
                                <div className="about-image-3">
                                    <img src={Abimg8} alt="img" />
                                </div> */}

                                <div className="about-video wow fadeInUp">
                                    <video
                                        className="w-100"
                                        // controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    >
                                        <source src={video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="about-content">
                                <div className="section-title">
                                    <h6 className="wow fadeInUp">Về chúng tôi</h6>
                                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                        Biến ý tưởng của bạn
                                        <span> thành hiện thực <img src={Abimg9} alt="img" /></span>
                                    </h2>
                                </div>
                                <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                                    Dù bạn muốn tạo áo cho chính mình hay mở rộng thương hiệu thời trang online –
                                    InkMe cung cấp kho mẫu thiết kế đẹp mắt, dễ tùy chỉnh và sẵn sàng in ấn.
                                </p>
                                <div className="row g-4">
                                    <div className="col-xl-6 col-md-6 col-lg-12 wow fadeInUp" data-wow-delay=".3s">
                                        <div className="icon-box-items active">
                                            <div className="icon-items">
                                                <div className="icon">
                                                    <img src={Abimg10} alt="img" />
                                                </div>
                                                <h6>Tự Động Hoá Quy Trình</h6>
                                            </div>
                                            <span>
                                                Từ thiết kế đến đặt in – mọi thao tác đều được tối ưu hoá
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-md-6 col-lg-12 wow fadeInUp" data-wow-delay=".5s">
                                        <div className="icon-box-items">
                                            <div className="icon-items">
                                                <div className="icon bg-2">
                                                    <img src={Abimg13} alt="" />
                                                </div>
                                                <h6>Công Cụ Xây Dựng Thương Hiệu </h6>
                                            </div>
                                            <span>
                                                Dễ dàng thêm logo, slogan, hoặc cá nhân hoá từng chi tiết trên áo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="about-author">
                                    <button onClick={handleCustom3D} className="theme-btn wow fadeInUp" data-wow-delay=".3s">Trải nghiệm ngay</button>
                                    {showPopup && (
                                        <div className='custom-3d-popup' >
                                            <div className='custom-3d-popup-content'>
                                                <button onClick={closePopup} className='custom-3d-popup-close'>×</button>
                                                <Custom3D />
                                            </div>
                                        </div>
                                    )}
                                    <div className="author-image wow fadeInUp" data-wow-delay=".5s">
                                        <img src={Abimg11} alt="img" />
                                        <div className="content">
                                            <span>Đội ngũ nhân viên chuyên nghiệp <img src={Abimg12} alt="img" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;