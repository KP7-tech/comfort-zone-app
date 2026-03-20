import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import './SettingsModal.css';

export default function SettingsModal({ onClose }) {
    const { t } = useTranslation();
    const [openAIKey, setOpenAIKey] = useState('');
    const [geminiKey, setGeminiKey] = useState('');

    useEffect(() => {
        setOpenAIKey(localStorage.getItem('openai_api_key') || '');
        setGeminiKey(localStorage.getItem('gemini_api_key') || '');
    }, []);

    const handleSave = () => {
        localStorage.setItem('openai_api_key', openAIKey.trim());
        localStorage.setItem('gemini_api_key', geminiKey.trim());
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content fade-enter-active">
                <div className="modal-header">
                    <h2>⚙️ API Settings (BYOK)</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <p className="settings-desc">
                        輸入您的個人 API 金鑰以解鎖無限的 AI 分析模式。若留白，應用程式將使用本機展示資料庫 (DEMO 模式)。您的金鑰僅會儲存於您的瀏覽器中。
                    </p>
                    <div className="input-group">
                        <label>Google Gemini API Key</label>
                        <input 
                            type="password" 
                            className="glass-input" 
                            placeholder="AIzaSy..." 
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>OpenAI API Key</label>
                        <input 
                            type="password" 
                            className="glass-input" 
                            placeholder="sk-..." 
                            value={openAIKey}
                            onChange={(e) => setOpenAIKey(e.target.value)}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="glass-button primary" onClick={handleSave}>儲存設定 (Save)</button>
                </div>
            </div>
        </div>
    );
}
