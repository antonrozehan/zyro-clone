# 🎧 Zyro Store — Audio Equipment E-commerce 👨‍💻 Author Anton Rozhan

Full-stack e-commerce website for selling headphones, speakers, and audio accessories.

## 🔗 link

- **🌐 Live demo:** https://zyro-clone-1.onrender.com
- **📹 Video demo:** [Нажми на картинку](https://youtu.be/o7iX0mr50G8)

[![Видео-демо](https://img.youtube.com/vi/o7iX0mr50G8/0.jpg)](https://youtu.be/o7iX0mr50G8)

- **💻 GitHub:** https://github.com/antonrozehan/zyro-clone

---

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Styled Components
- Axios
- React Router DOM
- i18next (multi-language support)
- React Slick (carousel)

### Backend
- Django 5 + Django REST Framework
- SQLite3
- JWT Authentication
- Google Gemini AI (chatbot)
- Cloudinary (image storage)

### Deployment
- Render (backend + frontend)

---

## ✨ Features

### 👤 User Side
- Registration & Login (JWT)
- Product catalog with filtering
- Add to cart
- Checkout process
- Photo reviews

### 🤖 AI Chatbot
- 3 languages support (English, Russian, Polish)
- Auto language detection
- Answers about products, delivery, returns
- Option to connect with operator

### 🎵 Music Player
- Vertical slide-out player
- Animated equalizer
- Volume control
- Play/Pause/Stop controls
- Playlist with 3 tracks

### 🛒 Cart & Orders
- Add/remove items
- Quantity adjustment
- Shipping method selection
- Payment options (Card, PayPal, Cash, Apple Pay)

---

## 📸 Screenshots

| Home Page | Product Catalog | Shopping Cart |
|-----------|----------------|----------------|
| ![Home](https://via.placeholder.com/300x200?text=Home) | ![Shop](https://via.placeholder.com/300x200?text=Shop) | ![Cart](https://via.placeholder.com/300x200?text=Cart) |

| Chatbot | Music Player | Checkout |
|---------|--------------|----------|
| ![Chat](https://via.placeholder.com/300x200?text=Chat) | ![Player](https://via.placeholder.com/300x200?text=Player) | ![Checkout](https://via.placeholder.com/300x200?text=Checkout) |

---

## 🚀 Local Setup

### Requirements
- Python 3.11+
- Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/antonrozehan/zyro-clone.git
cd zyro-clone

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend setup (in a new terminal)
cd frontend
npm install
npm start
