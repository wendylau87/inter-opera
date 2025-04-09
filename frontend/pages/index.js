// frontend/pages/index.js
import { useState, useEffect, useRef } from "react";
import SalesTable from "../components/SalesTable";
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

const AISection = styled.section`
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResponseBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  max-height: ${props => props.expanded ? 'none' : '200px'};
  overflow-y: ${props => props.expanded ? 'visible' : 'auto'};
  position: relative;
  transition: max-height 0.3s ease;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-weight: bold;
  display: ${props => props.show ? 'block' : 'none'};
  
  &:hover {
    text-decoration: underline;
  }
`;

const ResponseContent = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
`;

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [responseHeight, setResponseHeight] = useState(0);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setExpanded(false);
    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }
      
      const data = await response.json();
      setAnswer(data.answer);
      
      // Reset response height measurement
      setTimeout(() => {
        const responseElement = document.getElementById('response-content');
        if (responseElement) {
          setResponseHeight(responseElement.scrollHeight);
        }
      }, 100);
    } catch (error) {
      console.error("Error in AI request:", error);
      setAnswer("Sorry, there was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Container>
      <Header>Sales Representatives</Header>
      
      <SalesTable />
      
      <AISection>
        <h2>Ask a Question (AI Endpoint)</h2>
        <InputGroup>
          <Input
            type="text"
            placeholder="Enter your question about sales data..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          />
          <Button onClick={handleAskQuestion} disabled={loading}>
            {loading ? "Processing..." : "Ask"}
          </Button>
        </InputGroup>
        
        <ResponseBox expanded={expanded}>
          {loading ? (
            <p>Thinking...</p>
          ) : answer ? (
            <>
              <strong>AI Response:</strong>
              <ResponseContent id="response-content">
                {answer}
              </ResponseContent>
              <ExpandButton 
                onClick={toggleExpand} 
                show={responseHeight > 180}
              >
                {expanded ? "Show Less" : "Show More"}
              </ExpandButton>
            </>
          ) : (
            <p>Ask a question to get insights about your sales data.</p>
          )}
        </ResponseBox>
      </AISection>
    </Container>
  );
}