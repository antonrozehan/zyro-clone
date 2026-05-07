import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';

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

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: var(--text-primary);
    }
  }
  
  span {
    color: var(--text-secondary);
  }
  
  .current {
    color: var(--text-primary);
    font-weight: 500;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const LogoutButton = styled.button`
  padding: 0.6rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s;
  font-size: 0.85rem;
  font-weight: 500;
  
  &:hover {
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  
  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.8rem;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
`;

const ProfileEmail = styled.p`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
`;

const ProfileSince = styled.p`
  font-size: 0.7rem;
  color: var(--text-secondary);
  opacity: 0.7;
`;

const EditButton = styled.button`
  padding: 0.5rem 1.2rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--text-primary);
  transition: all 0.3s;
  
  &:hover {
    border-color: var(--text-primary);
    background: var(--text-primary);
    color: var(--bg-primary);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
  
  &:hover {
    border-color: var(--text-primary);
    transform: translateY(-2px);
  }
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.8rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--text-primary)' : 'transparent'};
  transition: all 0.3s;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const OrdersTable = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
`;

const OrderHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1.5fr 0.5fr;
  padding: 1rem 1.25rem;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const OrderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1.5fr 0.5fr;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  transition: background 0.3s;
  font-size: 0.85rem;
  
  &:hover {
    background: var(--bg-primary);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    padding: 1rem;
  }
`;

const OrderNumber = styled(Link)`
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  font-family: monospace;
  
  &:hover {
    text-decoration: underline;
  }
`;

const OrderStatus = styled.span<{ status: string }>`
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
  background: ${props => {
    switch (props.status) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
  
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  
  h3 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  p {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
  
  a {
    color: var(--text-primary);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    border-bottom: 1px solid var(--text-primary);
    
    &:hover {
      opacity: 0.7;
    }
  }
`;

const SettingsForm = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-color);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.8rem;
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: var(--text-primary);
  }
`;

const SaveButton = styled.button`
  padding: 0.8rem 2rem;
  background: var(--text-primary);
  color: var(--bg-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const API_URL = 'http://localhost:8000/api';

const AccountPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [settings, setSettings] = useState({
    username: '',
    email: '',
  });

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    fetchOrders();
    if (user) {
      setSettings({
        username: user.username,
        email: user.email,
      });
    }
    
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, user, fetchOrders]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('account.settings.save'));
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum: number, order: any) => {
    const total = typeof order.total === 'number' ? order.total : Number(order.total) || 0;
    return sum + total;
  }, 0);
  const completedOrders = orders.filter((o: any) => o.status === 'delivered').length;
  const inProgress = orders.filter((o: any) => o.status === 'processing' || o.status === 'shipped').length;
  const safeTotalSpent = typeof totalSpent === 'number' ? totalSpent : 0;
  
  const memberSince = (user as any)?.date_joined 
    ? new Date((user as any).date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  if (!user) return null;

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Breadcrumb>
            <Link to="/">{t('nav.home')}</Link>
            <span>/</span>
            <span className="current">{t('account.title')}</span>
          </Breadcrumb>
          
          <Header>
            <Title>{t('account.title')}</Title>
            <LogoutButton onClick={handleLogout}>{t('account.signOut')}</LogoutButton>
          </Header>
          
          <ProfileCard>
            <Avatar>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <ProfileInfo>
              <ProfileName>{user.username}</ProfileName>
              <ProfileEmail>{user.email}</ProfileEmail>
              <ProfileSince>{t('account.profile.joined')} {memberSince}</ProfileSince>
            </ProfileInfo>
            <EditButton>{t('account.profile.edit')}</EditButton>
          </ProfileCard>
          
          <StatsGrid>
            <StatCard>
              <StatValue>{totalOrders}</StatValue>
              <StatLabel>{t('account.stats.orders')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>${safeTotalSpent.toFixed(2)}</StatValue>
              <StatLabel>{t('account.stats.spent')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{completedOrders}</StatValue>
              <StatLabel>{t('account.stats.completed')}</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{inProgress}</StatValue>
              <StatLabel>{t('account.stats.inProgress')}</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <Tabs>
            <Tab active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
              {t('account.tabs.orders')}
            </Tab>
            <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
              {t('account.tabs.settings')}
            </Tab>
          </Tabs>
          
          {activeTab === 'orders' ? (
            loading ? (
              <EmptyState>
                <h3>{t('common.loading')}...</h3>
              </EmptyState>
            ) : orders.length === 0 ? (
              <EmptyState>
                <h3>{t('account.orders.empty')}</h3>
                <p>{t('account.orders.emptyDesc')}</p>
                <Link to="/products">{t('account.orders.browseProducts')}</Link>
              </EmptyState>
            ) : (
              <OrdersTable>
                <OrderHeader>
                  <div>{t('account.orders.order')}</div>
                  <div>{t('account.orders.date')}</div>
                  <div>{t('account.orders.total')}</div>
                  <div>{t('account.orders.status')}</div>
                  <div></div>
                </OrderHeader>
                {orders.map((order: any) => (
                  <OrderRow key={order.id}>
                    <OrderNumber to={`/order/${order.id}`}>#{order.id}</OrderNumber>
                    <div>{new Date(order.created_at).toLocaleDateString()}</div>
                    <div>${typeof order.total === 'number' ? order.total.toFixed(2) : Number(order.total)?.toFixed(2) || '0.00'}</div>
                    <div><OrderStatus status={order.status || 'pending'}>{(order.status || 'pending').toUpperCase()}</OrderStatus></div>
                    <div style={{ textAlign: 'right' }}>→</div>
                  </OrderRow>
                ))}
              </OrdersTable>
            )
          ) : (
            <SettingsForm>
              <form onSubmit={handleSaveSettings}>
                <FormGroup>
                  <Label>{t('account.settings.username')}</Label>
                  <Input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>{t('account.settings.email')}</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </FormGroup>
                <SaveButton type="submit">{t('account.settings.save')}</SaveButton>
              </form>
            </SettingsForm>
          )}
        </Container>
      </PageContainer>
    </>
  );
};

export default AccountPage;