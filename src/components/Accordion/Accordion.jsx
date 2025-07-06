import React, { useState } from 'react';
import './Accordion.css';

const Accordion = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const accordionData = [
        {
            title: 'Làm thế nào để thiết kế áo bằng InkMe?',
            content:
                'Bạn chỉ cần truy cập trình thiết kế 3D, chọn mẫu áo yêu thích và bắt đầu thêm hình ảnh, văn bản hoặc màu sắc theo ý muốn. Giao diện đơn giản, dễ dùng cho cả người mới bắt đầu.',
        },
        {
            title: 'Tôi có thể sử dụng lại thiết kế đã tạo không?',
            content:
                'Hoàn toàn có thể. Bạn có thể lưu file thiết kế (.inkme) để mở lại, chỉnh sửa hoặc thêm vào giỏ hàng bất kỳ lúc nào.',
        },
        {
            title: 'Tại sao thiết kế của tôi không hiển thị rõ trên áo?',
            content:
                'Có thể hình ảnh bạn sử dụng có độ phân giải thấp. InkMe sử dụng AI để kiểm tra chất lượng hình ảnh – nếu mờ, hệ thống sẽ cảnh báo để bạn thay thế trước khi in.',
        },
        {
            title: 'File .inkme là gì và có công dụng ra sao?',
            content:
                'File .inkme là định dạng chứa toàn bộ bố cục thiết kế 3D của bạn (ảnh, văn bản, vị trí...). File này có thể tải về, chia sẻ, hoặc dùng lại sau này để tiếp tục chỉnh sửa và in.',
        }
    ];

    return (
        <div className="accordion">
            {accordionData.map((item, index) => (
                <div className={`accordion-item ${activeIndex === index ? 'active' : ''}`} key={index}>
                    <div className="accordion-header">
                        <button className="accordion-button" onClick={() => handleToggle(index)}>
                            {item.title}
                        </button>
                    </div>
                    <div className="accordion-content">
                        {activeIndex === index && <p>{item.content}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Accordion;
