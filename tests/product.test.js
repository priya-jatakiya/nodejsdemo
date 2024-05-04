const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const userModel = require('../src/models/user');
const productModel = require('../src/models/product');

const userID = new mongoose.Types.ObjectId();
const userData = {
    _id: userID,
    name: "Priya",
    email: "priya@gmail.com",
    password: "Pass@test123",
    plain_text_password: "Pass@test123",
    tokens: [{token: jwt.sign({_id: userID}, process.env.JWT_SECRET)}],
}
const printProduct = {
    _id: new mongoose.Types.ObjectId(),
    name: "Print Postcards",
    price: 19.99,
    product_type: 'Print Product',
    description: 'Postcard printing ...',
}

const cardProduct = {
    name: "Card",
    price: 29.35,
    product_type: 'Print Product',
    description: '3D card printing ...',
}
const postersProduct = {
    name: "Posters",
    price: '195',
    product_type: 'Stationary Product',
}
const scrubProduct = {
    name: "Scrub Top",
    price: 29.35,
    product_type: 'Promotional Product',
    description: '3D card printing ...',
}
const invalidProduct = {
    name: "Scrub Top",
    price: 29.35,
    product_type: 'Invald Product Type',
    description: '3D card printing ...',
}

beforeAll(async () => {
    console.log('Delete all products before test execution.');
    await productModel.deleteMany();
    await userModel.deleteMany();
    userData.password = await bcrypt.hash(userData.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    await (new userModel(userData)).save();
    await (new productModel(printProduct)).save();
});

test('Add Valid Product with Auth', async () => {
    await request(app)
    .post('/api/products')
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .send(cardProduct)
    .expect(201)
});

test('Add Valid Product without Auth', async () => {
    await request(app)
    .post('/api/products')
    .send(scrubProduct)
    .expect(400)
});

test('Add Invalid Product with Auth', async () => {
    await request(app)
    .post('/api/products')
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .send(invalidProduct)
    .expect(401)
});

test('Add Invalid Product without Auth', async () => {
    await request(app)
    .post('/api/products')
    .send(postersProduct)
    .expect(400)
});

test('Get All Product with Auth', async () => {
    await request(app)
    .get('/api/products')
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .expect(200)
});

test('Get All Product without Auth', async () => {
    await request(app)
    .get('/api/products')
    .expect(400)
});

test('Get Specific Product with Auth', async () => {
    await request(app)
    .get(`/api/products/${printProduct._id}`)
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .expect(200)
});

test('Get Specific Product without Auth', async () => {
    await request(app)
    .get(`/api/products/${printProduct._id}`)
    .expect(400)
});

test('Update Specific Product with Auth', async () => {
    await request(app)
    .put(`/api/products/${printProduct._id}`)
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .expect(200)
});

test('Update Specific Product without Auth', async () => {
    await request(app)
    .put(`/api/products/${printProduct._id}`)
    .expect(400)
});

test('Delete Specific Existing Product with Auth', async () => {
    await request(app)
    .delete(`/api/products/${printProduct._id}`)
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .expect(200)
});

test('Delete Invalid Product with Auth', async () => {
    await request(app)
    .delete(`/api/products/invalid_id}`)
    .set({'Authorization': `Bearer ${userData.tokens[0].token}`})
    .expect(401)
});

test('Delete Specific Product without Auth', async () => {
    await (new productModel(printProduct)).save();
    await request(app)
    .delete(`/api/products/${printProduct._id}`)
    .expect(400)
});