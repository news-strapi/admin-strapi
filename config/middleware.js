module.exports = ({env}) => ({
  settings: {
    cache: {
      enabled: true,
      enableEtagSupport: true,
      type: 'redis',
      maxAge: 3600000,
      models: [
        'articles',
        'category',
        'categories',
        'days',
        'tags',
        'programs',
        'components_programs_schedules',
        'advertisings',
        {
          model: 'global',
          singleType: true,
        },
        {
          model: 'ads',
          singleType: true,
        },
        {
          model: 'contact',
          singleType: true,
        },
        {
          model: 'home',
          singleType: true,
        },
        {
          model: 'live',
          singleType: true,
        },
        {
          model: 'new',
          singleType: true,
        },
        {
          model: 'featured-programs',
          singleType: true,
        },
        {
          model: 'channel-socket',
          singleType: true,
        }
      ],
      redisConfig: {
        name: 'news',
      }
    }
  }
});
