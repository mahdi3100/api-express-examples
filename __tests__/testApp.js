const request = require("supertest");
const app = require("../app");


describe("Test the root path", () => {

  //TEST if file json is upload it with no error
  test("GET / ", async () => {
    
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
 

  });

  //TEST if the biggest chunk of transaction will return corectly
  test("GET /big", async () => {
    
    const response = await request(app).get("/big");
    expect(response.statusCode).toBe(200);

  });

  //TEST with unexisted random paramatere iban 
  test("GET /?iban=error", async () => {
    
    const response = await request(app).get("/?iban=error");
    expect(response.statusCode).toBe(404);

  });
});