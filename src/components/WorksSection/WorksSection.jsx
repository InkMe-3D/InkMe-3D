import React from 'react';

import Ws1 from '../../img/about/product-shape.png'
import Ws2 from '../../img/about/may-in.png'
import Ws3 from '../../img/about/05.jpg'
import Ws4 from '../../img/feature/StickersV30.png'
import Ws5 from '../../img/line.png'


const WorksSection = (props) => {
    return (
        <section className={"" + props.hclass} style={{ backgroundImage: `url(${props.Ws6})` }}>
            <div className="product-shape float-bob-x">
                <img src={Ws1} alt="img" />
            </div>
            <div className="container">
                <div className={"" + props.eclass}>
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="about-image-items">
                                <div className="about-feature-image">
                                    <img src={Ws2} alt="img" className="wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.1s" />
                                    <div className="about-feature-image reveal image-anime">
                                        <img src={Ws3} alt="img" />
                                    </div>
                                    <div className="stickers-shape">
                                        <img src={Ws4} alt="img" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-feature-content">
                                <div className="section-title">
                                    {/* <h6 className="wow fadeInUp">More about us</h6> */}
                                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                        Công Nghệ In Áo &
                                        <span><img src={Ws5} alt="img" />Chất Lượng Mực In</span>
                                    </h2>
                                </div>
                                <div className="box-items-area mt-3 mt-md-0">
                                    <div className="box-item wow fadeInUp" data-wow-delay=".3s">
                                        <h5>🖨️ Công Nghệ In Trực Tiếp (DTG) Hiện Đại</h5>
                                        <p>
                                        Sử dụng công nghệ Direct-to-Garment (DTG) – mực được in trực tiếp lên vải, 
                                        cho màu sắc chân thực và độ chi tiết cao.

                                        </p>
                                    </div>
                                    <div className="box-item active wow fadeInUp" data-wow-delay=".3s">
                                        <h5>🎨 Mực In Chất Lượng Cao, An Toàn Cho Da</h5>
                                        <p>
                                        Mực in gốc nước thân thiện với môi trường, không gây kích ứng – phù hợp cả với da nhạy cảm và trẻ em.
                                        </p>
                                    </div>
                                    <div className="box-item wow fadeInUp" data-wow-delay=".3s">
                                        <h5>🧼 Dễ Giặt, Không Phai</h5>
                                        <p>
                                        Không cần giặt tay. Thiết kế in vẫn giữ nguyên độ sắc nét kể cả khi giặt máy hoặc sấy khô nhẹ.
                                        </p>
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

export default WorksSection;