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
    const navigate =useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect to login if no token is found
        }
        fetchStatusData();
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

    const calculateBMI = () => {
        if (weight && feet) {
            // Convert feet & inches to meters
            const totalHeightInFeet = parseFloat(feet) + (parseFloat(inches) || 0) / 12;
            const heightInMeters = totalHeightInFeet * 0.3048;

            // BMI Calculation
            const bmiValue = weight / (heightInMeters * heightInMeters);
            setBmi(bmiValue.toFixed(2));
            setBmiClassification(classifyBMI(bmiValue));
        }
    };

    const classifyBMI = (bmiValue) => {
        if (bmiValue < 16) {
          return 'Severe Thinness';
        } else if (bmiValue >= 16 && bmiValue < 17) {
          return 'Moderate Thinness';
        } else if (bmiValue >= 17 && bmiValue < 18.5) {
          return 'Mild Thinness';
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
          return 'Normal';
        } else if (bmiValue >= 25 && bmiValue < 30) {
          return 'Overweight';
        } else if (bmiValue >= 30 && bmiValue < 35) {
          return 'Obese Class I';
        } else if (bmiValue >= 35 && bmiValue < 40) {
          return 'Obese Class II';
        } else {
          return 'Obese Class III';
        }
      };

    const calculateProteinIntake = () => {
        if (weight) {
            const proteinValue = weight * 0.8; // Recommended protein intake in grams
            setProteinIntake(proteinValue.toFixed(2));
        }
    };

    const handleCalculate = () => {
        calculateBMI();
        calculateProteinIntake();
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
                <p>Your average Protein Intake according to your BMI will be generated.<br>
                </br>Keep a note that the recommended protein intake may vary upon individual factors.</p>
            </div>
        </div>
    );
}

export default Dashboard;
