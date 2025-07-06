import { fetchDataFromApi } from '../utils/api';

const CASSO_API_KEY = import.meta.env.VITE_CASSO_API_KEY;
const CASSO_API_URL = 'https://oauth.casso.vn/v2/transactions';

export const checkPaymentStatus = async (orderId, amount) => {
    try {
        const response = await fetch(CASSO_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': CASSO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error !== 0) {
            throw new Error(data.message || 'API error');
        }

        // Tìm giao dịch phù hợp
        const matchingTransaction = data.data.records.find(transaction => {
            // Kiểm tra amount
            if (transaction.amount !== amount) {
                return false;
            }

            // Kiểm tra description có chứa orderId
            if (transaction.description && transaction.description.includes(orderId)) {
                return true;
            }

            // Kiểm tra thời gian giao dịch (trong vòng 24h gần đây)
            const transactionTime = new Date(transaction.when);
            const now = new Date();
            const timeDiff = now - transactionTime;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                return false;
            }

            return false;
        });

        return {
            success: true,
            isPaid: !!matchingTransaction,
            transaction: matchingTransaction || null,
            message: matchingTransaction ? 'Thanh toán thành công' : 'Chưa tìm thấy giao dịch thanh toán'
        };

    } catch (error) {
        console.error('Error checking payment status:', error);
        return {
            success: false,
            isPaid: false,
            transaction: null,
            message: 'Lỗi khi kiểm tra trạng thái thanh toán'
        };
    }
};

export const startPaymentMonitoring = (orderId, amount, onPaymentDetected) => {
    let intervalId;
    let checkCount = 0;
    const maxChecks = 10; // Kiểm tra tối đa 10 lần (5 phút với interval 30s)

    const checkPayment = async () => {
        checkCount++;

        const result = await checkPaymentStatus(orderId, amount);

        if (result.success && result.isPaid) {
            clearInterval(intervalId);
            onPaymentDetected(result.transaction);
            return;
        }

        if (checkCount >= maxChecks) {
            clearInterval(intervalId);
            console.log('Payment monitoring timeout');
        }
    };

    // Bắt đầu kiểm tra ngay lập tức
    checkPayment();

    // Sau đó kiểm tra mỗi 30 giây
    intervalId = setInterval(checkPayment, 30000);

    // Trả về function để stop monitoring
    return () => {
        clearInterval(intervalId);
    };
}; 