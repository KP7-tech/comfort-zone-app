import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InputStep from './components/InputStep';
import AnalyzingStep from './components/AnalyzingStep';
import StylesStep from './components/StylesStep';
import DetailsStep from './components/DetailsStep';
import SettingsModal from './components/SettingsModal';
import { analyzeInputItemsAsync, getRecommendedStylesAsync, getSpecificItemsForStyleAsync } from './utils/llmService';
import { useTranslation } from './contexts/I18nContext';
import './App.css';

/**
 * Error Boundary Component (Simple inline version)
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Critical Render Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', background: 'rgba(255,0,0,0.1)', borderRadius: '10px', margin: '20px' }}>
          <h2>發生了預料之外的錯誤</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', cursor: 'pointer' }}>重新載入頁面</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const i18n = useTranslation();
  // Safe extraction of t and locale
  const t = i18n?.t || ((k) => k);
  const locale = i18n?.locale || 'zh-TW';
  const setLocale = i18n?.setLocale || (() => {});

  const [step, setStep] = useState('input'); // input, analyzing, styles, details
  const [deviationIndex, setDeviationIndex] = useState(50); // 0 - 100
  const [items, setItems] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Analysis Results
  const [category, setCategory] = useState('');
  const [inferredSubcategory, setInferredSubcategory] = useState('');
  const [recommendedStyles, setRecommendedStyles] = useState([]);

  // Selected Style state
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [specificItems, setSpecificItems] = useState([]);

  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isRefreshingStyles, setIsRefreshingStyles] = useState(false);

  const handleStartAnalysis = async () => {
    setIsDataReady(false);
    setStep('analyzing'); 

    try {
        const analysisResult = await analyzeInputItemsAsync(items);
        
        if (analysisResult.error) {
            alert(analysisResult.error);
            setStep('input');
            return;
        }

        setCategory(analysisResult.category);
        setInferredSubcategory(analysisResult.subcategory);
        
        const styles = await getRecommendedStylesAsync(analysisResult.category, analysisResult.subcategory, deviationIndex);
        setRecommendedStyles(styles);
        setIsDataReady(true);
    } catch (err) {
        alert("分析過程發生錯誤: " + (err.message || '未知錯誤'));
        setStep('input');
    }
  };

  const handleRefreshStyles = async () => {
    if ((step === 'styles' || step === 'details') && category && inferredSubcategory) {
        setIsRefreshingStyles(true);
        if (step === 'details') setStep('styles'); // Return to style selection if refreshing from details
        try {
            const styles = await getRecommendedStylesAsync(category, inferredSubcategory, deviationIndex);
            setRecommendedStyles(styles);
        } catch (err) {
            console.error("Refresh styles failed", err);
            alert("重新整理失敗，請稍後再試。");
        } finally {
            setIsRefreshingStyles(false);
        }
    }
  };

  const handleSelectStyle = async (style) => {
    setIsFetchingDetails(true);
    try {
        const newItems = await getSpecificItemsForStyleAsync(style);
        setSpecificItems(newItems);
        setSelectedStyle(style);
        setStep('details');
    } catch (err) {
        alert("取得具體項目失敗");
    } finally {
        setIsFetchingDetails(false);
    }
  };

  const toggleLanguage = () => {
      setLocale(locale === 'zh-TW' ? 'en-US' : 'zh-TW');
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Sidebar
          deviationIndex={deviationIndex}
          setDeviationIndex={setDeviationIndex}
          onRefresh={handleRefreshStyles}
          showRefresh={step === 'styles' || step === 'details'}
          isRefreshing={isRefreshingStyles}
        />

        <main className="main-content">
          <header className="app-header">
            <div>
              <h1 className="app-title text-gradient">{t('app.title')}</h1>
              <p className="app-subtitle">{t('app.subtitle')}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="glass-button" onClick={() => setIsSettingsOpen(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} title="API Settings">
                ⚙️ Key
              </button>
              <button className="glass-button" onClick={toggleLanguage} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                {locale === 'zh-TW' ? 'EN' : '中文'}
              </button>
            </div>
          </header>

          {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}

          <div className="step-container relative-container">
            {step === 'input' && (
              <InputStep
                items={items}
                setItems={setItems}
                onNext={handleStartAnalysis}
              />
            )}

            {step === 'analyzing' && (
              <AnalyzingStep 
                isDataReady={isDataReady} 
                onFinish={() => setStep('styles')} 
              />
            )}

            {step === 'styles' && (
              <StylesStep
                inferredCategory={category}
                inferredSubcategory={inferredSubcategory}
                deviationIndex={deviationIndex}
                recommendedStyles={recommendedStyles}
                onSelectStyle={handleSelectStyle}
                onBack={() => setStep('input')}
                isFetching={isFetchingDetails || isRefreshingStyles}
              />
            )}

            {step === 'details' && (
              <DetailsStep
                category={category}
                style={selectedStyle}
                deviationIndex={deviationIndex}
                specificItems={specificItems}
                onBack={() => setStep('styles')}
              />
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
