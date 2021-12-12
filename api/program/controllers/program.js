const {sanitizeEntity} = require('strapi-utils');
const axios = require('axios')
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

const imageDefaultId = 295

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const {slug} = ctx.params;

    const entity = await strapi.services.program.findOne({slug});
    return sanitizeEntity(entity, {model: strapi.models.program});
  },
  async import(ctx) {
    const {page} = ctx.params;
    const {data} = await axios.get(`${env('WORDPRESS_OLD', '')}/wp-json/wp/v2/programas?page=${page}`)

    return await Promise.allSettled(data.map(post => new Promise(async (resolve, reject) => {
      try {
        const {title, slug, content, _links, yoast_head} = post
        const entity = await strapi.services.program.findOne({slug})

        let metaDescription = ''
        let description = ''

        let metaImageUrl = ''
        let imageUrl = ''
        let logoUrl = ''

        const images = {
          metaImageId: imageDefaultId,
          imageId: imageDefaultId,
          logoId: imageDefaultId
        }

        if (entity === null) {
          const yoast = new JSDOM(yoast_head)
          const metas = yoast.window.document.querySelector('meta[name="description"]')
          metaDescription = metas.getAttribute('content')

          const image = yoast.window.document.querySelector('meta[name="twitter:image"]')
          metaImageUrl = image.getAttribute('content')

          await JSDOM.fromURL(`${env('WORDPRESS_OLD', '')}/programas/${slug}`).then(dom => {
            const thumb = dom.window.document.querySelector('.wpb_wrapper.vc_figure img')
            imageUrl = thumb.getAttribute('src')

            const descriptionPost = dom.window.document.querySelector('.wpb_text_column.wpb_content_element.progra_titulo p:nth-child(2)')
            description = descriptionPost.textContent
          }).catch((e) => {
            console.log(e)
          })

          const metaImageUrlP = await strapi.config.functions.download(metaImageUrl)
          const metaImageId = await strapi.config.functions.upload(metaImageUrlP)
          images.metaImageId = metaImageId.id

          const imageUrlP = await strapi.config.functions.download(imageUrl)
          const imageId = await strapi.config.functions.upload(imageUrlP)
          images.imageId = imageId.id

          await axios.get(`${env('WORDPRESS_OLD', '')}/programacion/${slug}`).then(async (res) => {
            const htmlLogo = new JSDOM(res.data)
            const thumb = htmlLogo.window.document.querySelector('.td-post-featured-image img')
            logoUrl = thumb.getAttribute('src')

            const logoUrlP = await strapi.config.functions.download(logoUrl)
            const logoId = await strapi.config.functions.upload(logoUrlP)
            images.logoId = logoId.id
          }).catch(e => {
            console.log(e.response.status)
          })

          const postData = {
            schedule: [
              {
                name: "Lunes",
                day: 1,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              },
              {
                name: "Martes",
                day: 2,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              },
              {
                name: "Miércoles",
                day: 3,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              },
              {
                name: "Jueves",
                day: 4,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              },
              {
                name: "Viernes",
                day: 5,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              },
              {
                name: "Sábado",
                day: 6,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              },
              {
                name: "Domingo",
                day: 7,
                start: "00:00:00",
                end: "01:00:00",
                replace_name: ""
              }
            ],
            openGraph: {
              description: metaDescription,
              title: title.rendered,
              image: images.metaImageId,
            },
            show: true,
            name: title.rendered,
            description: description,
            slug: slug,
            image: images.imageId,
            imageVertical: images.metaImageId,
            logo: images.logoId
          }

          const created = await strapi.services.program.create(postData)
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
