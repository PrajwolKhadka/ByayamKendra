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
        const heightInMeters = (parseInt(feet) * 0.3048) + (parseInt(inches) * 0.0254);
        const weightInKg = parseInt(weight);
        const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
        setBmi(calculatedBmi);
    
        // WHO BMI Classification Logic with more detailed categories
        if (calculatedBmi < 16) {
            setBmiClassification("Severe Thinness");
        } else if (calculatedBmi >= 16 && calculatedBmi <= 16.9) {
            setBmiClassification("Moderate Thinness");
        } else if (calculatedBmi >= 17 && calculatedBmi <= 18.4) {
            setBmiClassification("Mild Thinness");
        } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
            setBmiClassification("Normal weight");
        } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
            setBmiClassification("Overweight");
        } else if (calculatedBmi >= 30 && calculatedBmi <= 34.9) {
            setBmiClassification("Obesity Class 1");
        } else if (calculatedBmi >= 35 && calculatedBmi <= 39.9) {
            setBmiClassification("Obesity Class 2");
        } else {
            setBmiClassification("Obesity Class 3");
        }
    };
    

    const calculateProteinIntake = () => {
        if (!bmi) return;
        
        const weightInKg = parseInt(weight);
        let protein = 0;
        if (bmi < 18.5) {
            protein = (1.2 * weightInKg).toFixed(2); // Underweight
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            protein = (1.6 * weightInKg).toFixed(2); // Normal weight
        } else if (bmi >= 25 && bmi <= 29.9) {
            protein = (2.0 * weightInKg).toFixed(2); // Overweight
        } else {
            protein = (2.2 * weightInKg).toFixed(2); // Obesity
        }
    
        setProteinIntake(protein); // Set the calculated protein intake correctly
    };
    

    const handleCalculate = () => {
        calculateBMI(); // Calculate BMI first
        calculateProteinIntake(); // Then calculate protein intake
    };

    return (
        <div className="dashboard-container">
            {/* Workout Generator */}
            <div className="dashboard-card">
                <h2>Workout Generator</h2>
                <p>Get personalized workouts based on your body index!</p>
                <Link to="/generate" className="dashboard-btn">Generate Workout</Link>
            </div>

            {/* BMI Index */}
            <div className="dashboard-card">
                <h2>BMI Index</h2>
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Feet"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Inches"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                />
                <button className="dashboard-btn" onClick={handleCalculate}>Calculate BMI & Protein Intake</button>
                {bmi && <p>Your BMI: {bmi}</p>}
                {bmiClassification && <p>BMI Classification: {bmiClassification}</p>}
            </div>

            {/* Protein Intake */}
            <div className="dashboard-card">
                <h2>Protein Intake</h2>
                {proteinIntake && <p>Recommended Protein Intake: <strong>{proteinIntake} grams</strong></p>}
                <p>Your average Protein Intake according to your BMI will be generated.<br />Keep a note that the recommended protein intake may vary upon individual factors.</p>
            </div>

            {/* Daily Challenge (User) */}
            <div className="dashboard-card">
                <h2>Today's Challenge</h2>
                {dailyChallenge ? (
                    <p>{dailyChallenge.challenge_text}</p>
                ) : (
                    <p>Loading today's challenge...</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
