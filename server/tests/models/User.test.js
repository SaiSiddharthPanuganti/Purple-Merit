const User = require('../../src/models/User');

describe('User Model', () => {
  it('should format full name correctly via virtual', () => {
    const user = User.build({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(user.fullName).toBe('John Doe');
  });

  it('should enforce required validation for email', async () => {
    const user = User.build({
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    });

    await expect(user.validate()).rejects.toThrow();
  });

  it('should remove password from JSON output', () => {
    const user = User.build({
      id: '550e8400-e29b-41d4-a716-446655440000',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const json = user.toJSON();
    expect(json.password).toBeUndefined();
    expect(json.email).toBe('john@example.com');
    expect(json._id).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});
