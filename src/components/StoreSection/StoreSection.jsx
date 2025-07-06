import React from 'react';

import SS1 from '../../img/feature/fulfillment.png'
import SS2 from '../../img/feature/medal.png'
import SS3 from '../../img/feature/agile.png'
import SS4 from '../../img/feature/order.png'

const StoreSection = () => {
    return (
        <section className="feature-section section-padding pt-0">
            <div className="container custom-container">
                <div className="feature-wrapper-2">
                    <div className="row g-4">
                        <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                            <div className="feature-box-items-2 text-center">
                                <div className="icon">
                                    <img src={SS1} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Sản Xuất Nội Địa</h3>
                                    <p>
                                        In áo nhanh, giao hàng sớm, tiết kiệm chi phí vận chuyển.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                            <div className="feature-box-items-2 text-center">
                                <div className="icon bg-2">
                                    <img src={SS2} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Chất Lượng Đảm Bảo</h3>
                                    <p>
                                        Thiết kế 3D mô phỏng sát thực tế, in chuẩn từng chi tiết.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".6s">
                            <div className="feature-box-items-2 text-center">
                                <div className="icon bg-3">
                                    <img src={SS3} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Tự Động Hoá Toàn Quy Trình</h3>
                                    <p>
                                        Từ thiết kế đến in ấn – thao tác chỉ vài cú nhấp chuột.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".8s">
                            <div className="feature-box-items-2 text-center">
                                <div className="icon bg-4">
                                    <img src={SS4} alt="img" />
                                </div>
                                <div className="content">
                                    <h3>Không Yêu Cầu Số Lượng Tối Thiểu</h3>
                                    <p>
                                        Tự do đặt 1 áo lẻ hay 100 áo nhóm – không lo tồn kho.
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

export default StoreSection;