module.exports = ({ env }) => ({
  responses: {
    privateAttributes: ['_v', 'created_at'],
  },
  rest: {
    defaultLimit: 15,
    maxLimit: 250,
  },
});
