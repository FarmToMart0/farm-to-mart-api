const mongoose = require("mongoose");
const app = require('../server')
const request = require('supertest')


beforeAll((done) => {
    mongoose.connect("mongodb+srv://farm-to-mart:Bh1eDPKbuFTGnXm8@cluster0.knoo6tu.mongodb.net/FarmToMartMock",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterAll((done) => {
    mongoose.connection.close(() => done())
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






