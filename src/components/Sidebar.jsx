import { useTranslation } from '../contexts/I18nContext';
import './Sidebar.css';

export default function Sidebar({ deviationIndex, setDeviationIndex }) {
    const { t } = useTranslation();

    const getIndexLabel = (val) => {
        if (val <= 20) return `0-20%: ${t('sidebar.labels.20')}`;
        if (val <= 40) return `21-40%: ${t('sidebar.labels.40')}`;
        if (val <= 60) return `41-60%: ${t('sidebar.labels.60')}`;
        if (val <= 80) return `61-80%: ${t('sidebar.labels.80')}`;
        return `81-100%: ${t('sidebar.labels.100')}`;
    };

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo-icon text-gradient">✥</div>
                <h2>{t('sidebar.title')}</h2>
                <p className="sidebar-description">
                    {t('sidebar.description')}
                </p>
            </div>

            <div className="slider-container">
                <div className="slider-value text-gradient">{deviationIndex}%</div>
                <div className="slider-label">{getIndexLabel(deviationIndex)}</div>

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
        </aside>
    );
}
