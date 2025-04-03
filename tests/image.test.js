const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const supertest = require('supertest');
const api = supertest(app);
const helper = require('../src/utils/test_helper');

// Tested Endpoints:
// POST /api/v1/images/uploadImage
// POST /api/v1/images/uploadImages
// GET /api/v1/images
// GET /api/v1/images/:id
// DELETE /api/v1/images/:id

// Test variables
let admin;
let adminAccessToken;
let user;
let userAccessToken;
let initialImageCreated

beforeEach(async () => {
  const adminSetup = await helper.setupTestDbAdmin(api);
  admin = adminSetup.admin;
  adminAccessToken = adminSetup.adminAccessToken;

  const userSetup = await helper.setupTestDbUser(api);
  user = userSetup.user;
  userAccessToken = userSetup.userAccessToken;

  initialImageCreated = await helper.createTestImage(admin.id);
});

after(helper.closeDbConnection)


describe("Image Tests", async () => {

  describe("GET /api/v1/images/getAllImages", async () => {
    test("should get all images/getAllImages", async () => {
      const response = await api
        .get("/api/v1/images/getAllImages")
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${userAccessToken}`)
        .send()
        .expect(200);
    });
  });

  //  =====================================================================  //

  describe("GET /api/v1/images/getImage/:id", async () => {

    test("should get single image", async () => {
      const response = await api
        .get(`/api/v1/images/getImage/${initialImageCreated._id}`)
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${userAccessToken}`)
        .send()
        .expect(200);
    });

    test("should not get product that doesn't exist", async () => {
      const response = await api
        .get(`/api/v1/images/getImage/invalid-id`)
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${userAccessToken}`)
        .send()
        .expect(404);
    });
  });

  //  =====================================================================  //

  describe("POST /api/v1/images/uploadImage", async () => {
    test("should upload an image", async () => {
      const response = await api
        .post("/api/v1/images/uploadImage")
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${adminAccessToken}`)
        .attach('image', 'tests/test-image.jpeg')
        .expect(201);
    });

    test("should not create product with missing fields", async () => {
      const response = await api
        .post("/api/v1/images/uploadImage")
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${adminAccessToken}`)
        .attach({})
        .expect(422); // "Unprocessable Entity"
    });

    test.skip("should not upload as a user", async () => {
      const response = await api
        .post("/api/v1/images/uploadImage")
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${userAccessToken}`)
        .attach('image', 'tests/test-image.jpeg')
        .expect(403);
    });

  });

  //  =====================================================================  //

  describe("POST /api/v1/images/uploadMultipleImages", async () => {
    test.skip("should upload multiple images", async () => {
      const response = await api
        .post("/api/v1/images/uploadMultipleImages")
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${adminAccessToken}`)
        .attach('image', 'tests/test-image.jpeg')
        .attach('image', 'tests/test-image-2.jpeg')
        .expect(201);
    });

  });

  //  =====================================================================  //

  describe("DELETE /api/v1/images/deleteImage/:id", async () => {
    test("should delete image", async () => {
      const response = await api
        .delete(`/api/v1/images/deleteImage/${initialImageCreated._id}`)
        .set('User-Agent', 'test-agent')
        .set('X-Forwarded-For', '127.0.0.1')
        .set('Cookie', `accessToken=${adminAccessToken}`)
        .send()
        .expect(200);
    });
  });
















})