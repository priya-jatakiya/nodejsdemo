const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const userModel = require('../src/models/user');

const userOneID = new mongoose.Types.ObjectId();
const userTwoID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: "Priya",
    email: "priya@gmail.com",
    password: "Pass@test123",
    plain_text_password: "Pass@test123",
    tokens: [{token: jwt.sign({_id: userOneID}, process.env.JWT_SECRET)}],
}
const userTwo = {
    _id: userTwoID,
    name: "Tom",
    email: "tom@mail.com",
    password: "Tom@test123",
}

beforeAll(async () => {
    console.log('Before all test execution.');
    await userModel.deleteMany();
    userOne.password = await bcrypt.hash(userOne.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    await (new userModel(userOne)).save();
})

afterAll(async () => {
    console.log('Delete all user after test execution.');
    await userModel.deleteMany();
})

test('Valid Signup', async () => {
    await request(app)
    .post('/api/auth/register')
    .send(userTwo)
    .expect(201)
})

test('Invalid Signup', async () => {
    await request(app)
    .post('/api/auth/register')
    .send(userTwo)
    .expect(401)
})

test('Valid Login', async () => {
    await request(app)
    .post('/api/auth/login')
    .send({email: userOne.email, password: userOne.plain_text_password})
    .expect(200)
})

test('Invalid Login with empty password', async () => {
    let userInfo = await request(app)
    .post('/api/auth/login')
    .send({email: userOne.email, password: ''})
    .expect(400)
})