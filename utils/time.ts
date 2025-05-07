import { Timestamp } from 'firebase/firestore';
export function formatTime(timestamp) {
    // Chuyển đổi Firestore timestamp (seconds + nanoseconds) thành đối tượng Date
    // console.log('timestamp:', timestamp);
    if (!timestamp) {
        return '0 phút trước'; // Trả về giá trị mặc định nếu timestamp không hợp lệ
    }
    const date = new Date(timestamp); // nanoseconds / 1000000 để chuyển đổi nanoseconds thành milliseconds
    const now = new Date();

    // Tính toán sự khác biệt giữa thời gian hiện tại và thời gian đã cho
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000); // Chuyển đổi sang phút
    const diffHours = Math.round(diffMins / 60); // Chuyển đổi sang giờ
    const diffDays = Math.round(diffHours / 24); // Chuyển đổi sang ngày

    // Trả về thời gian theo định dạng "xx phút trước", "xx giờ trước", "xx ngày trước"
    if (diffMins < 60) {
        return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else {
        return `${diffDays} ngày trước`;
    }
}

export function toDMY(timestamp) {
    // console.log('timestamp:', new Date(timestamp).getTime());
    if (!timestamp) {
        console.log('timestamp:', timestamp);
        return 'NaN'; // Trả về giá trị mặc định nếu timestamp không hợp lệ
    }
    const ts: Timestamp = timestamp as Timestamp;
    const date = ts.toDate(); // Chuyển đổi Firestore timestamp thành đối tượng Date
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}
