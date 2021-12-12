const {sanitizeEntity} = require('strapi-utils')
const nodemailer = require('nodemailer')
const axios = require('axios')
const jsdom = require('jsdom')
const {JSDOM} = jsdom

const imageDefaultId = 295

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'example@gmail.com',
    pass: 'pass-email'
  }
})

const sendEmail = (id, slug, error) => {
  const mailOptions = {
    from: 'example@gmail.com',
    to: 'example@gmail.com',
    subject: 'Error import post',
    html: `
<div>
<p>Id: <strong>${id}</strong></p>
<p>Link: <a href="${env('WORDPRESS_OLD', '')}/${slug}">${env('WORDPRESS_OLD', '')}/${slug}</a></p>
<p>Error: </p>
<pre>${JSON.stringify(error)}</pre>
</div>
      `
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('ERROR Send email', error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const {slug} = ctx.params

    const entity = await strapi.services.article.findOne({slug})
    return sanitizeEntity(entity, {model: strapi.models.article})
  },
  async import(ctx) {
    const {start_page, end_page, per_page} = ctx.query
    const urls = []
    const url = `${env('WORDPRESS_OLD', '')}/wp-json/wp/v2/posts`
    const start = start_page ? Number(start_page) : 0
    const end = end_page ? Number(end_page) + 2 : 1

    const numberLoop = end - start
    let idLoop = start

    for (let i = 1; i < numberLoop; i++) {
      urls.push(`${url}?page=${idLoop}&per_page=${per_page}&_embed=wp:featuredmedia`)
      idLoop++
    }

    console.log(urls)

    const posts = await Promise.all(urls.map(u => axios.get(u))).then((responses) => {
        return responses.map(res => {
          return res.data
        })
      }
    )

    const mergePosts = []

    posts.forEach(item => {
      mergePosts.push(...item)
    })

    return await Promise.allSettled(mergePosts.map(post => new Promise(async (resolve, reject) => {
      const {id, title, date, slug, categories, tag_slug, _embedded, content, yoast_head} = post

      try {
        const entity = await strapi.services.article.findOne({slug})

        let metaDescription = ''
        let titlePost = title.rendered
        let metaImageUrl = null
        let intro = ''
        let imageUrlId = imageDefaultId
        let categoriesIds = []
        let tagsIds = []

        if (_embedded['wp:featuredmedia'].length) {
          metaImageUrl = _embedded['wp:featuredmedia'][0].source_url
        }

        if (entity === null) {
          const yoast = new JSDOM(yoast_head)
          const metas = yoast.window.document.querySelector('meta[name="description"]')
          if (metas) {
            metaDescription = metas.getAttribute('content')
          }

          if (metaImageUrl !== null) {
            console.log('metaImageUrl ==>', metaImageUrl)
            const metaImageUrlP = await strapi.config.functions.download(encodeURI(metaImageUrl))
            const metaImageId = await strapi.config.functions.upload(metaImageUrlP)
            imageUrlId = metaImageId.id
          }

          await axios.get(`${env('WORDPRESS_OLD', '')}/${slug}`).then(async (res) => {
            const html = new JSDOM(res.data)
            const selectIntro = html.window.document.querySelector('.td-post-sub-title')
            if (selectIntro) {
              intro = selectIntro.textContent
            }
          }).catch(e => {
            console.log(e.response.status)
          })

          categoriesIds = await Promise.all(categories.map(slug => strapi.services.category.findOne({slug: slug})))
            .then((responses) => responses.map(res => res.id)).catch(e => null)

          tagsIds = await Promise.all(tag_slug.map(slug => strapi.services.tag.findOne({slug: slug})))
            .then((responses) => responses.map(res => res.id)).catch(e => null)

          const postData = {
            content: content.rendered,
            intro: intro,
            author: 4,
            openGraph: {
              title: titlePost,
              description: metaDescription,
              image: imageUrlId
            },
            cover: [imageUrlId],
            publishedAt: `${date}`,
            slug: slug,
            title: titlePost,
            tags: tagsIds,
            categories: categoriesIds
          }

          const created = await strapi.services.article.create(postData)
          console.log(`${created.title}`)
          resolve(`${created.title}`)
        }

        resolve(`ya existe ${titlePost}`)
      } catch (err) {
        // sendEmail(id, slug, err)
        reject(err)
      }
    })))
  }
}
