import request from "supertest";
import express from "express";
import supertest from "supertest";
import { start_server } from "../../server/server";

const baseURL = "http://localhost:3000/action";

describe("endpoint testing", () => {
    start_server();

    //Testdrive endpoint testing
    test("GET /testdrive-click", async () => {
        await supertest(baseURL)
            .get("/testdrive-click")
            .expect(200) //the right status code
            .then((response) => {
                expect(response.body.message).toEqual(
                    "https://www.ford.co.uk/shop/test-drive" // the right link
                );
            });
    });

    //Booking a service endpoint test
    test("GET /book-service-click", async () => {
        //start_server();
        await supertest(baseURL)
            .get("/book-service-click")
            .expect(200) //the right status code
            .then((response) => {
                expect(response.body.message).toEqual(
                    "https://www.ford.co.uk/support/book-a-service/dealer-step" // the right link
                );
            });
    });

    //test the price comparing endpoint
    test("GET /price compare", async () => {
        //start_server();
        await supertest(baseURL)
            .get("/price-comp-click")
            .expect(200) //the right status code
            .then((response) => {
                expect(response.body.message).toEqual(
                    "http://www.compare.ford.co.uk/home?kee=380519" // the right link
                );
            });
    });
});
