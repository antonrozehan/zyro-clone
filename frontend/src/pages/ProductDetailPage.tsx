import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useTranslate } from '../hooks/useTranslate';
import { cache } from '../utils/cache';

// ========== АНИМАЦИЯ ДЛЯ СКЕЛЕТОНА ==========
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ========== СТИЛИ ==========

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const ProductContainer = styled.div`
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  position: relative;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  cursor: crosshair;
`;

const MainImage = styled.img`
  width: 100%;
  display: block;
  background: var(--bg-secondary);
`;

const ZoomLens = styled.div<{ show: boolean }>`
  position: fixed;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  pointer-events: none;
  z-index: 1000;
  background-repeat: no-repeat;
  display: ${props => props.show ? 'block' : 'none'};
  background-color: white;
  background-size: 600px auto;
`;

const InfoSection = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const ProductType = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Inter', sans-serif;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const OldPriceRow = styled.span`
  font-size: 1.2rem;
  color: var(--text-secondary);
  text-decoration: line-through;
  font-family: 'Inter', sans-serif;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Stars = styled.div`
  color: #ffc107;
  font-size: 1rem;
  letter-spacing: 2px;
`;

const RatingValue = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
`;

const ReviewsCount = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
`;

const Description = styled.p`
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-family: 'Inter', sans-serif;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    background: #333;
  }
`;

const CopyLinkButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: var(--text-primary);
    background: var(--text-primary);
    color: var(--bg-primary);
  }
`;

const CopyNotification = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

const SuccessMessage = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  animation: slideIn 0.3s ease;
  z-index: 1000;
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

// Скелетоны для быстрой загрузки
const SkeletonImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 16px;
`;

const SkeletonText = styled.div<{ width?: string }>`
  height: 20px;
  width: ${props => props.width || '100%'};
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SkeletonTitle = styled.div`
  height: 32px;
  width: 80%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SkeletonPrice = styled.div`
  height: 40px;
  width: 40%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SkeletonRating = styled.div`
  height: 20px;
  width: 30%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SkeletonButton = styled.div`
  height: 50px;
  width: 100%;
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 30px;
  margin-top: 1rem;
`;

const ReviewsSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
`;

const ReviewsTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
`;

const ReviewCard = styled.div`
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ReviewAuthor = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const ReviewDate = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
`;

const ReviewRating = styled.div`
  color: #ffc107;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ReviewComment = styled.p`
  color: var(--text-primary);
  line-height: 1.5;
  margin-top: 0.5rem;
  font-family: 'Inter', sans-serif;
`;

const ReviewPhoto = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 0.75rem;
  cursor: pointer;
  border: 1px solid var(--border-color);
  
  &:hover {
    opacity: 0.9;
  }
`;

const VerifiedBadge = styled.span`
  background: #4caf50;
  color: white;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 0.5rem;
`;

const AdminReply = styled.div`
  background: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  margin-left: 1rem;
  border-left: 3px solid #4caf50;
`;

const AdminReplyText = styled.p`
  color: #333;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-style: italic;
  font-family: 'Inter', sans-serif;
`;

const AdminReplyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2e7d32;
  font-family: 'Inter', sans-serif;
`;

const ReplyDate = styled.span`
  font-size: 0.7rem;
  color: #888;
  margin-left: 0.5rem;
  font-weight: normal;
`;

const ReviewForm = styled.form`
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  color: var(--text-primary);
`;

const StarSelect = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  span {
    font-size: 1.5rem;
    cursor: pointer;
    color: #ddd;
    transition: color 0.2s;
    
    &.active { color: #ffc107; }
    &:hover { color: #ffc107; }
  }
`;

const ReviewInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

// НОВЫЕ СТИЛИ ДЛЯ КРАСИВОЙ КНОПКИ ВЫБОРА ФАЙЛА
const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FileInputLabel = styled.label`
  background: #000;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
  
  &:hover {
    background: #333;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
`;

const PhotoPreviewWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const RemovePhotoBtn = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    background: #cc0000;
  }
`;

const SubmitReviewButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  font-family: 'Inter', sans-serif;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 3rem;
  color: red;
  font-family: 'Inter', sans-serif;
`;

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified: boolean;
  admin_reply?: string;
  admin_reply_date?: string;
  is_approved: boolean;
  photo?: string;
  photo_url?: string;
}

const renderStars = (rating: number | undefined) => {
  if (!rating || rating < 0) return '☆☆☆☆☆';
  const fullStars = Math.floor(rating);
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  for (let i = stars.length; i < 5; i++) stars += '☆';
  return stars;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const API_URL = 'https://zyro-backend-e9i6.onrender.com/api';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    user_name: '',
    rating: 5,
    comment: '',
    photo: null as File | null
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [backgroundPos, setBackgroundPos] = useState('0% 0%');
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Мультиязычные тексты для отзывов
  const reviewTexts = {
    ru: {
      writeReview: '📸 Оставить отзыв с фото',
      yourName: 'Ваше имя',
      yourReview: 'Ваш отзыв',
      submitReview: 'Отправить отзыв',
      reviewSubmitted: 'Спасибо! Ваш отзыв отправлен',
      reviewError: 'Ошибка при отправке отзыва',
      nameRequired: 'Пожалуйста, введите ваше имя',
      reviewRequired: 'Пожалуйста, введите текст отзыва',
      noReviews: 'Пока нет отзывов. Будьте первым! 🎉',
      customerReviews: 'Отзывы покупателей',
      adminReply: 'Ответ администратора',
      verifiedPurchase: 'Подтверждённая покупка',
      photoLimit: 'Фото не должно превышать 5MB',
      chooseFile: 'Выбрать фото',
      noFileChosen: 'Файл не выбран'
    },
    en: {
      writeReview: 'Leave a review with photo',
      yourName: 'Your name',
      yourReview: 'Your review',
      submitReview: 'Submit review',
      reviewSubmitted: 'Thank you! Your review has been submitted',
      reviewError: 'Error submitting review',
      nameRequired: 'Please enter your name',
      reviewRequired: 'Please enter your review text',
      noReviews: 'No reviews yet. Be the first! 🎉',
      customerReviews: 'Customer reviews',
      adminReply: 'Admin reply',
      verifiedPurchase: 'Verified purchase',
      photoLimit: 'Photo must be less than 5MB',
      chooseFile: 'Choose photo',
      noFileChosen: 'No file chosen'
    },
    pl: {
      writeReview: 'Dodaj opinię ze zdjęciem',
      yourName: 'Twoje imię',
      yourReview: 'Twoja opinia',
      submitReview: 'Wyślij opinię',
      reviewSubmitted: 'Dziękujemy! Twoja opinia została wysłana',
      reviewError: 'Błąd podczas wysyłania opinii',
      nameRequired: 'Proszę podaj swoje imię',
      reviewRequired: 'Proszę wpisz treść opinii',
      noReviews: 'Brak opinii. Bądź pierwszy! 🎉',
      customerReviews: 'Opinie klientów',
      adminReply: 'Odpowiedź admina',
      verifiedPurchase: 'Zweryfikowany zakup',
      photoLimit: 'Zdjęcie nie może przekraczać 5MB',
      chooseFile: 'Wybierz zdjęcie',
      noFileChosen: 'Nie wybrano pliku'
    }
  };

  const getReviewText = () => {
    const lang = i18n.language;
    if (lang === 'ru') return reviewTexts.ru;
    if (lang === 'pl') return reviewTexts.pl;
    return reviewTexts.en;
  };

  const rt = getReviewText();

  useEffect(() => {
    const cachedProduct = cache.get(`product_${id}`);
    if (cachedProduct) {
      setProduct(cachedProduct);
      const approvedReviews = (cachedProduct.reviews || []).filter((r: Review) => r.is_approved);
      setReviews(approvedReviews);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products/${id}/`);
      setProduct(response.data);
      const approvedReviews = (response.data.reviews || []).filter((r: Review) => r.is_approved);
      setReviews(approvedReviews);
      setError(false);
      cache.set(`product_${id}`, response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = () => {
    if (product?.image) {
      if (product.image.startsWith('http')) return product.image;
      return `http://localhost:8000${product.image}`;
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;
    
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    if (x >= 0 && x <= width && y >= 0 && y <= height) {
      setShowZoom(true);
      const lensX = e.clientX - 75;
      const lensY = e.clientY - 75;
      setZoomPosition({ x: lensX, y: lensY });
      const percentX = (x / width) * 100;
      const percentY = (y / height) * 100;
      setBackgroundPos(`${percentX}% ${percentY}%`);
    } else {
      setShowZoom(false);
    }
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const copyProductLink = async () => {
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Press Ctrl+C to copy link');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(rt.photoLimit);
        return;
      }
      setNewReview({ ...newReview, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setNewReview({ ...newReview, photo: null });
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.user_name.trim()) {
      alert(rt.nameRequired);
      return;
    }
    
    if (!newReview.comment.trim()) {
      alert(rt.reviewRequired);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('product', product.id.toString());
      formData.append('user_name', newReview.user_name);
      formData.append('rating', newReview.rating.toString());
      formData.append('comment', newReview.comment);
      if (newReview.photo) {
        formData.append('photo', newReview.photo);
      }
      
      const response = await axios.post(`${API_URL}/reviews/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.status === 201) {
        if (response.data.is_approved) {
          setReviews([response.data, ...reviews]);
        }
        setNewReview({ user_name: '', rating: 5, comment: '', photo: null });
        setPhotoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        alert(rt.reviewSubmitted);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(rt.reviewError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !product) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <BackButton onClick={() => navigate(-1)}>← {t('common.back')}</BackButton>
          <ProductContainer>
            <ImageSection>
              <SkeletonImage />
            </ImageSection>
            <InfoSection>
              <SkeletonTitle />
              <SkeletonText width="60%" />
              <SkeletonPrice />
              <SkeletonRating />
              <SkeletonText />
              <SkeletonText width="90%" />
              <SkeletonText width="80%" />
              <SkeletonButton />
              <SkeletonButton />
            </InfoSection>
          </ProductContainer>
        </PageContainer>
      </>
    );
  }

  if (error) return <ErrorText>{t('product.notFound')}</ErrorText>;
  if (!product) return <ErrorText>{t('product.notFound')}</ErrorText>;

  const imageUrl = getImageUrl();
  const averageRating = product.average_rating || product.rating || 4.0;

  return (
    <>
      <Navbar />
      <PageContainer>
        <BackButton onClick={() => navigate(-1)}>
          ← {t('common.back')}
        </BackButton>
        
        <ProductContainer>
          <ImageSection>
            <ImageContainer 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <MainImage 
                ref={imageRef}
                src={imageUrl || 'https://via.placeholder.com/500x500?text=No+Image'} 
                alt={product.name}
                loading="lazy"
              />
            </ImageContainer>
          </ImageSection>
          
          <InfoSection>
            <ProductType>
              {product.product_type === 'headphone' && t('product.typeHeadphones')}
              {product.product_type === 'speaker' && t('product.typeSpeakers')}
              {product.product_type === 'audio' && t('product.typeAudio')}
            </ProductType>
            
            <ProductTitle>{product.name}</ProductTitle>
            
            <PriceRow>
              <CurrentPrice>${product.price}</CurrentPrice>
              {product.old_price && <OldPriceRow>${product.old_price}</OldPriceRow>}
            </PriceRow>
            
            <RatingContainer>
              <Stars>{renderStars(averageRating)}</Stars>
              <RatingValue>({averageRating.toFixed(1)})</RatingValue>
              <ReviewsCount>{product.reviews_count || reviews.length || 0} {t('product.reviews')}</ReviewsCount>
            </RatingContainer>
            
            <Description>
              {product.description || t('product.noDescription')}
            </Description>
            
            <AddToCartButton onClick={handleAddToCart}>
              {t('product.addToCart')}
            </AddToCartButton>
            
            <CopyLinkButton onClick={copyProductLink}>
              🔗 Share Product Link
            </CopyLinkButton>
          </InfoSection>
        </ProductContainer>

        <ReviewsSection>
          <ReviewsTitle>{rt.customerReviews}</ReviewsTitle>
          
          <ReviewForm onSubmit={handleSubmitReview}>
            <FormTitle>{rt.writeReview}</FormTitle>
            
            <ReviewInput
              type="text"
              placeholder={rt.yourName}
              value={newReview.user_name}
              onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
              required
            />
            
            <StarSelect>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={(hoverRating || newReview.rating) >= star ? 'active' : ''}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </StarSelect>
            
            <ReviewTextArea
              placeholder={rt.yourReview}
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            />
            
            {/* НОВАЯ КРАСИВАЯ КНОПКА ВЫБОРА ФАЙЛА */}
            <FileInputWrapper>
              <FileInputLabel>
                {rt.chooseFile}
                <HiddenFileInput 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </FileInputLabel>
              <FileName>
                {newReview.photo ? newReview.photo.name : rt.noFileChosen}
              </FileName>
            </FileInputWrapper>
            
            {photoPreview && (
              <PhotoPreviewWrapper>
                <PreviewImage src={photoPreview} alt="Preview" />
                <RemovePhotoBtn onClick={removePhoto}>✖</RemovePhotoBtn>
              </PhotoPreviewWrapper>
            )}
            
            <SubmitReviewButton type="submit" disabled={submitting}>
              {submitting ? '...' : rt.submitReview}
            </SubmitReviewButton>
          </ReviewForm>
          
          {reviews.length === 0 ? (
            <p>{rt.noReviews}</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review.id}>
                <ReviewHeader>
                  <div>
                    <ReviewAuthor>{review.user_name}</ReviewAuthor>
                    {review.is_verified && <VerifiedBadge>{rt.verifiedPurchase}</VerifiedBadge>}
                  </div>
                  <ReviewDate>{formatDate(review.created_at)}</ReviewDate>
                </ReviewHeader>
                <ReviewRating>{renderStars(review.rating)}</ReviewRating>
                <ReviewComment>{review.comment}</ReviewComment>
                
                {/* Отображение фото в отзыве */}
                {review.photo && (
                  <ReviewPhoto 
                    src={`http://localhost:8000${review.photo}`}
                    alt="Фото к отзыву"
                    onClick={() => window.open(`http://localhost:8000${review.photo}`, '_blank')}
                  />
                )}
                
                {review.admin_reply && (
                  <AdminReply>
                    <AdminReplyHeader>
                      <span>👨‍💼</span> {rt.adminReply}
                      {review.admin_reply_date && (
                        <ReplyDate>• {formatDate(review.admin_reply_date)}</ReplyDate>
                      )}
                    </AdminReplyHeader>
                    <AdminReplyText>{review.admin_reply}</AdminReplyText>
                  </AdminReply>
                )}
              </ReviewCard>
            ))
          )}
        </ReviewsSection>
      </PageContainer>
      
      <ZoomLens 
        show={showZoom}
        style={{
          left: zoomPosition.x,
          top: zoomPosition.y,
          backgroundImage: `url(${imageUrl})`,
          backgroundPosition: backgroundPos,
        }}
      />
      
      <CopyNotification show={showCopyNotification}>
        ✓ Link copied to clipboard!
      </CopyNotification>
      
      {showSuccess && (
        <SuccessMessage>
          ✓ {product.name} {t('cart.added')}
        </SuccessMessage>
      )}
    </>
  );
};

export default ProductDetailPage;