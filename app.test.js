
import request  from "supertest";
import app from "./app.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const msgs = require('./msgs.json')
const token = { accessToken: 'ihaveloggedin'}

describe('POST /api/message', () => {
    /*const dummy = {
        id: msgs.messages.length,
        message: 'automatic test',
        createdDate: Date.now()
    }*/

    test('should respond with 200 status code', async() => {
        const response = await request(app).post("/api/message").send({message: 'test'}).set(token);
        expect(response.statusCode).toBe(200)
    });
    
})

describe('GET /api/message/:1', () => {

    test('should respond with 200 status code', async() => {
        const response = await request(app).get("/api/message/0").send().set(token);
        expect(response.statusCode).toBe(200)
    });

    test('should respond with a message', async () => {
        const response = await request(app).get("/api/message/0").send().set(token);
        expect(response.body.id).toBeDefined();
        expect(response.body.message).toBeDefined();
        expect(response.body.createdDate).toBeDefined();
    });
    
})