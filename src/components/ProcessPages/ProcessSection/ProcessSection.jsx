import React from 'react';

import Ps1 from '../../../img/feature/line-shape.png'
import Ps2 from '../../../img/feature/natural.png'
import Ps3 from '../../../img/feature/Group.png'
import Ps4 from '../../../img/feature/printing1.png'
import Ps5 from '../../../img/feature/printing1.png'
import Ps6 from '../../../img/feature/growth1.png'

const ProcessSection = () => {
    return (
        <section className="feature-section-3 section-padding pt-0">
            <div className="container custom-container-2">
                <div className="fearure-wrapper-3">
                    <div className="line-shape">
                        <img src={Ps1} alt="img" />
                    </div>
                    <div className="feature-item wow fadeInUp" data-wow-delay=".2s">
                        <div className="feature-icon">
                            <img src={Ps2} alt="img" />
                        </div>
                        <div className="feature-content">
                            <h5>
                                Cửa hàng in ấn đã<br />
                                được chứng nhận
                            </h5>
                        </div>
                    </div>
                    <div className="feature-item wow fadeInUp" data-wow-delay=".4s">
                        <div className="feature-icon">
                            <img src={Ps3} alt="img" />
                        </div>
                        <div className="feature-content">
                            <h5>
                                Giao hàng nhanh trong <br />
                                10 ngày làm việc
                            </h5>
                        </div>
                    </div>
                    <div className="feature-item wow fadeInUp" data-wow-delay=".6s">
                        <div className="feature-icon">
                            <img src={Ps4} alt="img" />
                        </div>
                        <div className="feature-content">
                            <h5>
                                In Ấn Uy Tín<br />
                                Chất Lượng Bền Lâu
                            </h5>
                        </div>
                    </div>
                    <div className="feature-item wow fadeInUp" data-wow-delay=".7s">
                        <div className="feature-icon">
                            <img src={Ps5} alt="img" />
                        </div>
                        <div className="feature-content">
                            <h5>
                                Linh Hoạt Số Lượng <br />
                                Không Ép Buộc
                            </h5>
                        </div>
                    </div>
                    <div className="feature-item wow fadeInUp" data-wow-delay=".8s">
                        <div className="feature-icon">
                            <img src={Ps6} alt="img" />
                        </div>
                        <div className="feature-content">
                            <h5>
                                Quy Trình Số Hoá<br />
                                Thiết Kế Dễ Dàng
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default ProcessSection;