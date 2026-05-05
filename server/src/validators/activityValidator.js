const { z } = require('zod');

const activityQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  action: z
    .enum([
      'USER_LOGIN',
      'USER_LOGOUT',
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'PROFILE_UPDATED',
      'PASSWORD_CHANGED',
      '',
    ])
    .optional()
    .default(''),
  userId: z.union([z.string().uuid(), z.literal('')]).optional().default(''),
});

module.exports = { activityQuerySchema };
