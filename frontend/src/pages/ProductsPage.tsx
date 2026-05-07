import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';
import { cache } from '../utils/cache';

const PageContainer = styled.div`
  padding-top: 2rem;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  border: 1px solid ${props => props.active ? 'var(--text-primary)' : 'var(--border-color)'};
  background: ${props => props.active ? 'var(--text-primary)' : 'var(--bg-primary)'};
  color: ${props => props.active ? 'var(--bg-primary)' : 'var(--text-primary)'};
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    border-color: var(--text-primary);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
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

const ProductsPage: React.FC = () => {
  const { type } = useParams();
  const { t } = useTranslate();
  // Мгновенно берем данные из кэша (если есть)
  const [products, setProducts] = useState<any[]>(() => {
    const cacheKey = `products_${type || 'all'}`;
    const cached = cache.get(cacheKey);
    return cached || [];
  });
  const [loading, setLoading] = useState(products.length === 0);
  const [filter, setFilter] = useState(type || 'all');

  useEffect(() => {
    // Если данных нет в кэше или фильтр изменился - загружаем
    const cacheKey = `products_${filter}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      setProducts(cached);
      setLoading(false);
    } else {
      fetchProducts();
    }
  }, [filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const cacheKey = `products_${filter}`;
      let url = `${API_URL}/products/`;
      const params: any = {};
      if (filter !== 'all') {
        params.type = filter;
      }
      
      const response = await axios.get(url, { params });
      cache.set(cacheKey, response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: t('products.allProducts') },
    { id: 'headphone', name: t('products.headphones') },
    { id: 'speaker', name: t('products.speakers') },
    { id: 'audio', name: t('products.audioSpeakers') },
  ];

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Title>{t('products.title')}</Title>
          
          <Filters>
            {categories.map(cat => (
              <FilterButton
                key={cat.id}
                active={filter === cat.id}
                onClick={() => setFilter(cat.id)}
              >
                {cat.name}
              </FilterButton>
            ))}
          </Filters>

          {products.length === 0 && loading ? (
            <Grid>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </Grid>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              {t('products.noProducts')} 🛍️
            </div>
          ) : (
            <Grid>
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          )}
        </Container>
      </PageContainer>
    </>
  );
};

export default ProductsPage;