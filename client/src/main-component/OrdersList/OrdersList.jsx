import React, { useState, useEffect } from 'react';
import { fetchDataFromApi } from '../../../utils/api';
import { useMyContext } from '../../../context/MyContext';
import { Link } from 'react-router-dom';
import './OrdersList.css';

const OrdersList = () => {
    const { userId } = useMyContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetchDataFromApi(`/api/orders/user/${userId}`);
            setOrders(response || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Unpaid': { color: 'warning', text: 'Chờ thanh toán', icon: 'fas fa-clock' },
            'Paid': { color: 'info', text: 'Đã thanh toán', icon: 'fas fa-credit-card' },
            'Processing': { color: 'primary', text: 'Đang xử lý', icon: 'fas fa-cog' },
            'Shipping': { color: 'secondary', text: 'Đang giao hàng', icon: 'fas fa-truck' },
            'Delivered': { color: 'success', text: 'Đã giao hàng', icon: 'fas fa-check-circle' },
            'Cancelled': { color: 'danger', text: 'Đã hủy', icon: 'fas fa-times-circle' },
            'Refunded': { color: 'dark', text: 'Đã hoàn tiền', icon: 'fas fa-undo' }
        };

        const config = statusConfig[status] || { color: 'secondary', text: status, icon: 'fas fa-question' };

        return (
            <span className={`badge badge-${config.color} status-badge`}>
                <i className={`${config.icon} me-2`}></i>
                {config.text}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalProducts = (products) => {
        return products.reduce((total, product) => total + product.quantity, 0);
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Đang tải danh sách đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-error">
                <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h5>Có lỗi xảy ra</h5>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchOrders}>
                    <i className="fas fa-redo me-2"></i>
                    Thử lại
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-empty">
                <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h5>Chưa có đơn hàng nào</h5>
                <p className="text-muted">Bạn chưa thực hiện đơn hàng nào</p>
                <Link to="/shop" className="btn btn-primary">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Mua sắm ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="orders-list-container">
            <div className="orders-header">
                <h5 className="orders-title">
                    <i className="fas fa-shopping-bag me-2"></i>
                    Lịch sử đơn hàng ({orders.length})
                </h5>
                <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders}>
                    <i className="fas fa-sync-alt me-1"></i>
                    Làm mới
                </button>
            </div>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h6 className="order-id">
                                    <i className="fas fa-receipt me-2"></i>
                                    Đơn hàng #{order.orderId}
                                </h6>
                                <p className="order-date">
                                    <i className="fas fa-calendar me-2"></i>
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>
                            <div className="order-status">
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        <div className="order-body">
                            <div className="order-details">
                                <div className="detail-item">
                                    <span className="detail-label">
                                        <i className="fas fa-box me-2"></i>
                                        Sản phẩm:
                                    </span>
                                    <span className="detail-value">
                                        {getTotalProducts(order.products)} sản phẩm
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">
                                        <i className="fas fa-money-bill me-2"></i>
                                        Tổng tiền:
                                    </span>
                                    <span className="detail-value amount">
                                        {formatCurrency(order.amount)}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">
                                        <i className="fas fa-credit-card me-2"></i>
                                        Phương thức:
                                    </span>
                                    <span className="detail-value">
                                        {order.orderType === 'QRCode' ? 'QR Code VietQR' : order.orderType}
                                    </span>
                                </div>

                                {order.address && (
                                    <div className="detail-item">
                                        <span className="detail-label">
                                            <i className="fas fa-map-marker-alt me-2"></i>
                                            Địa chỉ:
                                        </span>
                                        <span className="detail-value">
                                            {typeof order.address === 'string'
                                                ? order.address
                                                : `${order.address.details}, ${order.address.city}`
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            {order.products && order.products.length > 0 && (
                                <div className="order-products">
                                    <h6 className="products-title">Sản phẩm trong đơn hàng:</h6>
                                    <div className="products-list">
                                        {order.products.slice(0, 3).map((product, index) => (
                                            <div key={index} className="product-item">
                                                {product.images && product.images.length > 0 && (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.productTitle}
                                                        className="product-image"
                                                    />
                                                )}
                                                <div className="product-info">
                                                    <p className="product-title">{product.productTitle}</p>
                                                    <p className="product-quantity">
                                                        Số lượng: {product.quantity} × {formatCurrency(product.price)}
                                                    </p>
                                                </div>
                                                <div className="product-total">
                                                    {formatCurrency(product.subTotal)}
                                                </div>
                                            </div>
                                        ))}
                                        {order.products.length > 3 && (
                                            <p className="more-products">
                                                và {order.products.length - 3} sản phẩm khác...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="order-footer">
                            <div className="order-actions">
                                <button className="btn btn-outline-primary btn-sm">
                                    <i className="fas fa-eye me-1"></i>
                                    Xem chi tiết
                                </button>

                                {order.status === 'Unpaid' && (
                                    <button className="btn btn-success btn-sm">
                                        <i className="fas fa-credit-card me-1"></i>
                                        Thanh toán
                                    </button>
                                )}

                                {(order.status === 'Unpaid' || order.status === 'Paid') && (
                                    <button className="btn btn-danger btn-sm">
                                        <i className="fas fa-times me-1"></i>
                                        Hủy đơn
                                    </button>
                                )}

                                {order.status === 'Delivered' && (
                                    <button className="btn btn-warning btn-sm">
                                        <i className="fas fa-star me-1"></i>
                                        Đánh giá
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersList;
