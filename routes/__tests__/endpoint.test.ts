import request from "supertest";
import express from "express";

const app = express();
const baseURL = "http://127.0.0.1:3000/action"

describe("GET /testdrive-click", () => {
  it("clicks testdrive", async () => {
    const result = await request(app).get("/action/testdrive-click");
    expect(result.body.message).toContain("https://www.ford.co.uk/shop/test-drive");
    
    expect(result.statusCode).toEqual(200);
  });
});

