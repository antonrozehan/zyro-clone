import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  min-height: 80vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-primary);
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const OrderSummary = styled.div`
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 16px;
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
`;

const ItemPrice = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const ItemQuantity = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: var(--text-primary);
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 2px solid var(--border-color);
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--text-primary);
`;

const PlaceOrderButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SaveCardButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background: #333;
  }
`;

const CardDetailsContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const SavedCardInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const CardText = styled.span`
  font-size: 0.9rem;
  color: var(--text-primary);
`;

const EditButton = styled.button`
  background: transparent;
  border: 1px solid var(--border-color);
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: var(--bg-primary);
  }
`;

const SuccessMessage = styled.div`
  background: #4caf50;
  color: white;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 0.5rem;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ErrorMessageStyled = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--border-color);
  }
  
  span {
    padding: 0 1rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
  }
`;

const API_URL = 'http://localhost:8000/api';

const europeanCountries = [
  { code: 'PL', name: 'Poland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);
  const [savedCard, setSavedCard] = useState({ number: '', holder: '', expiry: '' });
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    street: '',
    house_number: '',
    apartment: '',
    city: '',
    zip_code: '',
    country: 'PL',
    payment_method: 'card',
    shipping_method: 'standard',
    order_note: ''
  });
  
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    month: '',
    year: '',
    cvv: ''
  });
  
  const [cardErrors, setCardErrors] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const fullAddress = `${formData.street} ${formData.house_number}${formData.apartment ? `/${formData.apartment}` : ''}, ${formData.city}, ${formData.zip_code}`;
  
  const subtotal = getTotalPrice();
  const shippingPrice = formData.shipping_method === 'free' ? 0 : formData.shipping_method === 'express' ? 19.99 : 9.99;
  const total = subtotal + shippingPrice;
  
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    
    if (e.target.name === 'payment_method' && e.target.value === 'card') {
      setShowCardForm(true);
    } else if (e.target.name === 'payment_method') {
      setShowCardForm(false);
      setCardSaved(false);
    }
  };
  
  const handleCardChange = (e: any) => {
    let value = e.target.value;
    if (e.target.name === 'number') {
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }
    if (e.target.name === 'month') {
      value = value.replace(/\D/g, '').substring(0, 2);
      if (parseInt(value) > 12) value = '12';
    }
    if (e.target.name === 'year') {
      value = value.replace(/\D/g, '').substring(0, 2);
    }
    setCardData({ ...cardData, [e.target.name]: value });
    if (cardErrors[e.target.name]) setCardErrors({ ...cardErrors, [e.target.name]: '' });
  };
  
  const validateCard = () => {
    const newErrors: any = {};
    const cleanNumber = cardData.number.replace(/\s/g, '');
    if (!cardData.number) newErrors.number = 'Введите номер карты';
    else if (cleanNumber.length !== 16) newErrors.number = '16 цифр';
    
    if (!cardData.holder) newErrors.holder = 'Введите имя владельца';
    if (!cardData.month) newErrors.month = 'Месяц';
    if (!cardData.year) newErrors.year = 'Год';
    if (!cardData.cvv) newErrors.cvv = 'CVV код';
    else if (cardData.cvv.length < 3) newErrors.cvv = '3-4 цифры';
    
    return newErrors;
  };
  
  const handleSaveCard = () => {
    const newErrors = validateCard();
    if (Object.keys(newErrors).length > 0) {
      setCardErrors(newErrors);
      return;
    }
    
    const lastFour = cardData.number.slice(-4);
    setSavedCard({
      number: `**** ${lastFour}`,
      holder: cardData.holder.toUpperCase(),
      expiry: `${cardData.month}/${cardData.year}`
    });
    setCardSaved(true);
    setShowCardForm(false);
  };
  
  const handleEditCard = () => {
    setShowCardForm(true);
    setCardSaved(false);
    setCardData({ number: '', holder: '', month: '', year: '', cvv: '' });
  };
  
  const validate = () => {
    const newErrors: any = {};
    if (!formData.full_name) newErrors.full_name = 'Введите имя';
    if (!formData.email) newErrors.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Неверный email';
    if (!formData.phone) newErrors.phone = 'Введите телефон';
    if (!formData.street) newErrors.street = 'Улица';
    if (!formData.house_number) newErrors.house_number = 'Дом';
    if (!formData.city) newErrors.city = 'Город';
    if (!formData.zip_code) newErrors.zip_code = 'Индекс';
    return newErrors;
  };
  
  const getImageUrl = (image: any) => {
    if (image && image.startsWith('http')) return image;
    if (image) return `http://localhost:8000${image}`;
    return null;
  };
  
  const createOrder = async () => {
    const orderData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      address: fullAddress,
      city: formData.city,
      zip_code: formData.zip_code,
      country: formData.country,
      payment_method: formData.payment_method,
      shipping_method: formData.shipping_method,
      shipping_price: shippingPrice,
      subtotal: subtotal,
      total: total,
      order_note: formData.order_note,
      items: cartItems.map(item => ({
        product_id: Number(item.id),
        product_name: item.name,
        product_price: Number(item.price),
        quantity: Number(item.quantity)
      }))
    };
    
    const token = localStorage.getItem('access_token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return await axios.post(`${API_URL}/orders/`, orderData, { headers });
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (formData.payment_method === 'card' && !cardSaved) {
      setErrorMessage('Сначала сохраните данные карты');
      return;
    }
    
    setLoading(true);
    try {
      await createOrder();
      clearCart();
      navigate('/order-success');
    } catch (err: any) {
      setErrorMessage('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApplePay = async () => {
    setErrorMessage('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const orderResponse = await createOrder();
      alert(`Apple Pay\nСумма: $${total.toFixed(2)}\nЗаказ #${orderResponse.data.id} создан`);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setErrorMessage('Ошибка Apple Pay');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <Title>Оформление заказа</Title>
        
        <CheckoutContainer>
          <form onSubmit={handleSubmit}>
            {errorMessage && <ErrorMessageStyled>❌ {errorMessage}</ErrorMessageStyled>}
            
            <FormSection>
              <SectionTitle>Личные данные</SectionTitle>
              
              <FormGroup>
                <Label>Полное имя *</Label>
                <Input name="full_name" value={formData.full_name} onChange={handleChange} />
                {errors.full_name && <ErrorText>{errors.full_name}</ErrorText>}
              </FormGroup>
              
              <Row>
                <FormGroup>
                  <Label>Email *</Label>
                  <Input name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Телефон *</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                </FormGroup>
              </Row>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Адрес доставки</SectionTitle>
              
              <Row>
                <FormGroup>
                  <Label>Улица *</Label>
                  <Input name="street" value={formData.street} onChange={handleChange} />
                  {errors.street && <ErrorText>{errors.street}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Дом *</Label>
                  <Input name="house_number" value={formData.house_number} onChange={handleChange} />
                  {errors.house_number && <ErrorText>{errors.house_number}</ErrorText>}
                </FormGroup>
              </Row>
              
              <FormGroup>
                <Label>Квартира</Label>
                <Input name="apartment" value={formData.apartment} onChange={handleChange} />
              </FormGroup>
              
              <Row>
                <FormGroup>
                  <Label>Город *</Label>
                  <Input name="city" value={formData.city} onChange={handleChange} />
                  {errors.city && <ErrorText>{errors.city}</ErrorText>}
                </FormGroup>
                <FormGroup>
                  <Label>Индекс *</Label>
                  <Input name="zip_code" value={formData.zip_code} onChange={handleChange} />
                  {errors.zip_code && <ErrorText>{errors.zip_code}</ErrorText>}
                </FormGroup>
              </Row>
              
              <FormGroup>
                <Label>Страна</Label>
                <Select name="country" value={formData.country} onChange={handleChange}>
                  {europeanCountries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </Select>
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Доставка и оплата</SectionTitle>
              
              <FormGroup>
                <Label>Способ доставки</Label>
                <Select name="shipping_method" value={formData.shipping_method} onChange={handleChange}>
                  <option value="free">Бесплатно (5-7 дней)</option>
                  <option value="standard">Стандарт (3-5 дней) - $9.99</option>
                  <option value="express">Экспресс (1-2 дня) - $19.99</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Способ оплаты</Label>
                <Select name="payment_method" value={formData.payment_method} onChange={handleChange}>
                  <option value="card">Банковская карта</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Наличные при получении</option>
                  <option value="apple_pay">Apple Pay</option>
                </Select>
              </FormGroup>
              
              {showCardForm && (
                <CardDetailsContainer>
                  <FormGroup>
                    <Label>Номер карты</Label>
                    <Input name="number" value={cardData.number} onChange={handleCardChange} placeholder="1234 5678 9012 3456" maxLength={19} />
                    {cardErrors.number && <ErrorText>{cardErrors.number}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Имя владельца</Label>
                    <Input name="holder" value={cardData.holder} onChange={handleCardChange} placeholder="JOHN DOE" />
                    {cardErrors.holder && <ErrorText>{cardErrors.holder}</ErrorText>}
                  </FormGroup>
                  
                  <Row>
                    <FormGroup>
                      <Label>Месяц</Label>
                      <Input name="month" value={cardData.month} onChange={handleCardChange} placeholder="01" maxLength={2} />
                      {cardErrors.month && <ErrorText>{cardErrors.month}</ErrorText>}
                    </FormGroup>
                    <FormGroup>
                      <Label>Год</Label>
                      <Input name="year" value={cardData.year} onChange={handleCardChange} placeholder="25" maxLength={2} />
                      {cardErrors.year && <ErrorText>{cardErrors.year}</ErrorText>}
                    </FormGroup>
                    <FormGroup>
                      <Label>CVV</Label>
                      <Input name="cvv" value={cardData.cvv} onChange={handleCardChange} type="password" placeholder="123" maxLength={4} />
                      {cardErrors.cvv && <ErrorText>{cardErrors.cvv}</ErrorText>}
                    </FormGroup>
                  </Row>
                  
                  <SaveCardButton onClick={handleSaveCard}>Сохранить карту</SaveCardButton>
                </CardDetailsContainer>
              )}
              
              {cardSaved && (
                <SavedCardInfo>
                  <CardText>Карта: {savedCard.number}</CardText>
                  <CardText>Владелец: {savedCard.holder}</CardText>
                  <CardText>Срок: {savedCard.expiry}</CardText>
                  <EditButton onClick={handleEditCard}>Изменить</EditButton>
                </SavedCardInfo>
              )}
              
              <FormGroup>
                <Label>Примечание к заказу</Label>
                <TextArea name="order_note" rows={2} value={formData.order_note} onChange={handleChange} placeholder="Дополнительная информация..." />
              </FormGroup>
            </FormSection>
            
            <PlaceOrderButton type="submit" disabled={loading}>
              {loading ? 'Оформление...' : `Оформить заказ • $${total.toFixed(2)}`}
            </PlaceOrderButton>
            
            <Divider><span>или</span></Divider>
            
            <PlaceOrderButton type="button" onClick={handleApplePay} disabled={loading} style={{ background: '#000' }}>
              Оплатить Apple Pay • ${total.toFixed(2)}
            </PlaceOrderButton>
          </form>
          
          <OrderSummary>
            <SectionTitle>Ваш заказ</SectionTitle>
            {cartItems.map((item) => (
              <CartItem key={item.id}>
                <ItemImage src={getImageUrl(item.image) || 'https://via.placeholder.com/60x60'} />
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  <ItemQuantity>Кол-во: {item.quantity}</ItemQuantity>
                </ItemInfo>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </CartItem>
            ))}
            <SummaryRow><span>Товары</span><span>${subtotal.toFixed(2)}</span></SummaryRow>
            <SummaryRow><span>Доставка</span><span>${shippingPrice.toFixed(2)}</span></SummaryRow>
            <SummaryTotal><span>Итого</span><span>${total.toFixed(2)}</span></SummaryTotal>
          </OrderSummary>
        </CheckoutContainer>
      </PageContainer>
    </>
  );
};

export default CheckoutPage;