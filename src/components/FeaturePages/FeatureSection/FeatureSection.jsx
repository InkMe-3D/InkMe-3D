import React from 'react';

import Feature1 from '../../../img/feature/tshirt.png'
import Feature2 from '../../../img/feature/tshirt-2.png'
import Feature3 from '../../../img/feature/return.png'

const FeatureSection = () => {
    return (
        <section className="feature-section fix section-padding">
            <div className="container">
                <div className="feature-wrapper">
                    <div className="row g-4">
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                            <div className="feature-box-items">
                                <div className="icon">
                                    <img src={Feature1} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Chọn sản phẩm</h3>
                                    <p>
                                        In trên chất liệu cotton 100% chất lượng cao cho lớp hoàn thiện sống động và bền cả ngày
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".5s">
                            <div className="feature-box-items">
                                <div className="icon">
                                    <img src={Feature2} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Tùy chỉnh & đánh giá</h3>
                                    <p>
                                        Tùy chỉnh sản phẩm theo ý thích và xem trước để đảm bảo sự hài lòng trước khi in.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".7s">
                            <div className="feature-box-items">
                                <div className="icon">
                                    <img src={Feature3} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Sẵn sàng giao hàng</h3>
                                    <p>
                                        Sản phẩm luôn được chuẩn bị và sẵn sàng để vận chuyển đến tay bạn một cách nhanh chóng nhất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;