import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api/axiosConfig';
import { 
    MdSearch, MdVisibility, MdBlock, MdCheckCircle, 
    MdClose, MdPerson, MdSave, MdWarning, 
    MdChevronLeft, MdChevronRight 
} from 'react-icons/md';

// ==========================================
// 🎨 STYLES & ANIMATIONS
// ==========================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageHeader = styled.h2`
  color: #1B5E20;
  margin: 0;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 10px 16px;
  border-radius: 50px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  margin-left: 10px;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

const Th = styled.th`
  background-color: #2E7D32;
  color: white;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  vertical-align: middle;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  
  &.premium { background-color: #FFF3E0; color: #EF6C00; }
  &.banned { background-color: #FFEBEE; color: #C62828; }
  &.active { background-color: #E8F5E9; color: #2E7D32; }
  &.inactive { background-color: #F5F5F5; color: #9E9E9E; }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.2s;
  color: #555;
  font-size: 18px;
  margin-right: 4px;

  &:hover { background-color: #f5f5f5; color: #2E7D32; }
  &.danger:hover { background-color: #FFEBEE; color: #D32F2F; }
`;

// --- PAGINATION STYLES ---
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

const PageInfo = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`;

const PaginationButton = styled.button`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #333;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f9f9f9;
    border-color: #ddd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
  }
`;

// --- MODAL STYLES ---
const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 24px;
  width: 480px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  position: relative;
`;

const ConfirmCard = styled(ModalCard)`
  width: 350px;
  padding: 24px;
  text-align: center;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
`;

const ModalAvatar = styled.div`
  width: 64px;
  height: 64px;
  background-color: #E8F5E9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2E7D32;
  font-size: 32px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  
  span.label { color: #888; font-weight: 500; }
  span.value { color: #333; font-weight: 600; display: flex; align-items: center; gap: 8px; }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  cursor: pointer; font-size: 20px; color: #999;
  transition: color 0.2s;
  &:hover { color: #333; }
`;

const ModalActions = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 12px;
`;

const ActionBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  transition: transform 0.1s;

  &:active { transform: scale(0.98); }

  &.primary { background-color: #2E7D32; color: white; }
  &.secondary { background-color: #f5f5f5; color: #555; }
  &.danger { background-color: #FFEBEE; color: #D32F2F; }
  &.save { background-color: #2E7D32; color: white; padding: 6px 12px; font-size: 12px; border-radius: 6px; }
`;

// --- TOAST NOTIFICATION ---
const Toast = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  z-index: 2000;
  font-size: 14px;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: 10px;
`;

// ==========================================
// ⚛️ COMPONENT LOGIC
// ==========================================

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // Pagination & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(0); // 0-indexed
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 25;

    // Modal States
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [premiumDate, setPremiumDate] = useState('');

    // 1. Debounce Search (500ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(0); // Reset strony przy nowym wyszukiwaniu
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // 2. Pobieranie danych
    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, debouncedSearch]);

    // 3. Sync daty w modalu
    useEffect(() => {
        if(selectedUser) {
            // 🔥 ZMIANA: premiumExpiration zamiast premiumExpirationDate
            setPremiumDate(selectedUser.premiumExpiration || '');
        }
    }, [selectedUser]);

    // 4. Timer powiadomień
    useEffect(() => {
        if(notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);


    const fetchUsers = () => {
        setLoading(true);
        api.get('/admin/users', {
            params: {
                page: page,
                size: pageSize,
                query: debouncedSearch
            }
        })
        .then(res => {
            // 🔥 DEBUG: Zobacz w konsoli jak nazywają się pola!
            console.log("Dane z backendu:", res.data);
            
            setUsers(res.data.content); 
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
            // Fallback w razie błędu
            setUsers([]);
        });
    };

    const showToast = (msg, type = 'success') => {
        setNotification({ msg, type });
    };

    const initiateBanToggle = (user) => {
        const isBanned = user.status === 'banned';
        setConfirmAction({
            type: isBanned ? 'unban' : 'ban',
            user: user
        });
    };

    const executeBanToggle = () => {
        if (!confirmAction) return;
        const { user } = confirmAction;

        api.put(`/admin/user/${user.id}/toggle-ban`)
            .then(() => {
                showToast(`User status updated successfully.`);
                // Zamiast fetchUsers(), aktualizujemy ręcznie w UI (szybciej)
                const newStatus = user.status === 'banned' ? 'active' : 'banned';
                const updatedUser = { ...user, status: newStatus };
                
                setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? updatedUser : u));
                setConfirmAction(null);
                if (selectedUser && selectedUser.id === user.id) setSelectedUser(updatedUser);
            })
            .catch(err => showToast("Error: " + (err.response?.data || err.message), 'error'));
    };

    const handleSavePremium = () => {
        if (!selectedUser) return;
        if (!premiumDate) {
             showToast("Please select a date first", 'error');
             return;
        }

        api.put(`/admin/user/${selectedUser.id}/info/expirationDate`, null, { params: { dateString: premiumDate } })
           .then((res) => {
               const updatedUser = res.data; // Obiekt z backendu
               
               showToast('Premium expiration updated!');
               
               // 1. Aktualizujemy obiekt w modalu
               setSelectedUser(updatedUser);
               
               // 2. 🔥 Aktualizujemy obiekt na liście głównej
               setUsers(prevUsers => prevUsers.map(user => 
                   user.id === updatedUser.id ? updatedUser : user
               ));
           })
           .catch(err => showToast('Failed: ' + (err.response?.data?.message || err.message), 'error'));
    };

    return (
        <div>
            {notification && (
                <Toast style={{ backgroundColor: notification.type === 'error' ? '#D32F2F' : '#333' }}>
                    {notification.type === 'error' ? <MdBlock/> : <MdCheckCircle/>}
                    {notification.msg}
                </Toast>
            )}

            {/* --- HEADER --- */}
            <HeaderContainer>
                <PageHeader>Users Directory</PageHeader>
                <SearchWrapper>
                    <MdSearch size={20} color="#888" />
                    <SearchInput 
                        placeholder="Search by Name, Email or ID..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </SearchWrapper>
            </HeaderContainer>

            {/* --- TABLE --- */}
            {loading ? (
                <div style={{padding: '40px', textAlign: 'center', color: '#888'}}>Loading user data...</div>
            ) : (
                <>
                    <Table>
                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>User Info</Th>
                                <Th>Status</Th>
                                <Th>Premium Until</Th>
                                <Th style={{textAlign: 'right'}}>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => {
                                const isBanned = user.status === 'banned';
                                // 🔥 ZMIANA: używamy premiumExpiration
                                const hasPremium = !!user.premiumExpiration;
                                
                                return (
                                <tr key={user.id} style={{opacity: isBanned ? 0.5 : 1}}>
                                    <Td>#{user.id}</Td>
                                    <Td>
                                        <div style={{fontWeight: '600'}}>{user.name} {user.surname}</div>
                                        <div style={{fontSize: '12px', color: '#888'}}>{user.email}</div>
                                    </Td>
                                    <Td>
                                        {user.status === 'banned' && <Badge className="banned">BANNED</Badge>}
                                        {user.status === 'active' && <Badge className="active">ACTIVE</Badge>}
                                        {user.status === 'inactive' && <Badge className="inactive">INACTIVE</Badge>}
                                        {' '}
                                        {/* 🔥 ZMIANA: używamy premiumExpiration */}
                                        {hasPremium && <Badge className="premium">PREMIUM</Badge>}
                                    </Td>
                                    <Td>
                                        {/* 🔥 ZMIANA: używamy premiumExpiration */}
                                        {user.premiumExpiration || '-'}
                                    </Td>
                                    <Td style={{textAlign: 'right'}}>
                                        <IconButton onClick={() => setSelectedUser(user)} title="View Details">
                                            <MdVisibility />
                                        </IconButton>
                                        <IconButton 
                                            className="danger" 
                                            onClick={() => initiateBanToggle(user)}
                                            title={isBanned ? "Unban User" : "Ban User"}
                                        >
                                            {isBanned ? <MdCheckCircle color="green"/> : <MdBlock />}
                                        </IconButton>
                                    </Td>
                                </tr>
                            )})}
                            {users.length === 0 && (
                                <tr>
                                    <Td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                                        No users found matching your criteria.
                                    </Td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* --- PAGINATION --- */}
                    <PaginationContainer>
                        <PageInfo>
                            Showing {users.length} users • Page {page + 1} of {totalPages || 1} • Total: {totalElements}
                        </PageInfo>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <PaginationButton 
                                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                                disabled={page === 0}
                            >
                                <MdChevronLeft size={18}/> Previous
                            </PaginationButton>
                            
                            <PaginationButton 
                                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={page + 1 >= totalPages}
                            >
                                Next <MdChevronRight size={18}/>
                            </PaginationButton>
                        </div>
                    </PaginationContainer>
                </>
            )}

            {/* --- DETAILS MODAL --- */}
            {selectedUser && (
                <Overlay onClick={() => setSelectedUser(null)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setSelectedUser(null)}><MdClose /></CloseButton>
                        
                        <ModalHeader>
                            <ModalAvatar><MdPerson /></ModalAvatar>
                            <div>
                                <h3 style={{margin: 0}}>{selectedUser.name} {selectedUser.surname}</h3>
                                <div style={{color: '#888', fontSize: '13px'}}>{selectedUser.email}</div>
                            </div>
                        </ModalHeader>

                        <DetailRow>
                            <span className="label">User ID</span>
                            <span className="value">#{selectedUser.id}</span>
                        </DetailRow>
                        <DetailRow>
                            <span className="label">Account Status</span>
                            <span className="value">
                                {selectedUser.status === 'banned' ? 
                                    <span style={{color:'#D32F2F'}}>Suspended</span> : 
                                    <span style={{color:'#2E7D32'}}>{selectedUser.status}</span>}
                            </span>
                        </DetailRow>
                        
                        {/* PREMIUM EDIT SECTION */}
                        <div style={{backgroundColor: '#F9F9F9', padding: '15px', borderRadius: '12px', margin: '15px 0'}}>
                            <DetailRow style={{marginBottom: '10px'}}>
                                <span className="label">Premium Expiration</span>
                            </DetailRow>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <input 
                                    type="date" 
                                    value={premiumDate}
                                    onChange={(e) => setPremiumDate(e.target.value)}
                                    style={{
                                        flex: 1, 
                                        padding: '8px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #ddd',
                                        fontFamily: 'Montserrat'
                                    }}
                                />
                                <ActionBtn className="save" onClick={handleSavePremium}>
                                    <MdSave size={16} style={{marginRight: '5px', verticalAlign: 'text-bottom'}}/>
                                    Save
                                </ActionBtn>
                            </div>
                            <div style={{fontSize: '10px', color: '#888', marginTop: '5px'}}>
                                * User must be active to update premium.
                            </div>
                        </div>

                        <ModalActions>
                            <ActionBtn className="secondary" onClick={() => setSelectedUser(null)}>
                                Close
                            </ActionBtn>
                            <ActionBtn 
                                className="danger" 
                                onClick={() => initiateBanToggle(selectedUser)}
                            >
                                {selectedUser.status === 'banned' ? "Unban User" : "Ban User"}
                            </ActionBtn>
                        </ModalActions>
                    </ModalCard>
                </Overlay>
            )}

            {/* --- CONFIRM MODAL --- */}
            {confirmAction && (
                <Overlay onClick={() => setConfirmAction(null)}>
                    <ConfirmCard onClick={e => e.stopPropagation()}>
                        <div style={{color: '#D32F2F', marginBottom: '15px'}}>
                             <MdWarning size={50} />
                        </div>
                        <h3 style={{margin: '0 0 10px 0'}}>
                            {confirmAction.type === 'ban' ? 'Ban User?' : 'Unban User?'}
                        </h3>
                        <p style={{color: '#666', fontSize: '14px', lineHeight: '1.5'}}>
                            Are you sure you want to <strong>{confirmAction.type}</strong> user 
                            <br/>
                            <strong>{confirmAction.user.email}</strong>?
                        </p>
                        
                        <ModalActions style={{marginTop: '25px'}}>
                            <ActionBtn className="secondary" onClick={() => setConfirmAction(null)}>
                                Cancel
                            </ActionBtn>
                            <ActionBtn className="danger" onClick={executeBanToggle}>
                                Confirm {confirmAction.type === 'ban' ? 'Ban' : 'Unban'}
                            </ActionBtn>
                        </ModalActions>
                    </ConfirmCard>
                </Overlay>
            )}
        </div>
    );
};

export default UsersPage;