import { useState } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import './StylesStep.css';

export default function StylesStep({ inferredCategory, inferredSubcategory, deviationIndex, recommendedStyles, onSelectStyle, onBack, isFetching }) {
    const { t } = useTranslation();
    const [selectedIdx, setSelectedIdx] = useState(null);

    const handleSelect = (style, idx) => {
        setSelectedIdx(idx);
        onSelectStyle(style);
    };

    return (
        <div className="styles-step fade-enter-active" style={{ position: 'relative' }}>
            {isFetching && (
                <div className="styles-loading-overlay">
                    <div className="styles-loading-box glass-panel">
                        <div className="styles-spinner" />
                        <p>搜尋中，請稍候…</p>
                    </div>
                </div>
            )}

            <div className="navigation-row">
                <button className="glass-button" onClick={onBack} disabled={isFetching}>← {t('styles.back')}</button>
            </div>

            <div className="glass-panel styles-header">
                <h2 className="step-title">目前判斷風格: {inferredSubcategory}</h2>
                <p className="step-desc" style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>
                    推薦偏離指數 {deviationIndex}% 的風格
                </p>
            </div>

            <div className="styles-grid">
                {recommendedStyles && recommendedStyles.length > 0 ? recommendedStyles.map((style, idx) => (
                    <div
                        key={idx}
                        className={`style-card glass-panel${isFetching && selectedIdx === idx ? ' style-card--loading' : ''}`}
                        onClick={() => !isFetching && handleSelect(style, idx)}
                        style={{ cursor: isFetching ? 'not-allowed' : 'pointer', opacity: isFetching && selectedIdx !== idx ? 0.5 : 1 }}
                    >
                        <div className="style-icon">{style.icon}</div>
                        <h3 className="style-name">{style.name}</h3>
                        <div className="style-score" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '4px', marginBottom: '8px' }}>
                            偏離指數: {style.score}%
                        </div>
                        <p className="style-desc">{style.description}</p>
                        <div className="hover-indicator">{isFetching && selectedIdx === idx ? '⏳' : '→'}</div>
                    </div>
                )) : (
                    <div className="empty-state">{t('styles.noRecs')}</div>
                )}
            </div>
        </div>
    );
}
