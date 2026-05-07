import { useCallback } from 'react';

export const useCartAnimation = () => {
  const animateToCart = useCallback((sourceElement: HTMLElement, cartElement: HTMLElement) => {
    if (!sourceElement || !cartElement) return;
    
    // Получаем позиции элементов
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();
    
    // Вычисляем центр исходного элемента
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    
    // Вычисляем центр корзины
    const cartCenterX = cartRect.left + cartRect.width / 2;
    const cartCenterY = cartRect.top + cartRect.height / 2;
    
    // Создаем летящий круглый элемент
    const flyingElement = document.createElement('div');
    
    // Получаем изображение или создаем стилизованный круг
    const img = sourceElement.querySelector('img');
    
    if (img && img.src) {
      flyingElement.style.backgroundImage = `url(${img.src})`;
      flyingElement.style.backgroundSize = 'cover';
      flyingElement.style.backgroundPosition = 'center';
    } else {
      flyingElement.style.backgroundColor = '#000';
    }
    
    // Позиция в центре исходного элемента
    flyingElement.style.position = 'fixed';
    flyingElement.style.left = `${sourceCenterX - 20}px`;
    flyingElement.style.top = `${sourceCenterY - 20}px`;
    flyingElement.style.width = '40px';
    flyingElement.style.height = '40px';
    flyingElement.style.borderRadius = '50%';
    flyingElement.style.zIndex = '10000';
    flyingElement.style.pointerEvents = 'none';
    flyingElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    flyingElement.style.opacity = '0.95';
    
    // Добавляем иконку корзины внутрь
    flyingElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        background: rgba(0,0,0,0.5);
        border-radius: 50%;
      ">🛒</div>
    `;
    
    document.body.appendChild(flyingElement);
    
    // Вычисляем точное смещение до центра корзины
    const deltaX = cartCenterX - sourceCenterX;
    const deltaY = cartCenterY - sourceCenterY;
    
    // Запускаем анимацию через setTimeout для гарантии
    setTimeout(() => {
      flyingElement.style.transition = 'all 0.55s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
      flyingElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
      flyingElement.style.opacity = '0';
    }, 10);
    
    // Анимация пульсации корзины
    cartElement.style.transform = 'scale(1.2)';
    cartElement.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1)';
    
    setTimeout(() => {
      cartElement.style.transform = 'scale(1)';
    }, 200);
    
    // Второй небольшой бамп
    setTimeout(() => {
      cartElement.style.transform = 'scale(1.08)';
      setTimeout(() => {
        cartElement.style.transform = 'scale(1)';
      }, 120);
    }, 250);
    
    // Удаляем летящий элемент
    setTimeout(() => {
      if (flyingElement.parentNode) {
        flyingElement.remove();
      }
    }, 650);
    
  }, []);
  
  return { animateToCart };
};
