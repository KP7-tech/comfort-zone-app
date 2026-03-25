import { useState } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import './DetailsStep.css';

export default function DetailsStep({ category, style, specificItems, onBack }) {
    const i18n = useTranslation();
    const t = i18n?.t || ((k) => k);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (e, text, idx) => {
        e.preventDefault();
        e.stopPropagation();

        const successCallback = () => {
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 2000);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(successCallback).catch(() => {
                fallbackCopy(text, successCallback);
            });
        } else {
            fallbackCopy(text, successCallback);
        }
    };

    const fallbackCopy = (text, callback) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            callback();
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    };

    const getPlatformName = (url) => {
        if (!url) return 'Link';
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes('youtube')) return 'YouTube';
        if (lowerUrl.includes('spotify')) return 'Spotify';
        if (lowerUrl.includes('apple.com')) return 'Apple Music';
        if (lowerUrl.includes('netflix')) return 'Netflix';
        if (lowerUrl.includes('disneyplus') || lowerUrl.includes('disney+')) return 'Disney+';
        if (lowerUrl.includes('twitch')) return 'Twitch';
        if (lowerUrl.includes('instagram')) return 'Instagram';
        if (lowerUrl.includes('tiktok')) return 'TikTok';
        if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'X';
        if (lowerUrl.includes('behance')) return 'Behance';
        if (lowerUrl.includes('adobeportfolio')) return 'Portfolio';
        if (lowerUrl.includes('github')) return 'GitHub';
        if (lowerUrl.includes('google')) return 'Google';
        if (lowerUrl.includes('dmm.co.jp')) return 'DMM/FANZA';
        if (lowerUrl.includes('r18.com')) return 'R18';
        if (lowerUrl.includes('iafd.com')) return 'IAFD';
        if (lowerUrl.includes('pornhub')) return 'Pornhub';
        if (lowerUrl.includes('s1s1s1')) return 'S1';
        if (lowerUrl.includes('faleno')) return 'FALENO';
        if (lowerUrl.includes('kink')) return 'Kink.com';
        return 'Link';
    };

    const CopyIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    );

    const CheckIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );

    return (
        <div className="details-step fade-enter-active">
            <div className="navigation-row">
                <button className="glass-button" onClick={onBack}>← {t('details.backToStyles')}</button>
                <button className="glass-button" onClick={() => window.location.reload()}>{t('details.reset')}</button>
            </div>

            <div className="glass-panel details-header">
                <div className="style-icon-large">{style.icon}</div>
                <h2 className="step-title text-gradient">{style.name}</h2>
                <p className="step-desc">{style.description}</p>
            </div>

            <div className="items-list-container">
                <h3 className="list-title">{t('details.desc').replace('{style}', style.name)}</h3>
                <div className="items-grid">
                    {specificItems.map((item, idx) => {
                        const isRClass = !item.url && !item.links && !item.description;
                        return isRClass ? (
                            <div key={idx} className="glass-panel detail-item-card detail-item-card--rclass">
                                <div className="item-content" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h4 className="item-name item-name--id">{item.name}</h4>
                                    <button
                                        className={`copy-btn-icon ${copiedIndex === idx ? 'copied' : ''}`}
                                        onClick={(e) => handleCopy(e, item.name, idx)}
                                        title={t('details.copy')}
                                    >
                                        {copiedIndex === idx ? <CheckIcon /> : <CopyIcon />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div key={idx} className="glass-panel detail-item-card">
                                <div className="item-content">
                                    <div className="item-header">
                                        <h4 className="item-name">{item.name}</h4>
                                        <button
                                            className={`copy-btn-icon ${copiedIndex === idx ? 'copied' : ''}`}
                                            onClick={(e) => handleCopy(e, item.name, idx)}
                                            title={t('details.copy')}
                                        >
                                            {copiedIndex === idx ? <CheckIcon /> : <CopyIcon />}
                                        </button>
                                    </div>
                                    <p className="item-desc">{item.description}</p>
                                </div>
                                <div className="action-group">
                                    {item.links && item.links.map((link, lIdx) => (
                                        <a
                                            key={lIdx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-btn glass-button minimal"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            ↗ {link.platform || getPlatformName(link.url)}
                                        </a>
                                    ))}
                                    {!item.links && item.url && (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-btn glass-button minimal"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            ↗ {getPlatformName(item.url)}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}
