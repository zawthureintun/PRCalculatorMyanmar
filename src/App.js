import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

function App() {
  const [parties, setParties] = useState([]);
  const [partyVotes, setPartyVotes] = useState({});
  const [totalValidVoteCount, setTotalValidVoteCount] = useState(0);
  const [numberOfSeats, setNumberOfSeats] = useState(0);
  const [thresholdVote, setThresholdVote] = useState(0);
  const [winners, setWinners] = useState([]);
  const [electoralArea,setElectroalArea]=useState('');

  const handleAddParty = () => {
    setParties(prevParties => [...prevParties, '']);
  };

  const handlePartyNameChange = (index, event) => {
    const updatedParties = [...parties];
    updatedParties[index] = event.target.value;
    setParties(updatedParties);
  };

  const handleVoteCountChange = (party, event) => {
    setPartyVotes(prevVotes => ({
      ...prevVotes,
      [party]: parseInt(event.target.value, 10)
    }));
  };

  const handleCalculateThreshold = () => {
    const threshold = Math.floor((totalValidVoteCount / (numberOfSeats + 1)) + 1);
    setThresholdVote(threshold);
  };

  const handleCalculateWinners = () => {
    const winners = [];
    const sortedParties = Object.entries(partyVotes).sort((a, b) => b[1] - a[1]); // Sort parties by votes

    let remainingSeats = numberOfSeats;

    sortedParties.forEach(([party, votes]) => {
      const seats = Math.floor(votes / thresholdVote); // Number of seats won without residual votes
      const residualVotes = votes % thresholdVote; // Calculate residual votes for this party

      remainingSeats -= seats; // Deduct initial seats from remaining

      winners.push({ party, votes, initialWinners: seats, additionalWinners: 0, residualVotes });
    });

    // Distribute remaining seats based on residual votes
    while (remainingSeats > 0) {
      winners.sort((a, b) => b.residualVotes - a.residualVotes); // Sort by residual votes in descending order
      let index = 0;
      while (remainingSeats > 0 && index < winners.length) {
        winners[index].additionalWinners++;
        remainingSeats--;
        index++;
      }
    }

    // Calculate total winners for each party
    winners.forEach((winner) => {
      winner.totalWinners = winner.initialWinners + winner.additionalWinners;
    });

    

    // Sort winners by total number of seats in descending order
    winners.sort((a, b) => b.totalWinners - a.totalWinners);

    setWinners(winners);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleCalculateThreshold();
  };

  // Add total row
  const totalVotes = Object.values(partyVotes).reduce((total, count) => total + count, 0);
  const totalInitialWinners = winners.reduce((total, winner) => total + winner.initialWinners, 0);
  const totalResidualVotes = winners.reduce((total, winner) => total + winner.residualVotes, 0);
  const totalAdditionalWinners = winners.reduce((total, winner) => total + winner.additionalWinners, 0);
  const totalTotalWinners = winners.reduce((total, winner) => total + winner.totalWinners, 0);

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">အချိုးကျကိုယ်စားပြု ‌ရွေးကောက်ပွဲစနစ် ကိုယ်စားလှယ်တွက်ချက်မှု</h1>
          <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="electroalArea">
              <Form.Label column sm={4}>မဲဆန္ဒနယ်အမည်</Form.Label>
              <Col sm={8}>
                <Form.Control type="text" className='p-3 mb-2' value={electoralArea} onChange={(e) => setElectroalArea(e.target.value)} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="totalValidVoteCount">
              <Form.Label column sm={4}>ခိုင်လုံမဲစုစုပေါင်း</Form.Label>
              <Col sm={8}>
                <Form.Control type="number" className='p-3' value={totalValidVoteCount} onChange={(e) => setTotalValidVoteCount(parseInt(e.target.value, 10))} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="numberOfSeats" className='mt-2'>
              <Form.Label column sm={4}>ကိုယ်စားလှယ်အရေအတွက်</Form.Label>
              <Col sm={8}>
                <Form.Control type="number" value={numberOfSeats} className='p-3' onChange={(e) => setNumberOfSeats(parseInt(e.target.value, 10))} />
                <Button type="submit" variant="primary" onClick={handleCalculateThreshold} className='mt-2 p-3'>တွက်ချက်ပါ</Button>
              </Col>
            </Form.Group>
           
          </Form>
          {thresholdVote > 0 && (
            <p className="mt-2">ကိုယ်စားလှယ်တစ်ဦးဖြစ်ရန်မဲ: <strong>{thresholdVote}</strong></p>
          )}
         
          {parties.map((party, index) => (
            <Row key={index} className="mt-3">
              <Col sm={4}>
                <Form.Control type="text" className='mb-2 p-3' placeholder='ပါတီအမည်' value={party} onChange={(e) => handlePartyNameChange(index, e)} />
              </Col>
              <Col sm={4}>
                <Form.Control type="number" className='p-3' placeholder='ရရှိသည့်ဆန္ဒမဲအရေအတွက်' value={partyVotes[party] || ''} onChange={(e) => handleVoteCountChange(party, e)} />
              </Col>
            </Row>
          ))}
          <Button className="mt-3 mr-5 p-3" onClick={handleAddParty} variant='danger' style={{marginRight:5}}>ပါတီအမည်ထည့်သွင်းရန်</Button>
          <Button className="mt-3 ml-5 p-3" onClick={handleCalculateWinners} variant='success'>ကိုယ်စားလှယ်ရလာဒ်တွက်ချက်ပါ</Button>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-3">ကိုယ်စားလှယ်ဦးရေ ရလာဒ်ဇယား</h2>
          <h5 className="text-left mb-3">{electoralArea}</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ပါတီအမည်</th>
                <th>ရရှိသည့်ဆန္ဒမဲပေါင်း</th>
                <th>ကနဦးရရှိသည့်ကိုယ်စားလှယ်ဦးရေ</th>
                <th>ကြွင်းကျန်မဲပေါင်း</th>
                <th>ကြွင်းကျန်မဲမှထပ်မံရရှိသည့်ကိုယ်စားလှယ်ဦးရေ</th>
                <th>ကိုယ်စားလှယ်ဦးရေ</th>
              </tr>
            </thead>
            <tbody>
              {winners.map(({ party, votes, initialWinners, residualVotes, additionalWinners, totalWinners }) => (
                <tr key={party}>
                  <td>{party}</td>
                  <td>{votes}</td>
                  <td>{initialWinners}</td>
                  <td>{residualVotes}</td>
                  <td>{additionalWinners}</td>
                  <td>{totalWinners}</td>
                </tr>
              ))}
               <tr>
          <td>စုစုပေါင်း</td>
          <td>{totalVotes}</td>
          <td>{totalInitialWinners}</td>
          <td></td>
          <td>{totalAdditionalWinners}</td>
          <td>{totalTotalWinners}</td>
        </tr>
            </tbody>
          </Table>
        </Col>
        <p style={{textAlign:'center'}}>Developed By ZTRT</p>
      </Row>
    </Container>
  );
}

export default App;
