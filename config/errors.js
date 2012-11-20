var Errors = require('../server/utils/errors');

module.exports = {
  // account validation
  invalidFirstName:           new Errors.ApiError(50, 'First Name is required'),
  invalidLastName:            new Errors.ApiError(51, 'Last Name is required'),
  invalidEmail:               new Errors.ApiError(52, 'Valid email required'),
  invalidEmailDisposable:     new Errors.ApiError(53, 'We are a community here. Please do not use disposable email addresses'),
  invalidPassword:            new Errors.ApiError(54, 'Password must be between 6 and 128 characters'),
  invalidGender:              new Errors.ApiError(55, 'Gender is required'),
  invalidTerms:               new Errors.ApiError(56, 'Please confirm that you agree to the Terms and Conditions'),

  //registration
  userRegisteredAndActive:    new Errors.ApiError(57, 'The email address entered is already active. <br>Please <a href=\'/login\'>Login</a>'),
  userRegisteredNotActive:    new Errors.ApiError(58, 'The email address entered is already registered. <br><a href=\'/resendActivation\'>Resend activation link</a>'),
  invalidActivationKey:       new Errors.ApiError(59, 'Thats not a valid link! Click on the link in your email again or <br><a href=\'/resendActivation\'>Resend activation link</a>'),
  usedActivationKey:          new Errors.ApiError(60, 'Your activation link has already been used. <br>Please <a href=\'/login\'>Login</a>'),

  // Login
  // userNotActive:              new Errors.ApiError(61, 'The email address entered is not active. <br><a href=\'/signup/resendActivation\'>Resend activation link</a>'),
  // userNotResistered:          new Errors.ApiError(62, 'The email address entered is not registered. <br>Please <a href=\'/signup\'>Sign Up</a>'),
  // incorrectPassword:          new Errors.ApiError(63, 'The password entered is incorrect. <br><a href=\'/forgotPassword\'>Forgot Password</a>'),
  // accountSuspended:           new Errors.ApiError(64, 'Too many login attempts. Try again in 5 minutes'),
  // userDeactivated:            new Errors.ApiError(65, 'The email address entered is associated with a deactivated account. <br><a href=\'/signup/resendActivation\'>Re-activate account</a>'),

  // Forgot Password
  // invalidPasswordKey:         new Errors.ApiError(66, 'Cannot find user for selected password reset link - did you try type in in? Click on the link in your email again or request a new one below'),
  // usedPasswordKey:            new Errors.ApiError(67, 'Your password reset link has already been used. Please request a new one below'),
  // expiredPasswordKey:         new Errors.ApiError(68, 'Your password reset link has expired.'),
  // passwordsDoNotMatch:        new Errors.ApiError(69, 'The passwords that you entered do not match. Please try again')
};