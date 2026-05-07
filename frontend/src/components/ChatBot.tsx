import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useTranslate } from '../hooks/useTranslate';

const bounceIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #000;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: all 0.3s;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1);
    background: #333;
  }
`;

const ChatWindow = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 380px;
  height: 550px;
  background: var(--bg-primary);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  animation: ${bounceIn} 0.3s ease;
  
  @media (max-width: 480px) {
    width: calc(100vw - 40px);
    right: 20px;
    left: 20px;
  }
`;

const ChatHeader = styled.div`
  background: #000;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AIButton = styled.button<{ isAI: boolean }>`
  background: ${props => props.isAI ? '#2196f3' : 'rgba(255,255,255,0.2)'};
  border: none;
  color: white;
  font-size: 11px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isAI ? '#1976d2' : 'rgba(255,255,255,0.3)'};
  }
`;

const OperatorButton = styled.button<{ isOperatorMode: boolean }>`
  background: ${props => props.isOperatorMode ? '#4caf50' : 'rgba(255,255,255,0.2)'};
  border: none;
  color: white;
  font-size: 11px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.isOperatorMode ? '#45a049' : 'rgba(255,255,255,0.3)'};
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--bg-secondary);
`;

const MessageBubble = styled.div<{ isUser: boolean; isOperator?: boolean; isAi?: boolean }>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => {
    if (props.isUser) return '#000';
    if (props.isOperator) return '#4caf50';
    if (props.isAi) return '#2196f3';
    return 'var(--bg-primary)';
  }};
  color: ${props => props.isUser ? '#fff' : 'var(--text-primary)'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  border: ${props => !props.isUser && !props.isOperator && !props.isAi ? '1px solid var(--border-color)' : 'none'};
`;

const MessageText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
`;

const MessageTime = styled.span<{ isUser: boolean }>`
  font-size: 0.65rem;
  color: ${props => props.isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)'};
  margin-top: 4px;
  display: block;
`;

const MessageBadge = styled.span`
  font-size: 0.6rem;
  margin-left: 6px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(0,0,0,0.1);
`;

const ChatInput = styled.div`
  padding: 16px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  font-size: 0.9rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const SendButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #333;
  }
`;

const QuickQuestions = styled.div`
  padding: 12px 16px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickButton = styled.button`
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
  
  &:hover {
    background: var(--bg-primary);
    border-color: #999;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px 14px;
  background: var(--bg-primary);
  border-radius: 18px;
  align-self: flex-start;
  border: 1px solid var(--border-color);
  
  span {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: bounce 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  
  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
`;

const API_URL = 'http://localhost:8000/api';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isOperator?: boolean;
  isAi?: boolean;
  time: string;
}

const ChatBot: React.FC = () => {
  const { t, i18n } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOperatorMode, setIsOperatorMode] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [sessionId, setSessionId] = useState<string>(() => {
    return localStorage.getItem('chat_session_id') || Math.random().toString(36).substring(7);
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('chat.welcome'),
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('chat_session_id', sessionId);
    scrollToBottom();
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: t('chat.welcome'),
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsOperatorMode(false);
  };

  const switchToOperator = async () => {
    setIsOperatorMode(true);
    setIsTyping(true);
    
    try {
      await axios.post(`${API_URL}/chat/switch-to-operator/`, { session_id: sessionId });
      
      const operatorMsg: Message = {
        id: messages.length + 1,
        text: "👨‍💼 Оператор подключен. Чем могу помочь?",
        isUser: false,
        isOperator: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, operatorMsg]);
    } catch (error) {
      console.error('Error switching to operator:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessageToBot = async (message: string) => {
    const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg: Message = {
      id: messages.length + 1,
      text: message,
      isUser: true,
      time: messageTime
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsTyping(true);
    
    try {
      const response = await axios.post(`${API_URL}/chat/`, {
        message: message,
        user_name: 'Guest',
        session_id: sessionId,
        is_operator_mode: isOperatorMode,
        use_ai: useAI
      });
      
      setIsTyping(false);
      
      const botMsg: Message = {
        id: messages.length + 2,
        text: response.data.response,
        isUser: false,
        isOperator: isOperatorMode,
        isAi: !isOperatorMode && useAI,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMsg: Message = {
        id: messages.length + 2,
        text: t('chat.error'),
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    await sendMessageToBot(inputMessage.trim());
    setInputMessage('');
  };

  const handleQuickQuestion = (question: string) => {
    if (question === "Хочу поговорить с оператором" || question === "I want to talk to an operator" || question === "Chcę porozmawiać z operatorem") {
      switchToOperator();
    } else {
      sendMessageToBot(question);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getQuickQuestions = () => {
    const lang = i18n.language;
    if (isOperatorMode) {
      return [
        { text: "📞 Позвонить", question: "Можно ли получить консультацию по телефону?" },
        { text: "🚚 Статус заказа", question: "Где мой заказ?" },
        { text: "🔄 Возврат", question: "Как оформить возврат?" },
        { text: "💰 Скидка", question: "Могу ли я получить скидку?" },
      ];
    }
    
    if (lang === 'ru') {
      return [
        { text: "💰 Цены", question: "Какие у вас цены?" },
        { text: "🚚 Доставка", question: "Как осуществляется доставка?" },
        { text: "✅ Возврат", question: "Можно ли вернуть товар?" },
        { text: "🎧 Наушники", question: "Какие наушники у вас есть?" },
        { text: "👨‍💼 Оператор", question: "Хочу поговорить с оператором" },
      ];
    } else if (lang === 'pl') {
      return [
        { text: "💰 Ceny", question: "Jakie są ceny?" },
        { text: "🚚 Dostawa", question: "Jak wygląda dostawa?" },
        { text: "✅ Zwroty", question: "Czy można zwrócić produkt?" },
        { text: "🎧 Słuchawki", question: "Jakie słuchawki macie?" },
        { text: "👨‍💼 Operator", question: "Chcę porozmawiać z operatorem" },
      ];
    }
    return [
      { text: "💰 Prices", question: "What are your prices?" },
      { text: "🚚 Delivery", question: "How does delivery work?" },
      { text: "✅ Returns", question: "Can I return a product?" },
      { text: "🎧 Headphones", question: "What headphones do you have?" },
      { text: "👨‍💼 Operator", question: "I want to talk to an operator" },
    ];
  };

  const quickQuestions = getQuickQuestions();
  const welcomeMsg = t('chat.welcome');
  const unreadCount = messages.filter(m => !m.isUser && m.id > 1 && m.text !== welcomeMsg).length;

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)}>
        💬
        {unreadCount > 0 && !isOpen && (
          <span style={{
            position: 'absolute',
            top: -5,
            right: -5,
            background: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </ChatButton>
      
      <ChatWindow isOpen={isOpen}>
        <ChatHeader>
          <ChatTitle>
            💬 Zyro Support
          </ChatTitle>
          <HeaderButtons>
            <AIButton 
              onClick={() => setUseAI(!useAI)} 
              isAI={useAI}
              title={useAI ? 'Отключить AI' : 'Включить AI'}
            >
              {useAI ? '🤖 AI' : '📝 Обычный'}
            </AIButton>
            <OperatorButton 
              onClick={switchToOperator} 
              isOperatorMode={isOperatorMode}
              title="Связаться с оператором"
            >
              {isOperatorMode ? '👨‍💼 Оператор' : '👨‍💼 Связаться'}
            </OperatorButton>
            <IconButton onClick={clearChat} title={t('chat.clear')}>
              🗑️
            </IconButton>
            <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
          </HeaderButtons>
        </ChatHeader>
        
        <ChatMessages>
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              isUser={msg.isUser} 
              isOperator={msg.isOperator}
              isAi={msg.isAi}
            >
              <MessageText>{msg.text}</MessageText>
              {msg.isOperator && <MessageBadge>Оператор</MessageBadge>}
              {msg.isAi && !msg.isOperator && !msg.isUser && <MessageBadge>AI Ассистент</MessageBadge>}
              <MessageTime isUser={msg.isUser}>{msg.time}</MessageTime>
            </MessageBubble>
          ))}
          {isTyping && (
            <TypingIndicator>
              <span></span>
              <span></span>
              <span></span>
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <QuickQuestions>
          {quickQuestions.map((q, index) => (
            <QuickButton key={index} onClick={() => handleQuickQuestion(q.question)}>
              {q.text}
            </QuickButton>
          ))}
        </QuickQuestions>
        
        <ChatInput>
          <Input
            ref={inputRef}
            type="text"
            placeholder={t('chat.placeholder')}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton onClick={sendMessage}>
            ➤
          </SendButton>
        </ChatInput>
      </ChatWindow>
    </>
  );
};

export default ChatBot;