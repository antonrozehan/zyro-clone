import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Slider from 'react-slick';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// ========== СТИЛИ ==========

const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  overflow: hidden;
  width: 100%;
  background-image: url('http://localhost:8000/media/hero/homePage.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: white;
  font-family: 'Inter', sans-serif;
  
  br {
    display: block;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SoundWaves = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2px;
  width: 100%;
  padding: 0;
  margin: 0;
`;

const SoundBar = styled.div<{ height: number; delay: number }>`
  width: 8px;
  height: ${props => props.height}px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px 4px 0 0;
  animation: bounce 0.8s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  flex: 1;
  max-width: 10px;
  
  @keyframes bounce {
    0%, 100% {
      height: ${props => props.height}px;
    }
    50% {
      height: ${props => props.height + 20}px;
    }
  }
`;

const Section = styled.section`
  padding: 2rem 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background: var(--bg-primary);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const CarouselContainer = styled.div`
  position: relative;
  padding: 0 20px;
  
  .slick-slide {
    padding: 0 10px;
  }
  .slick-dots {
    display: none !important;
  }
  
  .slick-list {
    overflow: hidden;
  }
  
  .slick-track {
    display: flex;
  }
  
  .slick-prev,
  .slick-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 36px;
    height: 36px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    
    &:before {
      font-size: 18px;
      color: #000;
      opacity: 1;
    }
    
    &:hover {
      background: #f0f0f0;
    }
  }
  
  .slick-prev {
    left: -10px;
  }
  
  .slick-next {
    right: -10px;
  }
  
  .slick-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CategoriesSection = styled.section`
  padding: 2rem 0;
  background: var(--bg-secondary);
  width: 100%;
`;

const CategoriesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const CategoriesHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const CategoriesTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCardWrapper = styled.div`
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  aspect-ratio: 672 / 320;
  object-fit: cover;
`;

const CategoryContent = styled.div`
  padding: 1rem;
  text-align: center;
`;

const CategoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const CategorySize = styled.p`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
`;

const ShopButton = styled.button`
  background: transparent;
  border: 1px solid var(--text-primary);
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
  
  &:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
  }
`;

const WhySection = styled.section`
  padding: 2rem 0 0 0;
  background: var(--bg-primary);
  width: 100%;
  overflow-x: hidden;
`;

const WhyTextContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 2rem;
`;

const WhyTextRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const WhyTitleStyled = styled.h2`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.2;
  flex: 1;
  font-family: 'Inter', sans-serif;
`;

const WhyRightContent = styled.div`
  flex: 1;
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const BenefitText = styled.div`
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
`;

const PromiseTextStyled = styled.div`
  margin-top: 1rem;
`;

const PromiseParagraphStyled = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
`;

const WhyImageFullWidth = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  
  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`;

// Простой скелетон-карточка для мгновенного отображения
const SkeletonCardWrapper = styled.div`
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  height: 280px;
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const SkeletonCard: React.FC = () => <SkeletonCardWrapper />;

const API_URL = 'https://zyro-backend-e9i6.onrender.com/api';

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } }
  ]
};

const SoundWaveAnimation: React.FC = () => {
  const bars = [];
  for (let i = 0; i < 120; i++) {
    const height = 15 + Math.random() * 50;
    bars.push({ height, delay: i * 0.02 });
  }
  
  return (
    <SoundWaves>
      {bars.map((bar, index) => (
        <SoundBar key={index} height={bar.height} delay={bar.delay} />
      ))}
    </SoundWaves>
  );
};

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========
const HomePage: React.FC = () => {
  const { t } = useTranslate();
  // Мгновенно берем данные из глобального хранилища (если есть)
  const [recommended, setRecommended] = useState<any[]>(() => {
    const initialData = (window as any).__INITIAL_DATA__;
    return initialData?.recommended || [];
  });
  const [isDataReady, setIsDataReady] = useState(recommended.length > 0);

  useEffect(() => {
    // Если данных нет - загружаем
    if (recommended.length === 0) {
      fetchRecommended();
    }
    
    // Слушаем событие обновления данных из index.tsx
    const handleDataUpdate = () => {
      const newData = (window as any).__INITIAL_DATA__?.recommended;
      if (newData && newData.length > 0) {
        setRecommended(newData);
        setIsDataReady(true);
      }
    };
    
    window.addEventListener('data-updated', handleDataUpdate);
    return () => window.removeEventListener('data-updated', handleDataUpdate);
  }, []);

  const fetchRecommended = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommended/`);
      setRecommended(response.data);
      setIsDataReady(true);
      // Обновляем глобальное хранилище
      if ((window as any).__INITIAL_DATA__) {
        (window as any).__INITIAL_DATA__.recommended = response.data;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsDataReady(true);
    }
  };

  const categories = [
    {
      title: t('categories.headphones'),
      size: "",
      imageUrl: "http://localhost:8000/media/categories/headphones.png",
      type: "headphone"
    },
    {
      title: t('categories.speakers'),
      size: "",
      imageUrl: "http://localhost:8000/media/categories/speakers.png",
      type: "speaker"
    },
    {
      title: t('categories.audioSunglasses'),
      size: "",
      imageUrl: "http://localhost:8000/media/categories/sunglasses.png",
      type: "audio"
    }
  ];

  return (
    <>
      <HeroSection>
        <Navbar />
        <HeroContent>
          <HeroTitle dangerouslySetInnerHTML={{ __html: t('home.title') }} />
        </HeroContent>
        <SoundWaveAnimation />
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>{t('home.recommended')}</SectionTitle>
        </SectionHeader>
        <CarouselContainer>
          <Slider {...sliderSettings}>
            {recommended.length > 0 ? (
              recommended.map((product: any) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              // Мгновенно показываем скелетоны, пока грузятся данные
              [1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <SkeletonCard />
                </div>
              ))
            )}
          </Slider>
        </CarouselContainer>
      </Section>

      <CategoriesSection>
        <CategoriesContainer>
          <CategoriesHeader>
            <CategoriesTitle>{t('home.browse')}</CategoriesTitle>
          </CategoriesHeader>
          
          <CategoryGrid>
            {categories.map((cat, index) => (
              <CategoryCardWrapper key={index}>
                <CategoryImage src={cat.imageUrl} alt={cat.title} />
                <CategoryContent>
                  <CategoryTitle>{cat.title}</CategoryTitle>
                  {cat.size && <CategorySize>{cat.size}</CategorySize>}
                  <ShopButton>{t('common.shopNow')} →</ShopButton>
                </CategoryContent>
              </CategoryCardWrapper>
            ))}
          </CategoryGrid>
        </CategoriesContainer>
      </CategoriesSection>

      <WhySection>
        <WhyTextContainer>
          <WhyTextRow>
            <WhyTitleStyled dangerouslySetInnerHTML={{ __html: t('home.whyBuy') }} />
            
            <WhyRightContent>
              <BenefitsList>
                <BenefitText>{t('home.benefits.shipping')}</BenefitText>
                <BenefitText>{t('home.benefits.trial')}</BenefitText>
                <BenefitText>{t('home.benefits.service')}</BenefitText>
                <BenefitText>{t('home.benefits.account')}</BenefitText>
              </BenefitsList>
              
              <PromiseTextStyled>
                <PromiseParagraphStyled>
                  {t('home.promise')}
                </PromiseParagraphStyled>
                <PromiseParagraphStyled>
                  {t('home.promise2')}
                </PromiseParagraphStyled>
              </PromiseTextStyled>
            </WhyRightContent>
          </WhyTextRow>
        </WhyTextContainer>
        
        <WhyImageFullWidth>
          <img 
            src="http://localhost:8000/media/why-section/girl.png" 
            alt="Girl with headphones"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/1920x600?text=Photo';
            }}
          />
        </WhyImageFullWidth>
      </WhySection>
    </>
  );
};

export default HomePage;