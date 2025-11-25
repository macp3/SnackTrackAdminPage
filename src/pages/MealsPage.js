import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api/axiosConfig';
import { MdSearch, MdDelete, MdRestaurant, MdImage, MdWarning } from 'react-icons/md';

// ==========================================
// 🎨 STYLES
// ==========================================

const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

const Container = styled.div`
  padding-bottom: 50px;
  animation: ${fadeIn} 0.4s ease-out;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const MealCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
`;

const MealImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 180px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  flex-direction: column;
  gap: 5px;
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MealName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
`;

const AuthorInfo = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const DeleteButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  background-color: #FFEBEE;
  color: #D32F2F;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;
  margin-top: auto;

  &:hover {
    background-color: #FFCDD2;
  }
`;

// ==========================================
// ⚛️ COMPONENT
// ==========================================

const MealsPage = () => {
    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeals();
    }, []);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const results = meals.filter(meal => 
            meal.name.toLowerCase().includes(lowerTerm) || 
            (meal.description && meal.description.toLowerCase().includes(lowerTerm))
        );
        setFilteredMeals(results);
    }, [searchTerm, meals]);

    const fetchMeals = () => {
        setLoading(true);
        // Używamy endpointu z AdminController, który dodaliśmy w kroku 1
        api.get('/admin/meals')
           .then(res => {
               setMeals(res.data);
               setFilteredMeals(res.data);
               setLoading(false);
           })
           .catch(err => {
               console.error(err);
               setLoading(false);
           });
    };

    const handleDelete = (mealId) => {
        if(!window.confirm("Are you sure you want to delete this meal permanently?")) return;

        // Używamy endpointu "God Mode" z AdminController
        api.delete(`/admin/meals/${mealId}/delete`)
           .then(() => {
               alert("Meal deleted successfully.");
               // Aktualizacja lokalna
               setMeals(prev => prev.filter(m => m.id !== mealId));
           })
           .catch(err => alert("Error: " + (err.response?.data || err.message)));
    };

    if (loading) return <div style={{padding:40, textAlign:'center'}}>Loading meals...</div>;

    return (
        <Container>
            <HeaderContainer>
                <PageHeader>Global Meal Database</PageHeader>
                <SearchWrapper>
                    <MdSearch size={20} color="#888" />
                    <SearchInput 
                        placeholder="Search meals..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </SearchWrapper>
            </HeaderContainer>

            <Grid>
                {filteredMeals.length === 0 && (
                    <div style={{gridColumn: '1/-1', textAlign:'center', color:'#999', padding:40}}>
                        No meals found.
                    </div>
                )}

                {filteredMeals.map(meal => (
                    <MealCard key={meal.id}>
                        {meal.imageUrl ? (
                            <MealImage 
                                src={`http://localhost:8080${meal.imageUrl}`} 
                                alt={meal.name}
                                onError={(e) => {e.target.src='https://via.placeholder.com/400x200?text=No+Image'}}
                            />
                        ) : (
                            <PlaceholderImage>
                                <MdImage size={30} />
                                <span style={{fontSize: 12}}>No Image</span>
                            </PlaceholderImage>
                        )}
                        
                        <CardContent>
                            <MealName>{meal.name}</MealName>
                            <AuthorInfo>Author ID: {meal.authorId}</AuthorInfo>
                            
                            <Description>
                                {meal.description || "No description provided."}
                            </Description>

                            <DeleteButton onClick={() => handleDelete(meal.id)}>
                                <MdDelete size={18} /> Delete
                            </DeleteButton>
                        </CardContent>
                    </MealCard>
                ))}
            </Grid>
        </Container>
    );
};

export default MealsPage;