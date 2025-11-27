import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api/axiosConfig';
import { 
    MdRestaurant, MdComment, MdCheck, MdDelete, 
    MdPerson, MdDescription, MdDateRange, MdWarning, 
    MdVisibility, MdClose, MdImage, MdCheckCircle
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
  gap: 10px;
  margin-top: auto;
  border-top: 1px solid #f5f5f5;
  padding-top: 15px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  transition: opacity 0.2s;

  &:hover { opacity: 0.85; }

  &.preview { background-color: #f0f0f0; color: #333; }
  &.resolve { background-color: #E8F5E9; color: #1B5E20; }
  &.delete { background-color: #FFEBEE; color: #D32F2F; }
`;

// --- MODAL STYLES ---
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
  backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div`
  background: white; padding: 0; border-radius: 20px; width: 450px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden;
  display: flex; flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px; background: #f9f9f9; border-bottom: 1px solid #eee;
  display: flex; justify-content: space-between; align-items: center;
  h3 { margin: 0; color: #333; font-size: 16px; display: flex; align-items: center; gap: 10px; }
`;

const ModalContent = styled.div`
  padding: 24px;
`;

const CloseButton = styled.button`
  background: none; border: none; cursor: pointer; color: #999; font-size: 24px;
  &:hover { color: #333; }
`;

const ContentRow = styled.div`
  margin-bottom: 15px;
  
  span.label { 
    display: block; font-size: 11px; font-weight: 700; color: #999; 
    text-transform: uppercase; margin-bottom: 5px; 
  }
  div.value { 
    font-size: 15px; color: #333; line-height: 1.5;
  }
`;

const MealImage = styled.img`
  width: 100%; height: 200px; object-fit: cover; border-radius: 12px;
  margin-bottom: 20px; border: 1px solid #eee;
`;

const PlaceholderImage = styled.div`
  width: 100%; height: 150px; background: #f0f0f0; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; color: #aaa;
  margin-bottom: 20px; flex-direction: column; gap: 10px;
`;

// ==========================================
// ⚛️ COMPONENT
// ==========================================

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('MEAL'); // 'MEAL' | 'COMMENT'
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Preview State
    const [previewData, setPreviewData] = useState(null); // Obiekt posiłku/komentarza
    const [showPreview, setShowPreview] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

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
           });
    };

    // --- POBIERANIE SZCZEGÓŁÓW DO PODGLĄDU ---
    const handlePreview = (itemId) => {
        setPreviewLoading(true);
        setShowPreview(true);
        setPreviewData(null);

        const endpoint = activeTab === 'MEAL'
            ? `/admin/meals/${itemId}`
            : `/admin/comments/${itemId}`;

        api.get(endpoint)
           .then(res => {
               setPreviewData(res.data); // Backend zwraca obiekt Meal lub Comment
               setPreviewLoading(false);
           })
           .catch(err => {
               console.error(err);
               setPreviewLoading(false);
               setPreviewData({ error: "Content not found or already deleted." });
           });
    };

    const handleResolve = (reportId) => {
        if(!window.confirm("Mark this report as resolved?")) return;

        const endpoint = activeTab === 'MEAL' 
            ? `/admin/reports/meals/${reportId}` 
            : `/admin/reports/comments/${reportId}`;

        api.delete(endpoint)
           .then(() => {
               setReports(prev => prev.filter(r => r.id !== reportId));
           })
           .catch(err => alert("Error: " + err.message));
    };

    const handleDeleteContent = (itemId, reportId) => {
        const itemType = activeTab === 'MEAL' ? 'Meal' : 'Comment';
        if(!window.confirm(`⚠️ WARNING: This will permanently delete the ${itemType} (ID: ${itemId}) from the database!`)) return;

        const deleteEndpoint = activeTab === 'MEAL'
            ? `/admin/meals/${itemId}/delete` 
            : `/admin/comments/${itemId}/delete`; 

        api.delete(deleteEndpoint)
           .then(() => {
               
               alert(`${itemType} deleted successfully.`);
               
               if (showPreview && previewData && previewData.id === itemId) {
                   setShowPreview(false);
               }

               setReports(prev => prev.filter(r => r.id !== reportId));
           })
           .catch(err => alert("Error deleting content: " + (err.response?.data || err.message)));
    };

    return (
        <Container>
            <PageHeader>Content Moderation</PageHeader>

            <TabsContainer>
                <TabButton active={activeTab === 'MEAL'} onClick={() => setActiveTab('MEAL')}>
                    <MdRestaurant size={18} /> Meal Reports
                </TabButton>
                <TabButton active={activeTab === 'COMMENT'} onClick={() => setActiveTab('COMMENT')}>
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
                            <p>No pending reports.</p>
                        </div>
                    )}
                    
                    {reports.map(report => (
                        <ReportCard key={report.id} type={activeTab}>
                            <CardHeader>
                                <ReportId>REPORT #{report.id}</ReportId>
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
                                        Target ID: <strong> {activeTab === 'MEAL' ? report.mealId : report.commentId}</strong>
                                    </span>
                                </InfoRow>
                            </InfoSection>

                            <ActionButtons>
                                <ActionButton 
                                    className="preview" 
                                    onClick={() => handlePreview(activeTab === 'MEAL' ? report.mealId : report.commentId)}
                                >
                                    <MdVisibility size={16}/> View Content
                                </ActionButton>

                                <ActionButton className="resolve" onClick={() => handleResolve(report.id)}>
                                    <MdCheck size={16}/> Resolve
                                </ActionButton>
                                
                                <ActionButton 
                                    className="delete"
                                    onClick={() => handleDeleteContent(activeTab === 'MEAL' ? report.mealId : report.commentId, report.id)}
                                >
                                    <MdDelete size={16}/> Delete
                                </ActionButton>
                            </ActionButtons>
                        </ReportCard>
                    ))}
                </Grid>
            )}

            {/* --- MODAL PODGLĄDU TREŚCI --- */}
            {showPreview && (
                <Overlay onClick={() => setShowPreview(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <h3>
                                {activeTab === 'MEAL' ? <MdRestaurant/> : <MdComment/>} 
                                {activeTab === 'MEAL' ? 'Meal Details' : 'Comment Details'}
                            </h3>
                            <CloseButton onClick={() => setShowPreview(false)}><MdClose/></CloseButton>
                        </ModalHeader>

                        <ModalContent>
                            {previewLoading ? (
                                <div style={{textAlign: 'center', padding: 20}}>Loading content details...</div>
                            ) : previewData?.error ? (
                                <div style={{color: 'red', textAlign: 'center', padding: 20}}>
                                    <MdWarning size={30} style={{marginBottom: 10, display: 'block', margin: '0 auto'}}/>
                                    {previewData.error}
                                </div>
                            ) : (
                                <>
                                    {/* --- WIDOK DLA POSIŁKU --- */}
                                    {activeTab === 'MEAL' && (
                                        <>
                                            {previewData.imageUrl ? (
                                                <MealImage 
                                                    // Pamiętaj o poprawnym URL (jeśli backend jest na 8080)
                                                    src={`https://projekt-inzynierski-production.up.railway.app${previewData.imageUrl}`} 
                                                    alt={previewData.name} 
                                                    onError={(e) => {e.target.src='https://via.placeholder.com/400x200?text=No+Image'}}
                                                />
                                            ) : (
                                                <PlaceholderImage>
                                                    <MdImage size={40}/>
                                                    <span>No image available</span>
                                                </PlaceholderImage>
                                            )}
                                            
                                            <ContentRow>
                                                <span className="label">Title</span>
                                                <div className="value" style={{fontWeight: 'bold', fontSize: '18px'}}>
                                                    {previewData.name}
                                                </div>
                                            </ContentRow>

                                            <ContentRow>
                                                <span className="label">Description</span>
                                                <div className="value" style={{lineHeight: '1.6', color: '#555'}}>
                                                    {previewData.description || <em>No description provided.</em>}
                                                </div>
                                            </ContentRow>

                                            <ContentRow>
                                                <span className="label">Ingredients</span>
                                                <div className="value">
                                                    {previewData.ingredients && previewData.ingredients.length > 0 ? (
                                                        <ul style={{margin: '5px 0 0 0', paddingLeft: '20px', color: '#444'}}>
                                                            {previewData.ingredients.map((ing, index) => {
                                                                // 1. Ustalamy źródło danych o produkcie (API vs Local)
                                                                const foodItem = ing.essentialApi || ing.essentialFood;
                                                                
                                                                // 2. Pobieramy nazwę (bezpiecznie)
                                                                const name = foodItem ? foodItem.name : "Unknown Item";
                                                                
                                                                // 3. Pobieramy jednostkę (zakładam, że EssentialFood/Api ma pole 'unit', jeśli nie - domyślnie 'g')
                                                                const unit = foodItem?.unit || 'g';

                                                                // 4. Ustalamy ilość (Amount vs Pieces)
                                                                let quantityDisplay = "";
                                                                if (ing.pieces && ing.pieces > 0) {
                                                                    quantityDisplay = `${ing.pieces} pcs`;
                                                                } else if (ing.amount && ing.amount > 0) {
                                                                    quantityDisplay = `${ing.amount} ${unit}`;
                                                                }

                                                                return (
                                                                    <li key={index} style={{marginBottom: '4px'}}>
                                                                        <strong>{name}</strong> 
                                                                        {quantityDisplay && ` — ${quantityDisplay}`}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <span style={{color: '#999'}}>No ingredients listed.</span>
                                                    )}
                                                </div>
                                            </ContentRow>

                                            <div style={{display: 'flex', gap: 20, marginTop: 20, borderTop: '1px solid #eee', paddingTop: 10}}>
                                                <ContentRow>
                                                    <span className="label">Author ID</span>
                                                    <div className="value">{previewData.authorId}</div>
                                                </ContentRow>
                                                <ContentRow>
                                                    <span className="label">Meal ID</span>
                                                    <div className="value">{previewData.id}</div>
                                                </ContentRow>
                                            </div>
                                        </>
                                    )}

                                    {/* --- WIDOK DLA KOMENTARZA --- */}
                                    {activeTab === 'COMMENT' && (
                                        <>
                                            <ContentRow>
                                                <span className="label">Comment Content</span>
                                                <div className="value" style={{
                                                    background: '#f9f9f9', padding: 15, borderRadius: 8, 
                                                    fontStyle: 'italic', border: '1px solid #eee'
                                                }}>
                                                    "{previewData.content}"
                                                </div>
                                            </ContentRow>
                                            <div style={{display: 'flex', gap: 20, marginTop: 20}}>
                                                <ContentRow>
                                                    <span className="label">Author ID</span>
                                                    <div className="value">{previewData.authorId}</div>
                                                </ContentRow>
                                                <ContentRow>
                                                    <span className="label">Meal ID</span>
                                                    <div className="value">{previewData.mealId}</div>
                                                </ContentRow>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </ModalContent>
                    </ModalCard>
                </Overlay>
            )}
        </Container>
    );
};

export default ReportsPage;