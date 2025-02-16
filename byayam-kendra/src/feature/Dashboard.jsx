import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../css/ByayamDashboard.css";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [statusData, setStatusData] = useState(null);
    const [error, setError] = useState(null);
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [bmi, setBmi] = useState(null);
    const [bmiClassification, setBmiClassification] = useState('');
    const [proteinIntake, setProteinIntake] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');
    const [dailyChallenge, setDailyChallenge] = useState(null);
    const [challenges, setChallenges] = useState([]); // For Admin to see all challenges
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if no token is found
        }
        fetchStatusData();
        fetchDailyChallenge();
    }, [navigate]);

    const fetchStatusData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('User is not authenticated');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/protected/status/Status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStatusData(data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Error fetching status data');
        }
    };

    const fetchDailyChallenge = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError('Token not found');
            return;
        }
    
        const storedChallenge = localStorage.getItem('dailyChallenge');
        const storedTimestamp = localStorage.getItem('challengeTimestamp');
        
        const now = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    
        if (storedChallenge && storedTimestamp && (now - storedTimestamp) < oneDay) {
            setDailyChallenge(JSON.parse(storedChallenge)); // Use the stored challenge
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/protected/admin/daily', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch daily challenge');
            }
    
            // Store the fetched challenge and timestamp in localStorage
            localStorage.setItem('dailyChallenge', JSON.stringify(data));
            localStorage.setItem('challengeTimestamp', now.toString());
    
            setDailyChallenge(data);
        } catch (err) {
            console.error('Error fetching daily challenge:', err);
            setError('Error fetching daily challenge');
        }
    };

    const calculateBMI = () => {
        const feetValue = parseFloat(feet) || 0;
        const inchesValue = parseFloat(inches) || 0;
        const weightValue = parseFloat(weight) || 0;
        
        const heightInMeters = feetValue * 0.3048 + inchesValue * 0.0254;
        if (heightInMeters <= 0 || weightValue <= 0) {
          setBmi(null);
          setBmiClassification("");
          return null;
        }
        
        const calculatedBmi = (weightValue / (heightInMeters ** 2)).toFixed(2);
        setBmi(calculatedBmi);
        
        // Set BMI classification
        if (calculatedBmi < 16) setBmiClassification("Severe Thinness");
        else if (calculatedBmi < 17) setBmiClassification("Moderate Thinness");
        else if (calculatedBmi < 18.5) setBmiClassification("Mild Thinness");
        else if (calculatedBmi < 25) setBmiClassification("Normal weight");
        else if (calculatedBmi < 30) setBmiClassification("Overweight");
        else if (calculatedBmi < 35) setBmiClassification("Obesity Class 1");
        else if (calculatedBmi < 40) setBmiClassification("Obesity Class 2");
        else setBmiClassification("Obesity Class 3");
        
        return calculatedBmi; // Return the calculated BMI
      };
      
      const calculateProteinIntake = (bmiValue) => {
        const weightValue = parseFloat(weight) || 0;
        if (!bmiValue || weightValue <= 0) {
          setProteinIntake(null);
          return;
        }
      
        let protein;
        if (bmiValue < 18.5) protein = weightValue * 1.2;
        else if (bmiValue < 25) protein = weightValue * 1.6;
        else if (bmiValue < 30) protein = weightValue * 2.0;
        else protein = weightValue * 2.2;
        
        setProteinIntake(protein.toFixed(2));
      };
      
      const handleCalculate = () => {
        const newBmi = calculateBMI(); // Get the latest BMI
        calculateProteinIntake(newBmi); // Pass it directly
      };

    return (
        <div className="dashboard-wrapper">
        <div className="dashboard-container">
            {/* Workout Generator */}
            <div className="dashboard-card">
                <h2 className="dashboard-card__title">Workout Generator</h2>
                <p className="dashboard-card__text">Get personalized workouts based on your body index!</p>
                <Link to="/generate" className="dashboard-card__btn">Generate Workout</Link>
            </div>

            {/* BMI Index */}
            <div className="dashboard-card">
                <h2 className="dashboard-card__title">BMI Index</h2>
                <input 
                    type="number" 
                    placeholder="Age" 
                    min="0"
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    />
                <input 
                    type="number" 
                    placeholder="Weight (kg)" 
                    min="0"
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder="Feet" 
                    min="0"
                    value={feet} 
                    onChange={(e) => setFeet(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder="Inches" 
                    min="0" 
                    max="11"
                    value={inches} 
                    onChange={(e) => setInches(e.target.value)} 
                />
                <button className="dashboard-card__btn_bmi" onClick={handleCalculate}>Calculate BMI & Protein Intake</button>
                {bmi && <p className="dashboard-card__result"> Your BMI: {bmi}</p>}
                {bmiClassification && <p className="dashboard-card__highlight">BMI Classification: {bmiClassification}</p>}
            </div>

            {/* Protein Intake */}
            <div className="dashboard-card">
                <h2  className="dashboard-card__title">Protein Intake</h2>
                <p className="dashboard-card__result">Recommended Protein Intake: <strong>{proteinIntake} grams</strong></p>
                <p className="dashboard-card__result">Your average Protein Intake according to your BMI will be generated.<br />Keep a note that the recommended protein intake may vary upon individual factors.</p>
            </div>

            {/* Daily Challenge (User) */}
            <div className="dashboard-card dashboard-card--challenge">
                <h2 className="dashboard-card__title">Today's Challenge</h2>
                {dailyChallenge ? (
                    <p className="dashboard-card__text_ch">💪🏼{dailyChallenge.challenge_text}🏋️‍♂️</p>
                ) : (
                    <p className="dashboard-card__text_ch">Loading today's challenge...</p>
                )}
                <p className="dashboard-card__text">ByayamKendra Team will provide you with a daily challenge to help you stay on track with your fitness goals.
                    These challenges may not be based on your fitness level, age, and other factors but will be helpful to boost your motivation 
                    and stay consistent.<br/>
                    To keep the track of your daily challenges, Keep Track via <Link to="/tracker" className='dashboard-card_link'>Byayam Tracker</Link>.</p>
            </div>
        </div>
        </div>
    );
}

export default Dashboard;
