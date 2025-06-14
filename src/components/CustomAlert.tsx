
// 예쁜 알림 컴포넌트
import {useEffect} from "react";

interface CustomAlertProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // 4초 후 자동 닫기

        return () => clearTimeout(timer);
    }, [onClose]);

    const getAlertStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className={`${getAlertStyles()} border rounded-lg p-4 shadow-lg max-w-sm`}>
                <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{getIcon()}</span>
                    <div className="flex-1">
                        <p className="text-sm font-medium leading-relaxed">{message}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
