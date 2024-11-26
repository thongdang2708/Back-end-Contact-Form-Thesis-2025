// Mock the fetch function
const fetch = require('node-fetch');
const request = require("supertest");
const app = require("../app");
jest.mock('node-fetch', () => jest.fn());

describe('GET Check valid postal code', () => {

    beforeEach(() => {
      jest.clearAllMocks();  // Clear jest spies/mocks before each test
    });

    it('should check correctly', async () => {
      const mockResponse = {postalCodeValid: true};
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
  
      const res = await request(app).get('/api/v1/postal-code/02650');
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });  
});