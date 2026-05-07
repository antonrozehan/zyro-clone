import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Глобальные стили
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: white;
  }
  
  #root {
    width: 100%;
    min-height: 100vh;
  }
  
  .slick-slide {
    will-change: transform;
  }
  
  img {
    will-change: auto;
  }
`;

const style = document.createElement('style');
style.textContent = globalStyles;
document.head.appendChild(style);

// Начальные данные для мгновенного отображения
const initialData = {
  products: [],
  recommended: []
};

// Сохраняем в window для доступа из компонентов
(window as any).__INITIAL_DATA__ = initialData;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Асинхронно подгружаем данные в фоне
fetch('http://localhost:8000/api/recommended/')
  .then(res => res.json())
  .then(data => {
    (window as any).__INITIAL_DATA__.recommended = data;
    // Диспатчим событие обновления
    window.dispatchEvent(new Event('data-updated'));
  })
  .catch(err => console.error('Error preloading:', err));
  