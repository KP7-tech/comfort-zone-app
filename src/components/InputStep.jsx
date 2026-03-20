import { useState } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import './InputStep.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function InputStep({ items, setItems, onNext }) {
    const { t, locale } = useTranslation();
    const [currentInput, setCurrentInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (currentInput.trim()) {
            setItems([...items, currentInput.trim()]);
            setCurrentInput('');
        }
    };

    const handleRemove = (indexToRemove) => {
        setItems(items.filter((_, index) => index !== indexToRemove));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            // Mock Vision API processing time
            setTimeout(() => {
                // Mock result - simply picking a random item based on locale
                const mockResultsTW = ['拿鐵咖啡', '義大利麵', '貓咪影片', '搖滾樂團', '懸疑小說'];
                const mockResultsEN = ['Latte', 'Pasta', 'Cat Video', 'Rock Band', 'Mystery Novel'];
                const list = locale === 'zh-TW' ? mockResultsTW : mockResultsEN;
                const result = list[Math.floor(Math.random() * list.length)];
                
                setCurrentInput(result);
                setIsUploading(false);
            }, 1500);
        }
    };

    const startListen = (e) => {
        e.preventDefault();
        if (!SpeechRecognition) {
            alert("Voice input is not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = locale === 'zh-TW' ? 'cmn-Hant-TW' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setCurrentInput(transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        
        recognition.start();
    };

    const isReady = items.length >= 3;

    return (
        <div className="input-step fade-enter-active">
            <div className="glass-panel input-card">
                <h2 className="step-title">{t('input.title')}</h2>
                <p className="step-desc" dangerouslySetInnerHTML={{ __html: t('input.desc') }}></p>

                <form onSubmit={handleAdd} className="input-form">
                    <button 
                        type="button" 
                        className={`glass-button icon-btn ${isListening ? 'listening' : ''}`}
                        onClick={startListen}
                        title={t('input.voiceInput')}
                    >
                        {isListening ? '🔴' : '🎤'}
                    </button>
                    
                    <label className={`glass-button icon-btn ${isUploading ? 'listening' : ''}`} title={t('input.imageUpload')} style={{ cursor: 'pointer' }}>
                        {isUploading ? '⏳' : '📷'}
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment" 
                            onChange={handleFileUpload} 
                            style={{ display: 'none' }} 
                        />
                    </label>

                    <input
                        type="text"
                        className="glass-input"
                        placeholder={t('input.placeholder')}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                    />
                    <button type="submit" className="glass-button primary">{t('input.addButton')}</button>
                </form>

                <div className="items-list">
                    {items.map((item, index) => (
                        <div key={index} className="item-chip fade-enter-active">
                            <span>{item}</span>
                            <button
                                className="remove-btn"
                                onClick={() => handleRemove(index)}
                                aria-label="移除"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="empty-state">{t('input.empty')}</div>
                    )}
                </div>

                <div className="action-row">
                    <div className="status-text">
                        {isReady ?
                            <span style={{ color: 'var(--success)' }}>{t('input.ready')}</span> :
                            <span style={{ color: 'var(--text-muted)' }}>{t('input.needMore').replace('{count}', 3 - items.length)}</span>
                        }
                    </div>
                    <button
                        className={`glass-button primary analyze-btn ${!isReady ? 'disabled' : ''}`}
                        onClick={onNext}
                        disabled={!isReady}
                    >
                        {t('input.startAnalyze')} {isReady && '→'}
                    </button>
                </div>
            </div>
        </div>
    );
}
