import React from 'react';
import styled from 'styled-components';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// Upewnij się, że import jest w jednej linii i zawiera MdDirectionsRun
import { 
    MdDashboard, 
    MdPeople, 
    MdFitnessCenter, 
    MdWarning, 
    MdNotifications, 
    MdLogout, 
    MdDirectionsRun 
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

// --- STYLES ---

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: white; 
  overflow: hidden;
`;

const SidebarContainer = styled.aside`
  width: 260px;
  min-width: 260px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  border-right: 1px solid rgba(0,0,0,0.05);
  z-index: 10;
`;

const ContentWrapper = styled.main`
  flex: 1;
  background-color: #F1F8E9;
  padding: 30px;
  overflow-y: auto;
  position: relative;
`;

const LogoArea = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #2E7D32;
  margin-bottom: 40px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MenuList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  
  border-radius: 50px; 
  
  transition: all 0.2s ease-in-out;

  &.active {
    background-color: #E8F5E9;
    color: #1B5E20;
    font-weight: 700;
  }

  &:hover:not(.active) {
    background-color: #f5f5f5;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  color: #D32F2F;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
  border-radius: 50px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #FFEBEE;
  }
`;

// --- COMPONENT ---
const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <LayoutContainer>
            <SidebarContainer>
                <LogoArea>
                    <MdFitnessCenter size={28}/> SnackTrack
                </LogoArea>

                <MenuList>
                    <MenuItem to="/dashboard"><MdDashboard size={22}/> Dashboard</MenuItem>
                    <MenuItem to="/users"><MdPeople size={22}/> Users</MenuItem>
                    <MenuItem to="/trainings"><MdFitnessCenter size={22}/> Trainings</MenuItem>
                    {/* Zakładka Exercises */}
                    <MenuItem to="/exercises"><MdDirectionsRun size={22}/> Exercises</MenuItem> 
                    <MenuItem to="/reports"><MdWarning size={22}/> Reports</MenuItem>
                    <MenuItem to="/notifications"><MdNotifications size={22}/> Notifications</MenuItem>
                </MenuList>

                <LogoutButton onClick={handleLogout}>
                    <MdLogout size={22}/> Logout
                </LogoutButton>
            </SidebarContainer>

            <ContentWrapper>
                <Outlet />
            </ContentWrapper>
        </LayoutContainer>
    );
};

export default Layout;