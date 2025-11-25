import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api/axiosConfig';

const FormCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
`;

const SendButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #2E7D32;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover { background-color: #1B5E20; }
`;

const NotificationsPage = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [group, setGroup] = useState('ALL');

    const handleSend = (e) => {
        e.preventDefault();
        
        const payload = {
            group: group,
            title: title,
            body: body
        };

        api.post('/admin/sendNotification', payload)
           .then(() => {
               alert('Notification Sent!');
               setTitle('');
               setBody('');
           })
           .catch(err => alert('Error: ' + err.message));
    };

    return (
        <div>
            <h2 style={{color: '#1B5E20'}}>Send Push Notification</h2>
            <FormCard>
                <form onSubmit={handleSend}>
                    <Label>Target Group</Label>
                    <Select value={group} onChange={e => setGroup(e.target.value)}>
                        <option value="ALL">All Users</option>
                        <option value="PREMIUM">Premium Users</option>
                        <option value="Standard">Standard Users</option>
                    </Select>

                    <Label>Title</Label>
                    <Input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        required 
                    />

                    <Label>Message Body</Label>
                    <Input 
                        as="textarea" 
                        rows="4"
                        value={body} 
                        onChange={e => setBody(e.target.value)} 
                        required 
                    />

                    <SendButton type="submit">Send Notification</SendButton>
                </form>
            </FormCard>
        </div>
    );
};

export default NotificationsPage;