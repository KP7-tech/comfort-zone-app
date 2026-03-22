import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InputStep from './components/InputStep';
import AnalyzingStep from './components/AnalyzingStep';
import StylesStep from './components/StylesStep';
import DetailsStep from './components/DetailsStep';
import SettingsModal from './components/SettingsModal';
import { analyzeInputItemsAsync, getRecommendedStylesAsync, getSpecificItemsForStyleAsync } from './utils/llmService';
import { useTranslation } from './contexts/I18nContext';
import './App.css';

function App() {
  const { t, locale, setLocale } = useTranslation();
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

  const handleStartAnalysis = async () => {
    setIsDataReady(false);
    // Show analyzing step immediately
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
        alert("分析過程發生錯誤: " + err.message);
        setStep('input');
    }
  };

  // Sync effect for deviationIndex changes on Styles step
  const [isRefreshingStyles, setIsRefreshingStyles] = useState(false);

  useEffect(() => {
    if (step === 'styles' && category && inferredSubcategory) {
        const refreshStyles = async () => {
            setIsRefreshingStyles(true);
            try {
                const styles = await getRecommendedStylesAsync(category, inferredSubcategory, deviationIndex);
                setRecommendedStyles(styles);
            } catch (err) {
                console.error("Refresh styles failed", err);
            } finally {
                setIsRefreshingStyles(false);
            }
        };
        refreshStyles();
    }
  }, [deviationIndex, step, category, inferredSubcategory]);

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
    <div className="app-container">
      <Sidebar
        deviationIndex={deviationIndex}
        setDeviationIndex={setDeviationIndex}
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
  );
}

export default App;
