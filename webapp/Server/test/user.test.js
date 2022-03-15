const assert =require('chai').assert;
const userController =require("../controllers/user.controller");
const request =require('supertest');
const app=require("../app");
const chai =require('chai');
const chaiHttp= require('chai-http');



/* chai.should();

chai.use(chaiHttp);


//used for test unit test
/* describe("Test for create user api",()=>{
    it("GET/user/self",()=>{
        return request(app).get('/todos')
        .expect('Content-Type',/json/).expect(200)
        .then((response)=>{
            expect(response.body).toEqual(
                
                    expect.arrayContaining([
                        expect.objectContaining({
                            id:expect.any(Number),
                            name:expect.any(String),
                            completed:expect.any(Boolean)
                        })
                    ])
                
            )
        })
    });
}) */

describe("Test for create user api",()=>{
    it("POST/user with Validation failed return 400",()=>{
        return request(app).post('/v2/user')
        .send({
            username:"sdf"
        }).expect(400)
        
    });
})

describe("Test for get self Token",()=>{
    it("GET/user/self with Unauthorized return 401",()=>{
        return request(app).get('/v2/user/self')
        .send({
            username:"sdf"
        }).expect(401)
        
    });
})

describe("Test for Update",()=>{
    it("PUT/user/self with Unauthorized return 401",()=>{
        return request(app).put('/v2/user/self')
        .send({
            
        }).expect(401)
        
    });
})



