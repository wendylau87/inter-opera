import React from 'react';
import styled from 'styled-components';

const DetailContainer = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin-bottom: 0.75rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const SkillTag = styled.span`
  display: inline-block;
  background-color: #e0f7fa;
  color: #006064;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const DealCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DealStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    if (props.status === 'Closed Won') {
      return `
        background-color: #e8f5e9;
        color: #2e7d32;
      `;
    } else if (props.status === 'Closed Lost') {
      return `
        background-color: #ffebee;
        color: #c62828;
      `;
    } else {
      return `
        background-color: #fff8e1;
        color: #f57f17;
      `;
    }
  }}
`;

const ClientCard = styled.div`
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.75rem;
`;

const SalesRepDetail = ({ salesRep, onClose }) => {
  if (!salesRep) return null;
  
  return (
    <DetailContainer>
      <DetailHeader>
        <h2>{salesRep.name} - {salesRep.role}</h2>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </DetailHeader>
      
      <Section>
        <p><strong>Region:</strong> {salesRep.region}</p>
      </Section>
      
      <Section>
        <SectionTitle>Skills</SectionTitle>
        <div>
          {salesRep.skills.map((skill, index) => (
            <SkillTag key={index}>{skill}</SkillTag>
          ))}
        </div>
      </Section>
      
      <Section>
        <SectionTitle>Deals ({salesRep.deals.length})</SectionTitle>
        {salesRep.deals.map((deal, index) => (
          <DealCard key={index}>
            <div>
              <div><strong>{deal.client}</strong></div>
              <div>${deal.value.toLocaleString()}</div>
            </div>
            <DealStatus status={deal.status}>{deal.status}</DealStatus>
          </DealCard>
        ))}
      </Section>
      
      <Section>
        <SectionTitle>Clients ({salesRep.clients.length})</SectionTitle>
        {salesRep.clients.map((client, index) => (
          <ClientCard key={index}>
            <div><strong>{client.name}</strong></div>
            <div>Industry: {client.industry}</div>
            <div>Contact: {client.contact}</div>
          </ClientCard>
        ))}
      </Section>
    </DetailContainer>
  );
};

export default SalesRepDetail; 