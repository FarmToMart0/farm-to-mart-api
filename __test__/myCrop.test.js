const mongoose = require("mongoose");
const app = require('../index.js')
const request = require('supertest')
require('dotenv').config();

beforeEach(async () => {
    await mongoose.connect('mongodb+srv://farm-to-mart:eLHmnVHPCtOq5mQm@cluster0.8questr.mongodb.net/FarmToMart')
});

describe("add crop data", () => {
    describe("given a id", () => {
        test("should responce with 201 code", async() => {
            // const request = require('supertest')
            const responce = await request(app).post("/api/gso/add-crop-details").send({
                farmerNic: "990910820V",
                category: "abc",
                cropType: "bbb",
                status: "bb",
                startingDateOfGrowing: "2022-11-16T00:00:00.100+00:00",
                expectingDateOfHarvest: "2022-11-16T00:00:00.100+00:00",
                expectedAmount: 0,
                harvestedAmount:0,
                landArea:7,
                location:"kmk",
                district:"hh"
            })
            expect(responce.statusCode).toBe(200)
        })

    })

    describe("not given a id", () => {
        test("should responce with 201 code", async() => {
            // const request = require('supertest')
            const responce = await request(app).post("/api/gso/add-crop-details").send({
                farmerNic: "",
                category: "abc",
                cropType: "bbb",
                status: "bb",
                startingDateOfGrowing: "2022-11-16T00:00:00.100+00:00",
                expectingDateOfHarvest: "2022-11-16T00:00:00.100+00:00",
                expectedAmount: 0,
                harvestedAmount:0,
                landArea:7,
                location:"kmk",
                district:"hh"
            })
            expect(responce.statusCode).toBe(400)
        })

    })


})

afterEach(async () => {
    await mongoose.connection.close();
});




