const mongoose = require('mongoose');
const User = require('../../src/models/User');

describe('User Model', () => {
  it('should format full name correctly via virtual', () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(user.fullName).toBe('John Doe');
  });

  it('should enforce required validation for email', () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    });

    const err = user.validateSync();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.email.message).toBe('Email is required');
  });

  it('should remove password from JSON output', () => {
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const json = user.toJSON();
    expect(json.password).toBeUndefined();
    expect(json.email).toBe('john@example.com');
  });
});
