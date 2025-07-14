import React, { useState, useEffect } from 'react';
import { fetchDataFromApi, editData } from '../../../utils/api';
import { useMyContext } from '../../../context/MyContext';
import { Link } from 'react-router-dom';
import InkMeFile from '../../CartPage/InkMeFile';
import './OrdersList.css';

const OrdersList = () => {
    const { userId } = useMyContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('dateCreated');
    const [sortOrder, setSortOrder] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

    // Check if order can be cancelled (within 24 hours of payment)
    const canCancelOrder = (order) => {
        if (order.status === 'cancelled' || order.status === 'shipped' || order.status === 'Delivered') {
            return false;
        }

        if (order.status === 'Paid') {
            const now = new Date();
            const orderDate = new Date(order.dateCreated);
            const timeDiff = now - orderDate;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            return hoursDiff <= 24;
        }

        return true; // Unpaid orders can be cancelled
    };

    // Handle cancel order
    const handleCancelOrder = async (order) => {
        if (!canCancelOrder(order)) {
            alert('Không thể hủy đơn hàng này.');
            return;
        }

        const confirmCancel = window.confirm(
            'Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.'
        );

        if (confirmCancel) {
            try {
                await editData(`/api/orders/${order._id}/cancel`, {});

                // Refresh orders list
                fetchOrders();

                // Show success message
                alert('Đơn hàng đã được hủy thành công!');
            } catch (error) {
                console.error('Cancel error:', error);
                alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
            }
        }
    };

    // Get remaining time for cancellation
    const getRemainingCancelTime = (order) => {
        if (order.status !== 'Paid') return null;

        const now = new Date();
        const orderDate = new Date(order.dateCreated);
        const timeDiff = now - orderDate;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff > 24) return null;

        const remainingHours = Math.floor(24 - hoursDiff);
        const remainingMinutes = Math.floor((24 - hoursDiff - remainingHours) * 60);

        return `${remainingHours}h ${remainingMinutes}m`;
    };

    // Handle product modal
    const handleProductClick = (order) => {
        setSelectedOrder(order);
        setShowProductModal(true);
    };

    const closeProductModal = () => {
        setShowProductModal(false);
        setSelectedOrder(null);
    };

    // Filter and sort functions
    const clearFilters = () => {
        setStatusFilter('all');
        setSearchTerm('');
        setDateRange({ start: '', end: '' });
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Filter orders
    const getFilteredOrders = () => {
        let filtered = [...orders];

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.orderId.toLowerCase().includes(searchLower) ||
                (order.userId?.name && order.userId.name.toLowerCase().includes(searchLower)) ||
                (order.userId?.email && order.userId.email.toLowerCase().includes(searchLower))
            );
        }

        // Date range filter
        if (dateRange.start || dateRange.end) {
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.dateCreated);
                const startDate = dateRange.start ? new Date(dateRange.start) : null;
                const endDate = dateRange.end ? new Date(dateRange.end + 'T23:59:59.999Z') : null;

                if (startDate && endDate) {
                    return orderDate >= startDate && orderDate <= endDate;
                } else if (startDate) {
                    return orderDate >= startDate;
                } else if (endDate) {
                    return orderDate <= endDate;
                }
                return true;
            });
        }

        // Sort orders
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'orderId':
                    aValue = a.orderId;
                    bValue = b.orderId;
                    break;
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'dateCreated':
                default:
                    aValue = new Date(a.dateCreated);
                    bValue = new Date(b.dateCreated);
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    };

    const filteredOrders = getFilteredOrders();

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
        <div className="orders-list-container container">
            <div className="orders-header">
                <h5 className="orders-title">
                    <i className="fas fa-shopping-bag me-2"></i>
                    Lịch sử đơn hàng ({filteredOrders.length}/{orders.length})
                </h5>
                <button className="btn btn-outline-primary btn-sm" onClick={fetchOrders}
                style={{color: 'white', fontSize: '14px'}}>
                    <i className="fas fa-sync-alt me-1"></i>
                    Làm mới
                </button>
            </div>

            {/* Filter Controls */}
            <div className="orders-filters">
                <div className="filter-row">
                    <div className="filter-group">
                        <div className="filter-item">
                            <label className="filter-label" 
                            style={{color: 'white', fontSize: '14px'}}>
                                <i className="fas fa-search"
                                style={{color: 'white', fontSize: '14px'}}
                                ></i>
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                placeholder="Mã đơn hàng, tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label"
                            style={{color: 'white', fontSize: '14px'}}>
                                <i className="fas fa-filter"
                                style={{color: 'white', fontSize: '14px'}}
                                ></i>
                                Trạng thái
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Tất cả</option>
                                <option value="Unpaid">Chờ thanh toán</option>
                                <option value="Paid">Đã thanh toán</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="shipped">Đã giao hàng</option>
                                <option value="failed">Thất bại</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label className="filter-label"
                            style={{color: 'white', fontSize: '14px'}}>
                                <i className="fas fa-sort"
                                style={{color: 'white', fontSize: '14px'}}
                                ></i>
                                Sắp xếp
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="dateCreated">Ngày tạo</option>
                                <option value="orderId">Mã đơn hàng</option>
                                <option value="amount">Tổng tiền</option>
                                <option value="status">Trạng thái</option>
                            </select>
                        </div>

                        <button
                            className="btn btn-outline-secondary btn-sm sort-btn"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                        >
                            <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                        </button>
                    </div>

                    <div className="filter-group">
                        <div className="filter-item">
                            <label className="filter-label"
                            style={{color: 'white', fontSize: '14px'}}>
                                <i className="fas fa-calendar"
                                style={{color: 'white', fontSize: '14px'}}
                                ></i>
                                Từ ngày
                            </label>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="filter-date"
                            />
                        </div>

                        <div className="filter-item">
                            <label className="filter-label"
                            style={{color: 'white', fontSize: '14px'}}>
                                <i className="fas fa-calendar"
                                style={{color: 'white', fontSize: '14px'}}
                                ></i>
                                Đến ngày
                            </label>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="filter-date"
                            />
                        </div>

                        <button
                            className="btn btn-outline-danger btn-sm clear-btn"
                            onClick={clearFilters}
                            title="Xóa tất cả bộ lọc"
                            style={{color: 'white', fontSize: '14px'}}
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            <div className="orders-list">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="order-card compact">
                        <div className="order-header-compact">
                            <div className="order-basic-info">
                                <div className="order-id-compact">
                                    <i className="fas fa-receipt"></i>
                                    #{order.orderId}
                                </div>
                                <div className="order-date-compact">
                                    <i className="fas fa-calendar"></i>
                                    {formatDate(order.dateCreated)}
                                </div>
                            </div>
                            <div className="order-status-compact">
                                {getStatusBadge(order.status)}
                            </div>
                        </div>

                        <div className="order-body-compact">
                            <div className="order-summary">
                                <div
                                    className="summary-item clickable"
                                    onClick={() => handleProductClick(order)}
                                    title="Xem chi tiết sản phẩm"
                                >
                                    <i className="fas fa-box"></i>
                                    <span>{getTotalProducts(order.products)} sản phẩm</span>
                                    <i className="fas fa-eye ms-2"></i>
                                </div>
                                <div className="summary-item">
                                    <i className="fas fa-money-bill"></i>
                                    <span className="amount">{formatCurrency(order.amount)}</span>
                                </div>
                                <div className="summary-item">
                                    <i className="fas fa-credit-card"></i>
                                    <span>{order.orderType === 'QRCode' ? 'QR Code' : order.orderType}</span>
                                </div>
                            </div>

                            {/* Compact product preview */}
                            {order.products && order.products.length > 0 && (
                                <div className="products-preview">
                                    <div className="preview-items">
                                        {order.products.slice(0, 2).map((product, index) => {
                                            const hasValidImage = Array.isArray(product.images) && product.images.some(img => img && img.trim() !== "");

                                            return (
                                                <div key={index} className="preview-item">
                                                    {(!hasValidImage && product.inkmeFile) ? (
                                                        <div className="inkme-preview-container">
                                                            <InkMeFile inkmeFile={product.inkmeFile} />
                                                        </div>
                                                    ) : (
                                                        hasValidImage && (
                                                            <img
                                                                src={product.images.find(img => img && img.trim() !== "")}
                                                                alt={product.productTitle}
                                                                className="preview-image"
                                                            />
                                                        )
                                                    )}
                                                    <span className="preview-title">{product.productTitle}</span>
                                                </div>
                                            );
                                        })}

                                        {order.products.length > 2 && (
                                            <div className="preview-more">
                                                +{order.products.length - 2} sản phẩm khác
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="order-footer-compact">
                            <div className="order-actions-compact">
                                {/* Compact timer */}
                                {order.status === 'Paid' && getRemainingCancelTime(order) && (
                                    <div className="cancel-timer-compact">
                                        <i className="fas fa-clock"></i>
                                        {getRemainingCancelTime(order)}
                                    </div>
                                )}

                                {/* Compact action buttons */}
                                <div className="action-buttons-compact">
                                    {canCancelOrder(order) && (
                                        <button
                                            className="btn btn-danger btn-xs"
                                            onClick={() => handleCancelOrder(order)}
                                            title="Hủy đơn hàng"
                                        >
                                            <span style={{color: 'white', fontSize: '14px', marginRight: '5px'}}>Hủy đơn hàng</span>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}

                                    {order.status === 'Delivered' && (
                                        <button className="btn btn-warning btn-xs" title="Đánh giá">
                                            <i className="fas fa-star"></i>
                                        </button>
                                    )}
                                </div>

                                {/* Compact status messages */}
                                {order.status === 'cancelled' && (
                                    <span className="badge badge-secondary badge-sm">
                                        <i className="fas fa-ban"></i>
                                    </span>
                                )}

                                {order.status === 'Paid' && !getRemainingCancelTime(order) && (
                                    <span className="badge badge-info badge-sm">
                                        <i className="fas fa-lock"></i>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Details Modal */}
            {showProductModal && selectedOrder && (
                <div className="modal-overlay" onClick={closeProductModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="fas fa-box me-2"></i>
                                Chi tiết sản phẩm - Đơn hàng #{selectedOrder.orderId}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeProductModal}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="order-info-summary">
                                <div className="info-row">
                                    <span className="info-label">Ngày đặt:</span>
                                    <span className="info-value">{formatDate(selectedOrder.dateCreated)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Tổng tiền:</span>
                                    <span className="info-value amount">{formatCurrency(selectedOrder.amount)}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Trạng thái:</span>
                                    <span className="info-value">{getStatusBadge(selectedOrder.status)}</span>
                                </div>
                            </div>

                            <div className="products-list">
                                <h6 className="products-title">
                                    <i className="fas fa-list me-2"></i>
                                    Danh sách sản phẩm ({selectedOrder.products.length})
                                </h6>
                                {selectedOrder.products.map((product, index) => (
                                    <div key={index} className="product-item">
                                        <div className="product-header">
                                            <div className="product-image">
                                                {Array.isArray(product.images) && product.images.some(img => img && img.trim() !== "") ? (
                                                    <img
                                                        src={product.images.find(img => img && img.trim() !== "")}
                                                        alt={product.productTitle}
                                                        className="product-img"
                                                    />
                                                ) : product.inkmeFile ? (
                                                    <div className="inkme-preview-container">
                                                        <InkMeFile inkmeFile={product.inkmeFile} />
                                                    </div>
                                                ) : (
                                                    <div className="no-image">
                                                        <i className="fas fa-image"></i>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="product-info">
                                                <h6 className="product-title">{product.productTitle}</h6>
                                                <div className="product-details">
                                                    <span className="product-price">{formatCurrency(product.price)}</span>
                                                    <span className="product-quantity">x{product.quantity}</span>
                                                    <span className="product-subtotal">{formatCurrency(product.subTotal)}</span>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Classifications */}
                                        {product.classifications && product.classifications.length > 0 && (
                                            <div className="classifications-details">
                                                <h6 className="classifications-title">
                                                    <i className="fas fa-tags me-2"></i>
                                                    Phân loại
                                                </h6>
                                                <div className="classifications-list">
                                                    {product.classifications.map((cls, clsIndex) => (
                                                        <div key={clsIndex} className="classification-item">

                                                            <div className="classification-info">
                                                                <span className="cls-name">{cls.name}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeProductModal}
                            >
                                <i className="fas fa-times me-2"></i>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
