"use strict";

var app = require('../app')
  , should = require('should')
  , User = require('../../server/models/user')
  , request = require('supertest')
  , fakeUser;

describe('user:', function(){

  beforeEach(function (done) {
    fakeUser = {
      first: 'Fake',
      last: 'User',
      email: 'TestUser@test.com',
      password: 'TestPassword',
      gender: 'male',
      birthday: '1982-06-16',
      tandc: 'tandc'
    };
    User.remove(done);
  });

  describe('registration: ', function(){
    it('should display to registration page', function(done){
      request(app)
        .get('/register')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        // .expect('Content-Length', '20')
        .expect(200, done);
    });
    it('should allow a user to register with correct details', function(done){
      request(app)
        .post(fakeUser)
        .expect(200, done);
    });
    it('should fail on no first name');
    it('should fail on no last name');
    it('should fail on bad email');
    it('should fail on bad gender');
    it('should fail on bad date of birth');
    describe('registered:', function(){
      it('should not be active');
      it('should not be able to log in');
      it('should be able to request new activation link');
      it('should be able to ');
      it('should not be active');
    });
  });
});

describe('accessfunctionality', function(){
  describe('anonymous user:', function(){
    it('should be able to access login');
    it('should be able to access register');
    it('should be able to access forgotpassword');
    it('should be able to access request login');
    it('should not be able to access account');
    it('should not be able to access account/password');
  });
});
