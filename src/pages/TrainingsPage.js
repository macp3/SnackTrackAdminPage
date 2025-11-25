import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import api from '../api/axiosConfig';
import { MdAdd, MdEdit, MdDelete, MdTimer, MdClose, MdWarning, MdFitnessCenter } from 'react-icons/md';

// ==========================================
// 🎨 STYLES
// ==========================================

const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding-bottom: 80px;
  animation: ${fadeIn} 0.4s ease-out;
`;

const TrainingCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-left: 6px solid #2E7D32;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #222;
  font-size: 18px;
`;

const CardDesc = styled.p`
  color: #666;
  font-size: 14px;
  flex: 1;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #555;
  font-size: 13px;
  margin-bottom: 12px;
  background-color: #F1F8E9;
  padding: 6px 10px;
  border-radius: 8px;
  width: fit-content;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Montserrat', sans-serif;
  transition: background 0.2s;
  
  &.primary {
    background-color: #E8F5E9;
    color: #1B5E20;
    &:hover{ background: #C8E6C9; }
  }
  
  &.danger {
    background-color: #FFEBEE;
    color: #D32F2F;
    &:hover{ background: #FFCDD2; }
  }
`;

const Fab = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: #2E7D32;
  color: white;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 6px 20px rgba(46,125,50,0.4);
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 50;

  &:hover { transform: scale(1.1); }
  &:active { transform: scale(0.95); }
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
  background: white; padding: 32px; border-radius: 24px; width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2); position: relative;
`;

const ModalTitle = styled.h3`
  margin: 0 0 20px 0; color: #1B5E20; display: flex; align-items: center; gap: 10px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px; }
  input, textarea {
    width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px;
    font-family: 'Montserrat', sans-serif; box-sizing: border-box; font-size: 14px;
    &:focus { border-color: #2E7D32; outline: none; }
  }
`;

const CloseButton = styled.button`
  position: absolute; top: 20px; right: 20px;
  background: none; border: none; cursor: pointer; color: #999; font-size: 24px;
  &:hover { color: #333; }
`;

const SubmitButton = styled.button`
  width: 100%; padding: 14px; background: #2E7D32; color: white;
  border: none; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px;
  font-size: 15px;
  &:hover { background: #1B5E20; }
`;

// ==========================================
// ⚛️ COMPONENT
// ==========================================

const TrainingsPage = () => {
    const [trainings, setTrainings] = useState([]);
    const navigate = useNavigate();

    // States for Modals
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // Object or null

    // Form State
    const [newTraining, setNewTraining] = useState({
        name: '',
        description: '',
        duration: ''
    });

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        api.get('/admin/trainings')
            .then(res => setTrainings(res.data))
            .catch(console.error);
    };

    // --- HANDLERS ---

    const handleAddSubmit = (e) => {
        e.preventDefault();
        
        if (!newTraining.name || !newTraining.description || !newTraining.duration) {
            alert("Please fill all fields");
            return;
        }

        const draftData = {
            name: newTraining.name,
            description: newTraining.description,
            duration: parseInt(newTraining.duration)
        };

        setAddModalOpen(false);
        setNewTraining({ name: '', description: '', duration: '' });

        navigate('/trainings/new', { state: draftData });
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;

        api.delete(`/admin/trainings/${deleteTarget.id}/delete`)
           .then(() => {
               fetchTrainings();
               setDeleteTarget(null);
           })
           .catch(err => alert("Error: " + err.message));
    };

    return (
        <div>
            <h2 style={{color: '#1B5E20', marginBottom: '24px'}}>Training Plans</h2>
            
            <Grid>
                {trainings.map(t => (
                    <TrainingCard key={t.id}>
                        <div>
                            <CardTitle>{t.name}</CardTitle>
                            <MetaRow>
                                <MdTimer size={16}/> {t.durationTime} min approx.
                            </MetaRow>
                            <CardDesc>{t.description}</CardDesc>
                        </div>
                        <ButtonGroup>
                            <ActionButton className="primary" onClick={() => navigate(`/trainings/${t.id}`)}>
                                <MdEdit size={18} /> Edit Plan
                            </ActionButton>
                            <ActionButton className="danger" onClick={() => setDeleteTarget(t)}>
                                <MdDelete size={18} />
                            </ActionButton>
                        </ButtonGroup>
                    </TrainingCard>
                ))}
            </Grid>

            <Fab onClick={() => setAddModalOpen(true)} title="Create New Plan">
                <MdAdd />
            </Fab>

            {/* --- ADD MODAL --- */}
            {isAddModalOpen && (
                <Overlay onClick={() => setAddModalOpen(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <CloseButton onClick={() => setAddModalOpen(false)}><MdClose /></CloseButton>
                        <ModalTitle><MdFitnessCenter /> Create New Plan</ModalTitle>
                        
                        <form onSubmit={handleAddSubmit}>
                            <InputGroup>
                                <label>Plan Name</label>
                                <input 
                                    placeholder="e.g. Summer Shred" 
                                    value={newTraining.name}
                                    onChange={e => setNewTraining({...newTraining, name: e.target.value})}
                                    autoFocus
                                />
                            </InputGroup>
                            <InputGroup>
                                <label>Description</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Briefly describe the goal..." 
                                    value={newTraining.description}
                                    onChange={e => setNewTraining({...newTraining, description: e.target.value})}
                                />
                            </InputGroup>
                            <InputGroup>
                                <label>Duration (minutes)</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 45" 
                                    value={newTraining.duration}
                                    onChange={e => setNewTraining({...newTraining, duration: e.target.value})}
                                />
                            </InputGroup>

                            <SubmitButton type="submit">Create Plan</SubmitButton>
                        </form>
                    </ModalCard>
                </Overlay>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {deleteTarget && (
                <Overlay onClick={() => setDeleteTarget(null)}>
                    <ModalCard style={{textAlign: 'center', padding: '40px'}} onClick={e => e.stopPropagation()}>
                        <div style={{color: '#D32F2F', marginBottom: '15px'}}>
                             <MdWarning size={60} />
                        </div>
                        <h3 style={{margin: '0 0 10px 0', color: '#333'}}>Delete Training Plan?</h3>
                        <p style={{color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '30px'}}>
                            Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>?<br/>
                            This action cannot be undone.
                        </p>
                        
                        <div style={{display: 'flex', gap: '10px'}}>
                            <ActionButton 
                                className="primary" 
                                style={{background: '#f5f5f5', color: '#333'}}
                                onClick={() => setDeleteTarget(null)}
                            >
                                Cancel
                            </ActionButton>
                            <ActionButton 
                                className="danger" 
                                onClick={handleDeleteConfirm}
                            >
                                Delete Plan
                            </ActionButton>
                        </div>
                    </ModalCard>
                </Overlay>
            )}
        </div>
    );
};

export default TrainingsPage;