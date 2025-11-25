import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdRestaurantMenu, MdLockOutline, MdEmail } from 'react-icons/md'; // Ikony Material Design

// ==========================================
// 🎨 STYLES (Odwzorowanie Jetpack Compose)
// ==========================================

// Globalny styl resetujący i ustawiający czcionkę
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Montserrat', sans-serif; // Zgodne z: FontFamily(Font(R.font.montserrat...
    background-color: #F8FBF5; // Bardzo jasna zieleń, neutralne tło strony
  }
`;

// Główny kontener (Centrowanie na ekranie)
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify_content: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  
  // Ozdobny pasek na górze (nawiązanie do SnackTrackTopBarCalendar: Color(0xFFBFFF99))
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300px;
    background-color: #BFFF99;
    z-index: -1;
    clip-path: ellipse(150% 100% at 50% 0%); // Łuk na dole paska
  }
`;

// Karta logowania (Zgodne z: Card, elevation=6.dp, shape=RoundedCornerShape(16.dp))
const LoginCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); // Odpowiednik elevation 6.dp
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Logo / Nagłówek (Zgodne z Text w TopBar)
const LogoTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: black;
  margin: 0;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 30px 0;
  font-weight: 400;
`;

// Kontener na input (żeby dodać ikonkę)
const InputGroup = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #2E7D32; // Primary Green
  font-size: 20px;
`;

// Input stylizowany
const StyledInput = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px; // Miejsce na ikonkę
  border: 1px solid #E0E0E0;
  border-radius: 12px; // Trochę mniejsze zaokrąglenie niż karta
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box; // Ważne, żeby padding nie rozpychał szerokości

  &:focus {
    border-color: #2E7D32; // Zmiana koloru ramki na aktywny zielony
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

// Przycisk (Zgodne z Button w TrainingView: Color(0xFF2E7D32), RoundedCornerShape(12.dp))
const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #2E7D32;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  box-shadow: 0 4px 6px rgba(46, 125, 50, 0.3);

  &:hover {
    background-color: #1B5E20; // Ciemniejszy odcień przy hover
  }

  &:disabled {
    background-color: #A5D6A7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FFEBEE;
  color: #D32F2F; // Error Red z Material Design
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  width: 100%;
  margin-bottom: 15px;
  text-align: center;
  border: 1px solid #FFCDD2;
`;

// Kółko z ikoną
const IconCircle = styled.div`
  background-color: white;
  border-radius: 50%;
  padding: 15px;
  
  // To odsuwa ikonę od karty (dół)
  margin-bottom: 20px; 
  
  // 🔥 TO JEST FIX: Odsuwamy ikonę od góry ekranu
  margin-top: 60px; 

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1; // Upewniamy się, że jest nad tłem
`;

// ==========================================
// ⚛️ COMPONENT LOGIC
// ==========================================

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        const success = await login(email, password);
        
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                {/* Ikona nad formularzem, nawiązująca do aplikacji */}
                <IconCircle>
                    <MdRestaurantMenu size={40} color="#2E7D32" />
                </IconCircle>

                <LoginCard>
                    <LogoTitle>SnackTrack Admin</LogoTitle>
                    <Subtitle>Manage your app users & content</Subtitle>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <InputGroup>
                            <IconWrapper>
                                <MdEmail />
                            </IconWrapper>
                            <StyledInput 
                                type="email" 
                                placeholder="Admin Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <IconWrapper>
                                <MdLockOutline />
                            </IconWrapper>
                            <StyledInput 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <PrimaryButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Sign In'}
                        </PrimaryButton>
                    </form>
                </LoginCard>

                {/* Stopka - opcjonalnie */}
                <p style={{ marginTop: '30px', color: '#555', fontSize: '12px' }}>
                    &copy; 2025 Bartosz Piłka & Maciej Pietras
                </p>
            </Container>
        </>
    );
};

export default LoginPage;