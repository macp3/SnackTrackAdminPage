import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Dodano useLocation
import styled, { keyframes } from 'styled-components';
import api from '../api/axiosConfig';
import { 
    MdArrowBack, MdAdd, MdDelete, MdSearch, MdFitnessCenter, 
    MdCalendarToday, MdSave, MdCheckCircle, MdClose
} from 'react-icons/md';

// ==========================================
// 🎨 STYLES (Te same co wcześniej + SaveButton)
// ==========================================

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Container = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
  padding-bottom: 50px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // Rozrzucamy elementy na boki
  margin-bottom: 30px;
`;

const HeaderLeft = styled.div`display: flex; align-items: center; gap: 15px;`;

const BackButton = styled.button`
  background: white; border: 1px solid #ddd; border-radius: 50%; width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  &:hover { background: #f5f5f5; }
`;

const Title = styled.h2`margin: 0; color: #1B5E20;`;
const SubTitle = styled.span`color: #666; font-size: 14px; margin-left: 10px;`;

const SaveDraftButton = styled.button`
  background-color: #2E7D32; color: white;
  padding: 10px 24px; border-radius: 50px; border: none;
  font-weight: 700; font-family: 'Montserrat'; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 12px rgba(46,125,50,0.3);
  transition: transform 0.1s;
  &:hover { background-color: #1B5E20; }
  &:active { transform: scale(0.98); }
`;

// --- GRID UKŁAD DNI ---
const DaysGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; align-items: start;
`;

const DayCard = styled.div`
  background: white; border-radius: 16px; overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #eee;
  display: flex; flex-direction: column; min-height: 200px;
`;

const DayHeader = styled.div`
  background-color: #E8F5E9; padding: 12px 16px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #C8E6C9;
  strong { color: #2E7D32; font-size: 15px; }
  span { font-size: 12px; color: #666; font-weight: 500; }
`;

const ExerciseList = styled.div`
  padding: 10px; flex: 1; display: flex; flex-direction: column; gap: 8px;
`;

const ExerciseItem = styled.div`
  background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 10px;
  display: flex; justify-content: space-between; align-items: flex-start;
  transition: all 0.2s;
  &:hover { border-color: #2E7D32; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
`;

const ExerciseInfo = styled.div`
  div.name { font-weight: 600; font-size: 14px; color: #333; margin-bottom: 4px; }
  div.meta { font-size: 11px; color: #777; display: flex; gap: 8px; }
  span.tag { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
`;

const AddButton = styled.button`
  width: 100%; padding: 12px; background: none; border: none; border-top: 1px solid #f0f0f0;
  color: #2E7D32; font-weight: 600; cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 5px; transition: background 0.2s;
  &:hover { background-color: #f9f9f9; }
`;

const DeleteBtn = styled.button`
  background: none; border: none; color: #ccc; cursor: pointer; padding: 4px;
  &:hover { color: #D32F2F; }
`;

// --- MODAL (PICKER) ---
const Overlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); z-index: 100;
  display: flex; justify-content: center; align-items: center; backdrop-filter: blur(2px);
`;

const PickerCard = styled.div`
  background: white; width: 500px; height: 70vh; border-radius: 20px;
  display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.2);
`;

const PickerHeader = styled.div`
  padding: 20px; border-bottom: 1px solid #eee;
  display: flex; justify-content: space-between; align-items: center;
`;

const PickerSearch = styled.div`
  padding: 10px 20px; border-bottom: 1px solid #eee;
  input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;}
`;

const PickerList = styled.div`flex: 1; overflow-y: auto; padding: 10px;`;

const PickerItem = styled.div`
  padding: 12px; border-bottom: 1px solid #f9f9f9; cursor: pointer; border-radius: 8px;
  display: flex; justify-content: space-between; align-items: center;
  &:hover { background-color: #E8F5E9; }
  div.main { font-weight: 600; color: #333; }
  div.sub { font-size: 12px; color: #888; }
`;

const CloseButton = styled.button`
  background: none; border: none; cursor: pointer; display: flex;
  align-items: center; justify-content: center; color: #999; padding: 5px;
  border-radius: 50%; transition: all 0.2s;
  &:hover { background-color: #f0f0f0; color: #333; }
`;

// ==========================================
// ⚛️ LOGIC
// ==========================================

const TrainingEditorPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation(); // Do odebrania danych z "Create"
    
    const isCreateMode = id === 'new';

    // Główny stan danych treningu
    const [trainingInfo, setTrainingInfo] = useState(null); // Name, Desc, Duration
    const [groupedExercises, setGroupedExercises] = useState({}); // { 1: [ex], 2: [] }
    
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState(null);
    const [allExercises, setAllExercises] = useState([]); 
    const [searchQuery, setSearchQuery] = useState("");

    // 1. Inicjalizacja
    useEffect(() => {
        fetchAllExercises(); // Zawsze potrzebne do pickera

        if (isCreateMode) {
            // --- TRYB TWORZENIA (DRAFT) ---
            if (!location.state) {
                // Jeśli ktoś wszedł z palca na /trainings/new bez danych -> cofnij
                navigate('/trainings');
                return;
            }
            
            setTrainingInfo({
                name: location.state.name,
                description: location.state.description,
                durationTime: location.state.duration
            });
            
            // Pusty harmonogram
            setGroupedExercises({ 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] });
            setLoading(false);

        } else {
            // --- TRYB EDYCJI (LIVE API) ---
            fetchTrainingDetails();
        }
    }, [id, isCreateMode]);

    // --- API CALLS ---

    const fetchAllExercises = () => {
        api.get('/admin/exercises')
           .then(res => setAllExercises(res.data))
           .catch(console.error);
    };

    const fetchTrainingDetails = () => {
        api.get(`/admin/trainings/${id}/details`)
           .then(res => {
               setTrainingInfo(res.data.trainingInfo || res.data); // zależy od struktury backendu
               processExercises(res.data.exercises);
               setLoading(false);
           })
           .catch(err => {
               console.error(err);
               alert("Error loading training details");
               navigate('/trainings');
           });
    };

    const processExercises = (flatList) => {
        const groups = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
        if(flatList) {
            flatList.forEach(item => {
                // Backend zwraca czasem obiekt exercise zagnieżdżony, czasem płaski.
                // Dostosuj do swojego API.
                const day = item.dayOfExercise || item.day;
                if (groups[day]) groups[day].push(item);
            });
        }
        setGroupedExercises(groups);
    };

    // --- ACTIONS ---

    const handleAddExercise = (selectedExercise) => {
        if (isCreateMode) {
            // 🟢 DRAFT: Dodaj tylko do stanu lokalnego
            setGroupedExercises(prev => ({
                ...prev,
                [currentDay]: [...prev[currentDay], selectedExercise] // Dodajemy pełny obiekt exercise
            }));
            setIsModalOpen(false);
            setSearchQuery("");
        } else {
            // 🔴 LIVE: Wyślij do API
            const payload = {
            treningInfo: {
                name: trainingInfo.name,
                description: trainingInfo.description,
                duration: trainingInfo.durationTime 
            },
            trainingExercises: ExerciseList
        };
            api.post('/admin/trainings/addExercise', payload)
               .then(res => {
                   setTrainingInfo(res.data.trainingInfo); // Update info if needed
                   processExercises(res.data.exercises); // Refresh exercises
                   setIsModalOpen(false);
                   setSearchQuery("");
               })
               .catch(err => alert("Failed: " + err.message));
        }
    };

    const handleRemoveExercise = (item, day, indexInArray) => {
        if(!window.confirm("Remove exercise?")) return;

        if (isCreateMode) {
            // 🟢 DRAFT: Usuń ze stanu lokalnego po indeksie
            setGroupedExercises(prev => {
                const newList = [...prev[day]];
                newList.splice(indexInArray, 1); // Usuń 1 element pod tym indeksem
                return { ...prev, [day]: newList };
            });
        } else {
            // 🔴 LIVE: Usuń przez API
            // Tu uwaga: Twoje API usuwania wymaga exerciseId. 
            // item.exercise.id lub item.id
            const exId = item.exercise ? item.exercise.id : item.id;
            
            api.delete(`/admin/trainings/${id}/delete/${exId}/${day}`)
               .then(res => {
                   processExercises(res.data.exercises);
               })
               .catch(err => alert("Failed: " + err.message));
        }
    };

    // --- SAVE (Tylko dla Create Mode) ---
    const handleSaveDraft = () => {
        // Sprawdź czy jest chociaż 1 ćwiczenie (wymóg backendu)
        let totalExercises = 0;
        const exerciseList = [];

        Object.keys(groupedExercises).forEach(day => {
            groupedExercises[day].forEach(ex => {
                totalExercises++;
                exerciseList.push({
                    exerciseId: ex.id,
                    exerciseDay: parseInt(day)
                });
            });
        });

        if (totalExercises === 0) {
            alert("Training must contain at least one exercise before saving.");
            return;
        }

        // Konstrukcja Payloads
        const payload = {
            treningInfo: {
                name: trainingInfo.name,
                description: trainingInfo.description,
                durationTime: trainingInfo.durationTime
            },
            trainingExercises: exerciseList
        };

        api.post('/admin/trainings/add', payload)
           .then(() => {
               alert("Training saved successfully!");
               navigate('/trainings');
           })
           .catch(err => alert("Error saving: " + (err.response?.data || err.message)));
    };


    // Filtrowanie w modalu
    const filteredExercises = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ex.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Loading...</div>;

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <BackButton onClick={() => navigate('/trainings')}>
                        <MdArrowBack size={20}/>
                    </BackButton>
                    <div>
                        <Title>
                            {isCreateMode ? "New Training Draft" : (trainingInfo?.name || "Training Editor")}
                        </Title>
                        <SubTitle>
                            {isCreateMode ? "Unsaved Changes" : (trainingInfo?.description || "")}
                        </SubTitle>
                    </div>
                </HeaderLeft>

                {/* Przycisk zapisu widoczny tylko w trybie tworzenia */}
                {isCreateMode && (
                    <SaveDraftButton onClick={handleSaveDraft}>
                        <MdSave size={20}/> SAVE PLAN
                    </SaveDraftButton>
                )}
            </Header>

            {/* --- BOARD 7 DNI --- */}
            <DaysGrid>
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <DayCard key={day}>
                        <DayHeader>
                            <strong>Day {day}</strong>
                            <span>{groupedExercises[day]?.length || 0} exercises</span>
                        </DayHeader>
                        
                        <ExerciseList>
                            {groupedExercises[day]?.map((item, index) => {
                                // W trybie Draft 'item' to czysty obiekt ćwiczenia.
                                // W trybie Live 'item' to wrapper z backendu.
                                const ex = isCreateMode ? item : (item.exercise || item);
                                
                                return (
                                    <ExerciseItem key={index}>
                                        <ExerciseInfo>
                                            <div className="name">{ex.name}</div>
                                            <div className="meta">
                                                <span className="tag">{ex.type}</span>
                                                <span>{ex.numberOfSets}x{ex.repetitionsPerSet}</span>
                                            </div>
                                        </ExerciseInfo>
                                        <DeleteBtn onClick={() => handleRemoveExercise(item, day, index)}>
                                            <MdDelete />
                                        </DeleteBtn>
                                    </ExerciseItem>
                                );
                            })}
                            
                            {(!groupedExercises[day] || groupedExercises[day].length === 0) && (
                                <div style={{textAlign: 'center', padding: '20px', color: '#ccc', fontSize: '12px'}}>
                                    Rest Day
                                </div>
                            )}
                        </ExerciseList>

                        <AddButton onClick={() => { setCurrentDay(day); setIsModalOpen(true); }}>
                            <MdAdd size={18}/> Add Exercise
                        </AddButton>
                    </DayCard>
                ))}
            </DaysGrid>

            {/* --- MODAL WYBORU ĆWICZENIA --- */}
            {isModalOpen && (
                <Overlay onClick={() => setIsModalOpen(false)}>
                    <PickerCard onClick={e => e.stopPropagation()}>
                        <PickerHeader>
                            <h3 style={{margin:0, color: '#1B5E20'}}>Add to Day {currentDay}</h3>
                            <CloseButton onClick={() => setIsModalOpen(false)}><MdClose/></CloseButton>
                        </PickerHeader>
                        
                        <PickerSearch>
                            <input 
                                placeholder="Search exercises..." 
                                autoFocus
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </PickerSearch>

                        <PickerList>
                            {filteredExercises.map(ex => (
                                <PickerItem key={ex.id} onClick={() => handleAddExercise(ex)}>
                                    <div>
                                        <div className="main">{ex.name}</div>
                                        <div className="sub">{ex.type} • Difficulty: {ex.difficulty}</div>
                                    </div>
                                    <MdAdd color="#2E7D32" size={24}/>
                                </PickerItem>
                            ))}
                            {filteredExercises.length === 0 && (
                                <div style={{padding: 20, textAlign: 'center', color: '#999'}}>No exercises found.</div>
                            )}
                        </PickerList>
                    </PickerCard>
                </Overlay>
            )}
        </Container>
    );
};

export default TrainingEditorPage;