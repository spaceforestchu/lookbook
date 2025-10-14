import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.required().min(1).error('At least one skill is required'),
    }),
    defineField({
      name: 'openToWork',
      title: 'Open to Work',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'industryExpertise',
      title: 'Industry Expertise',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'object',
      fields: [
        { name: 'linkedin', title: 'LinkedIn', type: 'url' },
        { name: 'github', title: 'GitHub', type: 'url' },
        { name: 'website', title: 'Website', type: 'url' },
        { name: 'x', title: 'X (Twitter)', type: 'url' },
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience & Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'org', title: 'Organization', type: 'string' },
            { name: 'role', title: 'Role/Title', type: 'string' },
            { name: 'dateFrom', title: 'From', type: 'string' },
            { name: 'dateTo', title: 'To', type: 'string' },
            { name: 'summary', title: 'Summary', type: 'text', rows: 3 },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
      media: 'photo',
    },
  },
});
