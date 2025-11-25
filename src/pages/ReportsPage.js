import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api/axiosConfig';
import { 
    MdRestaurant, MdComment, MdCheck, MdDelete, 
    MdPerson, MdDescription, MdDateRange, MdWarning, MdCheckCircle 
} from 'react-icons/md';

// ==========================================
// 🎨 STYLES
// ==========================================

const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const Container = styled.div`
  padding-bottom: 50px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageHeader = styled.h2`
  color: #1B5E20;
  margin: 0 0 24px 0;
`;

// --- TABS ---
const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 30px;
  background: white;
  padding: 6px;
  border-radius: 50px;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
`;

const TabButton = styled.button`
  border: none;
  background: ${props => props.active ? '#E8F5E9' : 'transparent'};
  color: ${props => props.active ? '#1B5E20' : '#666'};
  font-weight: ${props => props.active ? '700' : '500'};
  padding: 10px 24px;
  border-radius: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#E8F5E9' : '#f5f5f5'};
  }
`;

// --- GRID & CARDS ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 6px solid ${props => props.type === 'MEAL' ? '#FFA726' : '#42A5F5'};
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const ReportId = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ReportContentBox = styled.div`
  background-color: #f9f9f9;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  font-style: italic;
  border: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #555;
  
  strong { color: #222; }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }

  &.resolve {
    background-color: #E8F5E9;
    color: #1B5E20;
  }

  &.delete {
    background-color: #FFEBEE;
    color: #D32F2F;
  }
`;

// ==========================================
// ⚛️ COMPONENT
// ==========================================

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('MEAL'); // 'MEAL' | 'COMMENT'
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, [activeTab]);

    const fetchReports = () => {
        setLoading(true);
        const endpoint = activeTab === 'MEAL' 
            ? '/admin/reports/meals' 
            : '/admin/reports/comments';

        api.get(endpoint)
           .then(res => {
               setReports(res.data);
               setLoading(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
               // alert("Failed to fetch reports"); // Opcjonalnie
           });
    };

    // --- AKCJA 1: Rozwiązanie zgłoszenia (Ignoruj / Usuń z listy) ---
    const handleResolve = (reportId) => {
        if(!window.confirm("Mark this report as resolved? The content will remain visible to users.")) return;

        const endpoint = activeTab === 'MEAL' 
            ? `/admin/reports/meals/${reportId}` 
            : `/admin/reports/comments/${reportId}`;

        api.delete(endpoint)
           .then(() => {
               // Usuń lokalnie z listy dla szybkości
               setReports(prev => prev.filter(r => r.id !== reportId));
           })
           .catch(err => alert("Error: " + err.message));
    };

    // --- AKCJA 2: Usunięcie treści (Admin Delete) ---
    const handleDeleteContent = (itemId, reportId) => {
        const itemType = activeTab === 'MEAL' ? 'Meal' : 'Comment';
        if(!window.confirm(`⚠️ WARNING: This will permanently delete the ${itemType} (ID: ${itemId}) from the database!`)) return;

        // Endpointy "God Mode" z AdminController
        const deleteEndpoint = activeTab === 'MEAL'
            ? `/admin/meals/${itemId}/delete` 
            // Jeśli nie masz endpointu do usuwania komentarzy przez admina, 
            // musisz go dodać w AdminController, inaczej to nie zadziała.
            // Zakładam strukturę: /admin/comments/{id}/delete
            : `/admin/comments/${itemId}/delete`; 

        api.delete(deleteEndpoint)
           .then(() => {
               // Po usunięciu treści, usuwamy też zgłoszenie (bo nie ma już czego zgłaszać)
               // Możemy wywołać handleResolve, ale lepiej zrobić to ręcznie, bo endpoint może być inny
               const reportEndpoint = activeTab === 'MEAL' 
                    ? `/admin/reports/meals/${reportId}` 
                    : `/admin/reports/comments/${reportId}`;
               
               return api.delete(reportEndpoint);
           })
           .then(() => {
               alert(`${itemType} deleted and report closed.`);
               setReports(prev => prev.filter(r => r.id !== reportId));
           })
           .catch(err => alert("Error deleting content: " + (err.response?.data || err.message)));
    };

    return (
        <Container>
            <PageHeader>Content Moderation</PageHeader>

            <TabsContainer>
                <TabButton 
                    active={activeTab === 'MEAL'} 
                    onClick={() => setActiveTab('MEAL')}
                >
                    <MdRestaurant size={18} /> Meal Reports
                </TabButton>
                <TabButton 
                    active={activeTab === 'COMMENT'} 
                    onClick={() => setActiveTab('COMMENT')}
                >
                    <MdComment size={18} /> Comment Reports
                </TabButton>
            </TabsContainer>

            {loading ? (
                <div style={{textAlign: 'center', color: '#888', padding: 40}}>Loading reports...</div>
            ) : (
                <Grid>
                    {reports.length === 0 && (
                        <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#999', background: 'white', borderRadius: 16}}>
                            <MdCheckCircle size={40} style={{marginBottom: 10, color: '#E0E0E0'}}/>
                            <p>No pending reports. Good job!</p>
                        </div>
                    )}
                    
                    {reports.map(report => (
                        <ReportCard key={report.id} type={activeTab}>
                            <CardHeader>
                                <ReportId>REPORT #{report.id}</ReportId>
                                {/* Jeśli masz datę w DTO, możesz ją tu wyświetlić */}
                                {/* <span style={{fontSize: 11, color: '#aaa'}}>{report.timestamp}</span> */}
                            </CardHeader>

                            <ReportContentBox>
                                <MdWarning size={20} color="#FFB74D" style={{minWidth: 20}}/>
                                <div>
                                    <div style={{fontSize: 11, fontWeight: 'bold', marginBottom: 4, color: '#888'}}>REASON:</div>
                                    "{report.content}"
                                </div>
                            </ReportContentBox>

                            <InfoSection>
                                <InfoRow>
                                    <MdPerson size={16} color="#2E7D32"/>
                                    <span>Reported by User ID: <strong>{report.reportingId}</strong></span>
                                </InfoRow>
                                <InfoRow>
                                    {activeTab === 'MEAL' ? <MdRestaurant size={16} color="#FFA726"/> : <MdComment size={16} color="#42A5F5"/>}
                                    <span>
                                        Target {activeTab === 'MEAL' ? 'Meal' : 'Comment'} ID: 
                                        <strong> {activeTab === 'MEAL' ? report.mealId : report.commentId}</strong>
                                    </span>
                                </InfoRow>
                            </InfoSection>

                            <ActionButtons>
                                <ActionButton 
                                    className="resolve" 
                                    onClick={() => handleResolve(report.id)}
                                    title="Keep content, remove report"
                                >
                                    <MdCheck size={18}/> Resolve
                                </ActionButton>
                                <ActionButton 
                                    className="delete"
                                    onClick={() => handleDeleteContent(
                                        activeTab === 'MEAL' ? report.mealId : report.commentId,
                                        report.id
                                    )}
                                    title="Delete content permanently"
                                >
                                    <MdDelete size={18}/> Delete Content
                                </ActionButton>
                            </ActionButtons>
                        </ReportCard>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ReportsPage;