'use strict';
const moment = require('moment');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.published_at === null && data.publishedAt == null) {
        data.publishedAt = moment().format()
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.publishedAt === null) {
        data.publishedAt = moment().format()
      }
    },
  },
};
