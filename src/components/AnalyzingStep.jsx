import { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/I18nContext';
import './AnalyzingStep.css';

export default function AnalyzingStep({ onComplete }) {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // AI processing simulation (stalls at 95% until real data arrives)
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 95) {
                    return 95;
                }
                return p + Math.floor(Math.random() * 15) + 5;
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="analyzing-step fade-enter-active">
            <div className="glass-panel analyze-card">
                <div className="cube-loader">
                    <div className="cube cube1"></div>
                    <div className="cube cube2"></div>
                    <div className="cube cube3"></div>
                    <div className="cube cube4"></div>
                </div>

                <h2 className="text-gradient pulse-text">{t('analyzing.title')}</h2>
                <p className="analyze-desc">{t('analyzing.status')}</p>

                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>
                <div className="progress-text">{Math.min(progress, 100)}%</div>
            </div>
        </div>
    );
}
