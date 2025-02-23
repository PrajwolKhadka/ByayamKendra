import request from "supertest";
import app from "../index.js"; // Import your Express app
import jwt from 'jsonwebtoken';
import * as challengesModel from "../model/challengesModel.js"; // Import the actual model
import { getChallenge, getDayChallenge, addChallenges, updateChallenges, deleteChallenges } from "../controller/challengesController.js";

// Mock the database functions
jest.mock("../model/challengesModel.js");
jest.mock('../middleware/verifyToken.js', () => (req, res, next) => {
  req.user = { id: 1 }; 
  next();
});

const mockToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
describe("Challenges Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("GET /api/protected/admin/challenges should return all challenges", async () => {
        const mockChallenges = [
            { id: 1, challenge_text: "Do 20 push-ups" },
            { id: 2, challenge_text: "Run for 15 minutes" }
        ];
        challengesModel.getChallenges.mockResolvedValue(mockChallenges);

        const res = await request(app)
            .get("/api/protected/admin/challenges")
            .set("Authorization", `Bearer ${mockToken}`); // Mock auth token

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockChallenges);
        expect(challengesModel.getChallenges).toHaveBeenCalledTimes(1);
    });

    test("GET /api/protected/admin/daily should return a random challenge", async () => {
        const mockChallenges = [
            { id: 1, challenge_text: "Do 20 push-ups" },
            { id: 2, challenge_text: "Run for 15 minutes" }
        ];
        challengesModel.getChallenges.mockResolvedValue(mockChallenges);

        const res = await request(app)
            .get("/api/protected/admin/daily")
            .set("Authorization",  `Bearer ${mockToken}`);

        expect(res.status).toBe(200);
        expect(mockChallenges).toContainEqual(res.body); // Ensure response is one of the mock challenges
        expect(challengesModel.getChallenges).toHaveBeenCalledTimes(1);
    });

    test("POST /api/protected/admin/challenges should add a challenge", async () => {
        challengesModel.addChallenge.mockResolvedValue(); // Mock successful insert

        const res = await request(app)
            .post("/api/protected/admin/challenges")
            .send({ challenge_text: "Try a 30s plank" })
            .set("Authorization",  `Bearer ${mockToken}`);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: "Challenge added successfully" });
        expect(challengesModel.addChallenge).toHaveBeenCalledWith("Try a 30s plank");
    });

    test("PUT /api/protected/admin/challenges/:id should update a challenge", async () => {
        challengesModel.updateChallenge.mockResolvedValue(1); // Simulate a successful update
    
        const res = await request(app)
            .put("/api/protected/admin/challenges/1") // ID in URL
            .send({ id: "1", challenge_text: "Updated push-ups" }) // Only challenge_text in body
            .set("Authorization", `Bearer ${mockToken}`);
    
        expect(res.status).toBe(200);
        expect(res.text).toBe("Challenge updated"); // Match response format
        expect(challengesModel.updateChallenge).toHaveBeenCalledWith("1", "Updated push-ups");
    });
    

    test("DELETE /api/protected/admin/challenges/:id should delete a challenge", async () => {
        challengesModel.deleteChallenge.mockResolvedValue(); // Mock successful delete

        const res = await request(app)
            .delete("/api/protected/admin/challenges/1")
            .set("Authorization",  `Bearer ${mockToken}`);

        expect(res.status).toBe(200);
        expect(res.text).toBe("Challenge deleted");
        expect(challengesModel.deleteChallenge).toHaveBeenCalledWith("1");
    });

    test("POST /api/protected/admin/challenges should return 400 if challenge_text is missing", async () => {
        const res = await request(app)
            .post("/api/protected/admin/challenges")
            .send({}) // No challenge_text
            .set("Authorization",  `Bearer ${mockToken}`);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Challenge text is required" });
    });
});
