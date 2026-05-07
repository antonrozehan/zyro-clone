import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useTranslation } from 'react-i18next';

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: var(--bg-secondary);
  padding: 2.5rem;
  border-radius: 24px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? '#000' : 'transparent'};
  transition: all 0.3s;
  
  &:hover {
    color: var(--text-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 0.5rem;
  
  &:hover {
    background: #333;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SuccessText = styled.p`
  color: #27ae60;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  
  a {
    color: #000;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(loginData.username, loginData.password);
      navigate('/account');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || t('auth.errors.loginFailed');
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setError(t('auth.errors.passwordsMatch'));
      return;
    }
    
    if (registerData.password.length < 6) {
      setError(t('auth.errors.passwordMinLength'));
      return;
    }
    
    setLoading(true);
    
    try {
      await register(registerData.username, registerData.email, registerData.password);
      setSuccess(t('auth.success.registration'));
      setTimeout(() => navigate('/account'), 1500);
    } catch (err: any) {
      let errorMsg = t('auth.errors.registrationFailed');
      if (err.response?.data?.error?.includes('username')) {
        errorMsg = t('auth.errors.usernameExists');
      } else if (err.response?.data?.error?.includes('email')) {
        errorMsg = t('auth.errors.emailExists');
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Card>
            <Title>{t('auth.title')}</Title>
            <Subtitle>{t('auth.subtitle')}</Subtitle>
            
            <Tabs>
              <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
                {t('auth.signIn')}
              </Tab>
              <Tab active={activeTab === 'register'} onClick={() => setActiveTab('register')}>
                {t('auth.signUp')}
              </Tab>
            </Tabs>
            
            {error && <ErrorText>{error}</ErrorText>}
            {success && <SuccessText>{success}</SuccessText>}
            
            {activeTab === 'login' ? (
              <Form onSubmit={handleLogin}>
                <Input
                  type="text"
                  placeholder={t('auth.login.username')}
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                />
                <Input
                  type="password"
                  placeholder={t('auth.login.password')}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? t('auth.login.loading') : t('auth.login.button')}
                </Button>
              </Form>
            ) : (
              <Form onSubmit={handleRegister}>
                <Input
                  type="text"
                  placeholder={t('auth.register.username')}
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder={t('auth.register.email')}
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
                <Input
                  type="password"
                  placeholder={t('auth.register.password')}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
                <Input
                  type="password"
                  placeholder={t('auth.register.confirmPassword')}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? t('auth.register.loading') : t('auth.register.button')}
                </Button>
              </Form>
            )}
            
            <FooterText>
              {activeTab === 'login' ? (
                <>{t('auth.login.noAccount')} <Link to="#" onClick={() => setActiveTab('register')}>{t('auth.signUp')}</Link></>
              ) : (
                <>{t('auth.register.haveAccount')} <Link to="#" onClick={() => setActiveTab('login')}>{t('auth.signIn')}</Link></>
              )}
            </FooterText>
          </Card>
        </Container>
      </PageContainer>
    </>
  );
};

export default AuthPage;