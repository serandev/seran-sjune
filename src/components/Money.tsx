import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';

const AccountItem: React.FC<{
    station: string;
    name: string;
    bank: string;
    number: string;
    isFirst?: boolean;
}> = ({ station, name, bank, number, isFirst = false }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(number);
        alert(`계좌번호가 복사되었습니다.\n${number}`);
    };

    return (
        <div
            className={`flex justify-between items-center py-2 border-b border-gray-200 ${
                isFirst ? 'border-t' : ''
            }`}
        >
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full">
                <div className="text-base md:text-lg">
                    {station}{' '}
                    <strong className="font-semibold">{name}</strong>
                </div>
                <div className="text-base md:text-lg md:mt-0 mt-1">
                    {bank} {number}
                </div>
            </div>
            <button
                onClick={copyToClipboard}
                className="ml-4 flex items-center gap-1 text-sm text-primary hover:text-accent"
            >
                <Copy className="w-4 h-4" />
                복사
            </button>
        </div>
    );
};

const CollapsibleBox: React.FC<{
    title: string;
    isOpen: boolean;
    toggle: () => void;
    children: React.ReactNode;
}> = ({ title, isOpen, toggle, children }) => (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-xl shadow-md p-6 transition">
        <button
            onClick={toggle}
            className="flex items-center justify-between w-full text-left text-lg md:text-xl font-semibold text-gray-800 hover:text-primary"
        >
            {title}
            {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 mt-4' : 'max-h-0'
            }`}
        >
            {children}
        </div>
    </div>
);

const MoneySection: React.FC = () => {
    const [showGroom, setShowGroom] = useState(false);
    const [showBride, setShowBride] = useState(false);

    return (
        <section className="bg-primary/5 py-20 mb-20 px-20">
            <div className="max-w-2xl mx-auto text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-himelody text-primary">
                    마음 보내실 곳
                </h2>
            </div>

            <div className="max-w-2xl font-gowundodum mx-auto flex flex-col gap-6">
                <CollapsibleBox
                    title="신랑측"
                    isOpen={showGroom}
                    toggle={() => setShowGroom((prev) => !prev)}
                >
                    <AccountItem
                        station="어머니"
                        name="한정"
                        bank="우리은행"
                        number="1002554010654"
                        isFirst={true}
                    />
                </CollapsibleBox>

                <CollapsibleBox
                    title="신부측"
                    isOpen={showBride}
                    toggle={() => setShowBride((prev) => !prev)}
                >
                    <AccountItem
                        station="아버지"
                        name="염성권"
                        bank="우리은행"
                        number="1002554010654"
                        isFirst={true}
                    />
                    <AccountItem
                        station="어머니"
                        name="신영숙"
                        bank="우리은행"
                        number="1002554010654"
                    />
                </CollapsibleBox>
            </div>
        </section>
    );
};

export default MoneySection;
