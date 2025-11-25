import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api/axiosConfig';
import { 
    MdPeople, MdFitnessCenter, MdDirectionsRun, MdStar, 
    MdCheckCircle, MdBlock 
} from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// --- STYLES ---

const DashboardContainer = styled.div`
  padding-bottom: 50px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  color: #1B5E20;
  margin: 0 0 5px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const IconBox = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  
  &.green { background: #E8F5E9; color: #2E7D32; }
  &.gold { background: #FFF8E1; color: #FFB300; }
  &.blue { background: #E3F2FD; color: #1E88E5; }
  &.red { background: #FFEBEE; color: #D32F2F; }
`;

const StatInfo = styled.div`
  h3 { margin: 0 0 5px 0; font-size: 28px; color: #333; }
  p { margin: 0; color: #888; font-size: 13px; font-weight: 600; text-transform: uppercase; }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  min-height: 350px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
`;

// --- COMPONENT ---

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                // Mock data w razie błędu, żebyś widział jak to wygląda
                setStats({
                    totalUsers: 0,
                    activeUsers: 0,
                    bannedUsers: 0,
                    premiumUsers: 0,
                    totalTrainings: 0,
                    totalExercises: 0
                });
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    // Dane do wykresów
    const premiumData = [
        { name: 'Premium', value: stats.premiumUsers },
        { name: 'Standard', value: stats.totalUsers - stats.premiumUsers },
    ];
    const PREMIUM_COLORS = ['#FFB300', '#E0E0E0'];

    const statusData = [
        { name: 'Active', value: stats.activeUsers },
        { name: 'Banned', value: stats.bannedUsers },
        { name: 'Inactive', value: stats.totalUsers - stats.activeUsers - stats.bannedUsers }
    ];

    return (
        <DashboardContainer>
            <Header>
                <Title>Dashboard Overview</Title>
                <Subtitle>Welcome back, Admin! Here's what's happening today.</Subtitle>
            </Header>

            {/* --- STAT CARDS --- */}
            <StatsGrid>
                <StatCard>
                    <IconBox className="green"><MdPeople /></IconBox>
                    <StatInfo>
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </StatInfo>
                </StatCard>

                <StatCard>
                    <IconBox className="gold"><MdStar /></IconBox>
                    <StatInfo>
                        <h3>{stats.premiumUsers}</h3>
                        <p>Premium Subscribers</p>
                    </StatInfo>
                </StatCard>

                <StatCard>
                    <IconBox className="blue"><MdFitnessCenter /></IconBox>
                    <StatInfo>
                        <h3>{stats.totalTrainings}</h3>
                        <p>Training Plans</p>
                    </StatInfo>
                </StatCard>

                <StatCard>
                    <IconBox className="red"><MdDirectionsRun /></IconBox>
                    <StatInfo>
                        <h3>{stats.totalExercises}</h3>
                        <p>Exercises in DB</p>
                    </StatInfo>
                </StatCard>
            </StatsGrid>

            {/* --- CHARTS --- */}
            <ChartsSection>
                {/* Wykres Kołowy: Premium vs Standard */}
                <ChartCard>
                    <ChartTitle>User Subscription Ratio</ChartTitle>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={premiumData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {premiumData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PREMIUM_COLORS[index % PREMIUM_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Wykres Słupkowy: Statusy Użytkowników */}
                <ChartCard>
                    <ChartTitle>User Account Status</ChartTitle>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" fill="#2E7D32" radius={[10, 10, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </ChartsSection>

        </DashboardContainer>
    );
};

export default DashboardPage;