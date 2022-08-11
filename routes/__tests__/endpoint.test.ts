import request from "supertest";
import express from "express";
import supertest from "supertest";
import start_server from "../../app";

const app = express();
const baseURL = "http://localhost:3000/action"


test("GET /testdrive-click", async () => {
    start_server()
    await supertest(baseURL)
    .get("/testdrive-click")
    .expect(200)
    .then((response) => {   
        expect(response.body.message).toEqual('https://www.ford.co.uk/shop/test-drive');
    })
});

test("GET /", async () => {
    start_server()
    await supertest(baseURL)
    .get("/testdrive-click")
    .expect(200)
    .then((response) => {   
        expect(response.body.message).toEqual('https://www.ford.co.uk/shop/test-drive');
    })
});

