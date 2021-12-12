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
    const {id} = ctx.params;
    if (id) {
      const entity = await strapi.connections.default.raw(`
            select

            p.name,
            p.description,
            p.slug,
            p.show,

            h.id as 'id',
            h.replace_name,
            h.start,
            h.end,

            f.url as 'logo_url',
            f.width as 'logo_width',
            f.height as 'logo_height',

            fb.url as 'cover_url',
            fb.width as 'cover_width',
            fb.height as 'cover_height'

            from programs as p

            join programs_components as c
            on p.id = c.program_id

            join components_programs_schedules as h
            on c.component_id = h.id

            left join upload_file_morph as u
            on u.related_id = p.id
            left join upload_file as f
            on u.upload_file_id = f.id

            left join upload_file_morph as ub
            on ub.related_id = p.id
            left join upload_file as fb
            on ub.upload_file_id = fb.id

            where c.component_type = 'components_programs_schedules'
            and u.related_type = 'programs'
            and u.field = 'logo'

            and ub.related_type = 'programs'
            and ub.field = 'image'

            and p.published_at
            and h.day = ${id}
            order by HOUR(h.start) ASC;
      `)

      return {
        id: id,
        programs: entity[0].length ? entity[0] : null
      }
    }
  },
};
