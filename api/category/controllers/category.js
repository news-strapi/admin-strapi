const {sanitizeEntity} = require('strapi-utils');
const axios = require('axios')
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const {slug, id} = ctx.params;

    if (slug) {
      const entity = await strapi.services.category.findOne({slug});
      return sanitizeEntity(entity, {model: strapi.models.category});
    }

    if (id) {
      const entity = await strapi.services.category.findOne({id});
      return sanitizeEntity(entity, {model: strapi.models.category});
    }
  },
  async import(ctx) {
    const {page} = ctx.params

    const {data} = await axios.get(`${env('WORDPRESS_OLD', '')}/wp-json/wp/v2/categories?page=${page}`)

    return await Promise.allSettled(data.map(post => new Promise(async (resolve, reject) => {
      try {
        const {name, slug, description, taxonomy, yoast_head} = post
        const entity = await strapi.services.category.findOne({slug})

        let metaDescription = ''

        if (entity === null) {
          const yoast = new JSDOM(yoast_head)
          const metas = yoast.window.document.querySelector('meta[name="description"]')

          if (metas) {
            metaDescription = metas.getAttribute('content')
          }

          const postData = {
            openGraph: {
              title: name,
              description: metaDescription,
              image: 500
            },
            description: description,
            name: name,
            slug: slug
          }

          const created = await strapi.services.category.create(postData)
          // resolve(postData)
          resolve(`${created.name}`)
        }
        resolve(`ya existe ${entity.name}`)
      } catch (err) {
        reject(err)
      }
      resolve()
    })));
  },
};
