Node.JS User Login Boilerplate 
==============================

** Work in progress **

This is a boilerplate express and angular application which creates a bare application containing the most common user authentication features. Examples include:
 - sign up with facebook, google or manual
 - email activation of account (manual sign up)
 - remember me
 - forgot password email
 - edit profile

 The boilerplate application requires REDIS for sessions and mongoDB for the user information.

 Influenced from many different github repo's and online tutorial. 

DEPENDENCIES:

Core :
------
- Express

User Interface :
----------------
- Angular.js
- Jade (views / templates)
- Twitter Boilerplate

Communication / Network :
-------------------------
- Nodemailer (mail sender)
   - SMTP or AMAZON SES

Log :
-----
- Winston (logger)
- Loggly - optional logging to loggly
- Airbrake (there is an issue with the npm module - need to manually clone from github)

Security :
----------
- Passport.JS (authentication)
- Passport.JS local (link between Passport.JS and MongoDB)
- Passport Google oAuth2
- Passport Facebook
- BCrypt (hash password)

Test / Quality : 
-----------------
- Testacular
- Mocha (integration/unit tests)
- should (assertions framework) 
- jscoverage (code coverage)
- supertest

Database :
----------
- Redis (Session Store)
- MongoDB (Datas)
- Mongoose (ODM)
- Connect-redis (Redis client)

Utilities :
-----------
- UUID js

