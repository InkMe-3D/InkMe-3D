import React, { useState, useEffect, useContext } from 'react';
import QRPayment from '../../Payment/QRPayment';
import AddressManage from '../../AddressManage/AddressManage';
import UserInfoCheckout from '../UserInfoCheckout/UserInfoCheckout';
import { MyContext } from '../../../context/MyContext';
import { postData } from '../../../utils/api';
import { trackBeginCheckout } from '../../../utils/analytics';

const CheckoutSection = () => {
    const context = useContext(MyContext);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showQR, setShowQR] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdOrder, setCreatedOrder] = useState(null);
    // Kiểm tra xem có đủ thông tin để thanh toán không
    const isReadyForPayment = () => {
        return user?.name && user?.phone && user?.email && context.selectedAddressId;
    };
    const cartItems = context.cartData || [];

    console.log('🛒 Cart Items trước khi tạo order:', cartItems);

    const handlePaymentClick = async () => {
        if (!isReadyForPayment()) return;
        setLoading(true);
        setError('');
        try {
            // Lấy thông tin địa chỉ đã chọn
            const addressObj = context.selectedAddressId;
            // Lấy thông tin cart (giả sử context.cartData)
            const cartItems = context.cartData || [];
            const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Google Analytics tracking - Begin Checkout
            trackBeginCheckout(cartItems, totalValue);

            // Debug: Kiểm tra cart items trước khi tạo order
            console.log('🛒 Cart Items trước khi tạo order:', cartItems);

            // Tạo dữ liệu order
            const orderData = {
                fullname: user.name,
                email: user.email,
                phoneNumber: user.phone,
                address: addressObj,
                note: '',
                amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                products: cartItems.map(item => ({
                    productId: item.productId,
                    productTitle: item.productTitle,
                    quantity: item.quantity,
                    images: item.images,
                    price: item.price,
                    subTotal: item.price * item.quantity,
                    inkmeFile: item.inkmeFile || null,
                    classifications: item.classifications || []
                })),
                orderId: String(Date.now()),
                userId: user.userId,
                orderType: 'QRCode',
                orderDescription: 'Đơn hàng thanh toán qua QR',
                status: 'Unpaid',
            };

            // Debug: Kiểm tra order data trước khi gửi
            console.log('📦 Order Data sẽ gửi:', orderData);
            const res = await postData('/api/orders/create', orderData);
            if (res && !res.error && res._id) {
                setCreatedOrder(res);
                setShowQR(true);
            } else {
                setError(res?.message || 'Tạo đơn hàng thất bại');
            }
        } catch (err) {
            setError('Có lỗi khi tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="checkout-section fix section-padding section-bg-2">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row g-4">
                            {/* Payment Method Selection */}
                            <div className="col-md-5 col-lg-4 col-xl-3">
                                <div className="checkout-radio">
                                    <p className="primary-text">Chọn phương thức thanh toán</p>
                                    <div className="checkout-radio-wrapper">
                                        <div className="checkout-radio-single">
                                            <input type="radio" className="form-check-input" id="cCard" name="pay-method" value="Credit/Debit Cards" required checked readOnly />
                                            <label htmlFor="cCard">QR Code VietQR</label>
                                        </div>
                                        <div className="checkout-radio-single" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                            <input type="radio" className="form-check-input" id="cCard2" name="pay-method" value="Credit/Debit Cards" required disabled />
                                            <label htmlFor="cCard2">Thẻ tín dụng/thẻ ghi nợ</label>
                                        </div>
                                        <div className="checkout-radio-single" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                            <input type="radio" className="form-check-input" id="paypal" name="pay-method" value="PayPal" required disabled />
                                            <label htmlFor="paypal">PayPal (Chưa hỗ trợ)</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Management Section */}
                            <div className="col-md-7 col-lg-8 col-xl-9">
                                <div className="checkout-single-wrapper">
                                    {/* Thông tin cá nhân */}
                                    <UserInfoCheckout />

                                    {/* Quản lý địa chỉ */}
                                    <AddressManage />

                                    {/* Payment Button or QR */}
                                    <div className="checkout-single checkout-single-bg" style={{ textAlign: 'center', marginTop: 24 }}>
                                        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
                                        {!showQR ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{ minWidth: 180, padding: '10px 30px', fontSize: 18, opacity: isReadyForPayment() ? 1 : 0.6 }}
                                                disabled={!isReadyForPayment() || loading}
                                                onClick={handlePaymentClick}
                                            >
                                                {loading ? 'Đang xử lý...' : 'Thanh toán'}
                                            </button>
                                        ) : (
                                            <>
                                                <h4 style={{ textAlign: 'center' }}>Mã QR Thanh toán</h4>
                                                <div className="checkout-single-form">
                                                    <div className="row g-3">
                                                        <div className="col-lg-12">
                                                            <QRPayment order={createdOrder} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
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

export default CheckoutSection;