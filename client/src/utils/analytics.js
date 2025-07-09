// Google Analytics Utility for InkMe
// Quản lý các sự kiện theo dõi Google Analytics
// 
// GA đã được khởi tạo trong index.html với ID: G-7ZCPCVX6F7
// File này chứa các utility functions để track events

// Helper function để gửi event
const sendEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
            event_category: 'InkMe',
            event_label: window.location.pathname,
            ...parameters
        });
        console.log('GA Event:', eventName, parameters);
    }
};

// ========== ECOMMERCE EVENTS ==========

// Sự kiện thêm vào giỏ hàng
export const trackAddToCart = (productData) => {
    const eventData = {
        event_category: 'ecommerce',
        event_label: 'add_to_cart',
        currency: 'VND',
        value: productData.price || 0,
        items: [{
            item_id: productData.id || productData._id,
            item_name: productData.name || productData.productTitle,
            item_category: productData.category || 'Custom Print',
            price: productData.price || 0,
            quantity: productData.quantity || 1
        }]
    };

    sendEvent('add_to_cart', eventData);

    // Enhanced Ecommerce event
    if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
            currency: 'VND',
            value: productData.price || 0,
            items: eventData.items
        });
    }
};

// Sự kiện xem sản phẩm
export const trackViewProduct = (productData) => {
    const eventData = {
        event_category: 'ecommerce',
        event_label: 'view_item',
        currency: 'VND',
        value: productData.price || 0,
        items: [{
            item_id: productData.id || productData._id,
            item_name: productData.name || productData.productTitle,
            item_category: productData.category || 'Custom Print',
            price: productData.price || 0,
            quantity: 1
        }]
    };

    sendEvent('view_item', eventData);

    // Enhanced Ecommerce event
    if (window.gtag) {
        window.gtag('event', 'view_item', {
            currency: 'VND',
            value: productData.price || 0,
            items: eventData.items
        });
    }
};

// Sự kiện bắt đầu checkout
export const trackBeginCheckout = (cartData, totalValue) => {
    const items = cartData.map(item => ({
        item_id: item.productId || item.id,
        item_name: item.productTitle || item.name,
        item_category: item.category || 'Custom Print',
        price: item.price || 0,
        quantity: item.quantity || 1
    }));

    const eventData = {
        event_category: 'ecommerce',
        event_label: 'begin_checkout',
        currency: 'VND',
        value: totalValue || 0,
        items: items
    };

    sendEvent('begin_checkout', eventData);

    // Enhanced Ecommerce event
    if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
            currency: 'VND',
            value: totalValue || 0,
            items: items
        });
    }
};

// Sự kiện hoàn thành mua hàng
export const trackPurchase = (orderData) => {
    const items = orderData.products?.map(item => ({
        item_id: item.productId,
        item_name: item.productTitle,
        item_category: item.category || 'Custom Print',
        price: item.price || 0,
        quantity: item.quantity || 1
    })) || [];

    const eventData = {
        event_category: 'ecommerce',
        event_label: 'purchase',
        transaction_id: orderData.orderId || orderData._id,
        currency: 'VND',
        value: orderData.amount || 0,
        shipping: 0, // Miễn phí vận chuyển
        tax: 0,
        items: items
    };

    sendEvent('purchase', eventData);

    // Enhanced Ecommerce event
    if (window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: orderData.orderId || orderData._id,
            currency: 'VND',
            value: orderData.amount || 0,
            items: items
        });
    }
};

// ========== 3D DESIGN EVENTS ==========

// Sự kiện bắt đầu thiết kế 3D
export const trackStart3DDesign = (designData = {}) => {
    sendEvent('start_3d_design', {
        event_category: '3d_design',
        event_label: 'design_start',
        custom_parameter_1: designData.productType || 'tshirt',
        custom_parameter_2: designData.userId || 'anonymous'
    });
};

// Sự kiện hoàn thành thiết kế 3D
export const trackComplete3DDesign = (designData) => {
    sendEvent('complete_3d_design', {
        event_category: '3d_design',
        event_label: 'design_complete',
        custom_parameter_1: designData.sceneName || 'untitled',
        custom_parameter_2: designData.productId || '',
        custom_parameter_3: designData.fileSize || 0
    });
};

// Sự kiện tải file .inkme
export const trackDownloadInkmeFile = (fileData) => {
    sendEvent('download_inkme_file', {
        event_category: '3d_design',
        event_label: 'file_download',
        custom_parameter_1: fileData.sceneName || 'untitled',
        custom_parameter_2: fileData.fileSize || 0
    });
};

// Sự kiện xem preview 3D
export const trackView3DPreview = (previewData) => {
    sendEvent('view_3d_preview', {
        event_category: '3d_design',
        event_label: 'preview_view',
        custom_parameter_1: previewData.sceneName || 'untitled',
        custom_parameter_2: previewData.userId || 'anonymous'
    });
};

// ========== USER EVENTS ==========

// Sự kiện đăng ký tài khoản
export const trackSignUp = (userData) => {
    sendEvent('sign_up', {
        event_category: 'user',
        event_label: 'registration',
        method: userData.method || 'email', // email, google
        custom_parameter_1: userData.userId || ''
    });
};

// Sự kiện đăng nhập
export const trackLogin = (userData) => {
    sendEvent('login', {
        event_category: 'user',
        event_label: 'authentication',
        method: userData.method || 'email', // email, google
        custom_parameter_1: userData.userId || ''
    });
};

// ========== ENGAGEMENT EVENTS ==========

// Sự kiện tìm kiếm sản phẩm
export const trackSearch = (searchTerm, category = '') => {
    sendEvent('search', {
        event_category: 'engagement',
        event_label: 'product_search',
        search_term: searchTerm,
        custom_parameter_1: category
    });
};

// Sự kiện thêm vào wishlist
export const trackAddToWishlist = (productData) => {
    sendEvent('add_to_wishlist', {
        event_category: 'engagement',
        event_label: 'wishlist_add',
        custom_parameter_1: productData.id || productData._id,
        custom_parameter_2: productData.name || productData.productTitle
    });
};

// Sự kiện chia sẻ sản phẩm
export const trackShareProduct = (productData, method) => {
    sendEvent('share', {
        event_category: 'engagement',
        event_label: 'product_share',
        method: method, // facebook, twitter, whatsapp, etc.
        content_type: 'product',
        content_id: productData.id || productData._id
    });
};

// ========== NAVIGATION EVENTS ==========

// Sự kiện xem trang
export const trackPageView = (pageName, additionalData = {}) => {
    if (window.gtag) {
        window.gtag('config', window.GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
            page_title: pageName,
            page_location: window.location.href,
            custom_map: additionalData
        });
    }

    sendEvent('page_view', {
        event_category: 'navigation',
        event_label: pageName,
        page_location: window.location.href,
        ...additionalData
    });
};

// Sự kiện click button CTA
export const trackCTAClick = (buttonName, location) => {
    sendEvent('cta_click', {
        event_category: 'engagement',
        event_label: buttonName,
        custom_parameter_1: location,
        page_location: window.location.href
    });
};

// ========== ERROR TRACKING ==========

// Sự kiện lỗi
export const trackError = (errorType, errorMessage, location = '') => {
    sendEvent('error_occurred', {
        event_category: 'error',
        event_label: errorType,
        custom_parameter_1: errorMessage,
        custom_parameter_2: location,
        fatal: false
    });
};

// Export default object với tất cả functions
export default {
    trackAddToCart,
    trackViewProduct,
    trackBeginCheckout,
    trackPurchase,
    trackStart3DDesign,
    trackComplete3DDesign,
    trackDownloadInkmeFile,
    trackView3DPreview,
    trackSignUp,
    trackLogin,
    trackSearch,
    trackAddToWishlist,
    trackShareProduct,
    trackPageView,
    trackCTAClick,
    trackError
}; 