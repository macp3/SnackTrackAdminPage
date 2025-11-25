import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api/axiosConfig';
import { MdAdd, MdDelete, MdSearch } from 'react-icons/md';

// --- STYLES ---
const PageHeader = styled.h2`color: #1B5E20; margin-bottom: 20px;`;
const Table = styled.table`width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);`;
const Th = styled.th`background-color: #2E7D32; color: white; padding: 16px; text-align: left; font-weight: 600;`;
const Td = styled.td`padding: 14px 16px; border-bottom: 1px solid #f0f0f0; color: #333;`;
const IconButton = styled.button`background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #D32F2F; &:hover { background-color: #FFEBEE; }`;

const SearchWrapper = styled.div`display: flex; align-items: center; background: white; padding: 10px 16px; border-radius: 50px; border: 1px solid #eee; width: 300px; margin-bottom: 20px;`;
const SearchInput = styled.input`border: none; outline: none; margin-left: 10px; width: 100%; font-family: 'Montserrat', sans-serif;`;

const Fab = styled.button`
  position: fixed; bottom: 40px; right: 40px;
  background-color: #2E7D32; color: white;
  width: 60px; height: 60px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; box-shadow: 0 6px 12px rgba(46,125,50,0.4);
  cursor: pointer; transition: transform 0.2s;
  &:hover { transform: scale(1.1); }
`;

// Modal Styles
const Overlay = styled.div`position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 100;`;
const ModalCard = styled.div`background: white; padding: 30px; border-radius: 20px; width: 400px;`;
const Input = styled.input`width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-family: 'Montserrat', sans-serif;`;
const Select = styled.select`width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-family: 'Montserrat', sans-serif;`;
const Button = styled.button`width: 100%; padding: 12px; background: #2E7D32; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; font-family: 'Montserrat', sans-serif;`;

const ExercisesPage = () => {
    const [exercises, setExercises] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    // Form state
    const [newExercise, setNewExercise] = useState({
        name: '', description: '', type: 'Strength', difficulty: 1, numberOfSets: 3, repetitionsPerSet: 12
    });

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        setFiltered(exercises.filter(e => e.name.toLowerCase().includes(search.toLowerCase())));
    }, [search, exercises]);

    const fetchExercises = () => {
        api.get('/admin/exercises')
           .then(res => setExercises(res.data))
           .catch(console.error);
    };

    const handleDelete = (id) => {
        if(window.confirm("Delete this exercise? It will be removed from all training plans!")) {
            api.delete(`/admin/exercises/delete/${id}`)
               .then(() => fetchExercises())
               .catch(err => alert(err.response?.data || err.message));
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        api.post('/admin/exercises/add', newExercise)
           .then(() => {
               setShowModal(false);
               fetchExercises();
               setNewExercise({ name: '', description: '', type: 'Strength', difficulty: 1, numberOfSets: 3, repetitionsPerSet: 12 });
           })
           .catch(err => alert(err.message));
    };

    return (
        <div>
            <PageHeader>Exercise Database</PageHeader>
            
            <SearchWrapper>
                <MdSearch size={20} color="#888"/>
                <SearchInput placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)}/>
            </SearchWrapper>

            <Table>
                <thead>
                    <tr>
                        <Th>Name</Th>
                        <Th>Type</Th>
                        <Th>Sets x Reps</Th>
                        <Th>Difficulty</Th>
                        <Th>Action</Th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(ex => (
                        <tr key={ex.id}>
                            <Td>
                                <strong>{ex.name}</strong><br/>
                                <span style={{fontSize: '12px', color: '#888'}}>{ex.description}</span>
                            </Td>
                            <Td>{ex.type}</Td>
                            <Td>{ex.numberOfSets} x {ex.repetitionsPerSet}</Td>
                            <Td>{ex.difficulty}/5</Td>
                            <Td>
                                <IconButton onClick={() => handleDelete(ex.id)}><MdDelete size={20}/></IconButton>
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Fab onClick={() => setShowModal(true)}><MdAdd/></Fab>

            {showModal && (
                <Overlay onClick={() => setShowModal(false)}>
                    <ModalCard onClick={e => e.stopPropagation()}>
                        <h3 style={{marginTop:0}}>Add New Exercise</h3>
                        <form onSubmit={handleAdd}>
                            <Input placeholder="Name" required value={newExercise.name} onChange={e => setNewExercise({...newExercise, name: e.target.value})} />
                            <Input placeholder="Description" required value={newExercise.description} onChange={e => setNewExercise({...newExercise, description: e.target.value})} />
                            
                            <Select value={newExercise.type} onChange={e => setNewExercise({...newExercise, type: e.target.value})}>
                                <option value="Strength">Strength</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Core">Core</option>
                                <option value="Plyometrics">Plyometrics</option>
                                <option value="Warm-up">Warm-up</option>
                            </Select>

                            <div style={{display:'flex', gap: '10px'}}>
                                <Input type="number" placeholder="Sets" required value={newExercise.numberOfSets} onChange={e => setNewExercise({...newExercise, numberOfSets: e.target.value})} />
                                <Input type="number" placeholder="Reps" required value={newExercise.repetitionsPerSet} onChange={e => setNewExercise({...newExercise, repetitionsPerSet: e.target.value})} />
                            </div>
                            
                            <label style={{fontSize: '12px', marginBottom:'5px', display:'block'}}>Difficulty (1-5)</label>
                            <Input type="number" min="1" max="5" required value={newExercise.difficulty} onChange={e => setNewExercise({...newExercise, difficulty: e.target.value})} />

                            <Button type="submit">Create Exercise</Button>
                        </form>
                    </ModalCard>
                </Overlay>
            )}
        </div>
    );
};

export default ExercisesPage;