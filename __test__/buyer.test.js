const mongoose = require("mongoose");
const app = require('../server')
const request = require('supertest')


beforeAll((done) => {
    mongoose.connect("mongodb+srv://farm-to-mart:Bh1eDPKbuFTGnXm8@cluster0.knoo6tu.mongodb.net/FarmToMartMock",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

describe("Buyer", () => {
    describe("given a all data", () => {
        test("should responce with 201 code", async() => {
            // const request = require('supertest')
            const responce = await request(app).post("/api/farmer/register").send({
                "firstName":"Sumeela",
                "lastName":"Madusankha",
                "address":"Kotapola,Deniyaya",
                "phone":"0766929289",
                "district":"Matara",
                "gsdName":"Uamalagoda",
                "gsdCode":"123",
                "email":"asumea@gmail.com",
                "nic":"990910230V",
                "password":"@Farmer123"
            })
            expect(responce.statusCode).toBe(200)
        })

    })

    describe("not given some data", () => {
        test("should responce with 201 code", async() => {
            // const request = require('supertest')
            const responce = await request(app).post("/api/farmer/register").send({
                "firstName":"Sumeela",
                "lastName":"Madusankha",
                "address":"Kotapola,Deniyaya",
                "phone":"0766929289",
                "district":"Matara",
                "gsdName":"Usamalagoda",
                "gsdCode":"123",
                "email":"asumla@gmail.com",
                "nic":null,
                "password":null
            })
            expect(responce.statusCode).toBe(400)
        })

    })


})