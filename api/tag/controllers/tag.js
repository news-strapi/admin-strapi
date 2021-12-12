const {sanitizeEntity} = require('strapi-utils');
const axios = require('axios')
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const {slug} = ctx.params;

    const entity = await strapi.services.tag.findOne({slug});
    return sanitizeEntity(entity, {model: strapi.models.tag});
  },
  async import(ctx) {
    const {start_page, end_page} = ctx.query
    const urls = []
    const url = `${env('WORDPRESS_OLD', '')}/wp-json/wp/v2/tags`
    const start = start_page ? Number(start_page) : 0
    const end = end_page ? Number(end_page) + 2 : 1

    const numberLoop = end - start
    let idLoop = start

    for (let i = 1; i < numberLoop; i++) {
      urls.push(`${url}?page=${idLoop}`)
      idLoop++
    }

    console.log(urls)

    const tags = await Promise.all(urls.map(u => axios.get(u))).then((responses) => {
        return responses.map(res => {
          return res.data
        })
      }
    )

    const mergeTags = []

    tags.forEach(item => {
      mergeTags.push(...item)
    })

    return await Promise.allSettled(mergeTags.map(post => new Promise(async (resolve, reject) => {
      try {
        const {name, slug, description, taxonomy, yoast_head} = post
        const entity = await strapi.services.tag.findOne({slug})
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

          const created = await strapi.services.tag.create(postData)
          console.log(`${created.name}`)
          resolve(`${created.name}`)
        }
        resolve(`ya existe ${entity.name}`)
      } catch (err) {
        reject(err)
      }
    })));
  },
};
