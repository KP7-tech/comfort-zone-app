import { useTranslation } from '../contexts/I18nContext';
import './Sidebar.css';

export default function Sidebar({ deviationIndex, setDeviationIndex, onRefresh, showRefresh, isRefreshing }) {
    const i18n = useTranslation();
    const t = i18n?.t || ((k) => k);

    const getIndexLabel = (val) => {
        const safeVal = Number(val) || 0;
        if (safeVal <= 20) return `0-20%: ${t('sidebar.labels.20')}`;
        if (safeVal <= 40) return `21-40%: ${t('sidebar.labels.40')}`;
        if (safeVal <= 60) return `41-60%: ${t('sidebar.labels.60')}`;
        if (safeVal <= 80) return `61-80%: ${t('sidebar.labels.80')}`;
        return `81-100%: ${t('sidebar.labels.100')}`;
    };

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo-icon text-gradient">✥</div>
                <div className="header-text">
                    <h2>{t('sidebar.title')}</h2>
                    <p className="sidebar-description">
                        {t('sidebar.description')}
                    </p>
                </div>
            </div>

            <div className="sidebar-content">
                <div className="slider-container">
                    <div className="slider-info">
                        <div className="slider-value text-gradient">{deviationIndex}%</div>
                        <div className="slider-label">{getIndexLabel(deviationIndex)}</div>
                    </div>

                    <div className="vertical-slider-wrapper">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            value={deviationIndex}
                            onChange={(e) => setDeviationIndex(parseInt(e.target.value))}
                            className="vertical-slider"
                            style={{ '--val': `${deviationIndex}%` }}
                        />

                        <div className="slider-markers">
                            <span>100%</span>
                            <span>80%</span>
                            <span>60%</span>
                            <span>40%</span>
                            <span>20%</span>
                            <span>0%</span>
                        </div>
                    </div>
                </div>

                {showRefresh && (
                    <div className="refresh-container">
                        <button 
                            className={`refresh-button glass-button ${isRefreshing ? 'spinning' : ''}`}
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            title="Refresh Results"
                        >
                            <span className="refresh-icon">↻</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
