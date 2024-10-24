import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsFilter extends Struct.ComponentSchema {
  collectionName: 'components_components_filters';
  info: {
    displayName: 'filter';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsFooterCol1 extends Struct.ComponentSchema {
  collectionName: 'components_components_footer_col1s';
  info: {
    description: '';
    displayName: 'Footer Column One';
  };
  attributes: {
    heading: Schema.Attribute.String;
    logo: Schema.Attribute.Component<'components.logo', false>;
    text: Schema.Attribute.String;
  };
}

export interface ComponentsFooterColumnThree extends Struct.ComponentSchema {
  collectionName: 'components_components_footer_column_threes';
  info: {
    displayName: 'Footer Column Three';
  };
  attributes: {
    heading: Schema.Attribute.String;
    socialMedia: Schema.Attribute.Component<'components.logo', true>;
  };
}

export interface ComponentsFooterColumnTwo extends Struct.ComponentSchema {
  collectionName: 'components_components_footer_column_twos';
  info: {
    description: '';
    displayName: 'Footer Column Two';
  };
  attributes: {
    heading: Schema.Attribute.String;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ComponentsLogo extends Struct.ComponentSchema {
  collectionName: 'components_components_logos';
  info: {
    description: '';
    displayName: 'logo';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
  };
}

export interface ComponentsSeo extends Struct.ComponentSchema {
  collectionName: 'components_components_seos';
  info: {
    displayName: 'Seo';
  };
  attributes: {
    MetaDescription: Schema.Attribute.String & Schema.Attribute.Required;
    MetaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsSkill extends Struct.ComponentSchema {
  collectionName: 'components_components_skills';
  info: {
    description: '';
    displayName: 'Skill';
    icon: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    subHeading: Schema.Attribute.Text;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    footerColumnOne: Schema.Attribute.Component<
      'components.footer-col1',
      false
    >;
    footerColumnThree: Schema.Attribute.Component<
      'components.footer-column-three',
      false
    >;
    footerColumnTwo: Schema.Attribute.Component<
      'components.footer-column-two',
      false
    >;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    headerLink: Schema.Attribute.Component<'components.link', true>;
    logo: Schema.Attribute.Component<'components.logo', false>;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.link', false>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subHeading: Schema.Attribute.Text;
  };
}

export interface LayoutLatestArticlesSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_latest_articles_sections';
  info: {
    displayName: 'Latest Articles Section';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.link', false>;
    heading: Schema.Attribute.String;
  };
}

export interface LayoutLatestProjects extends Struct.ComponentSchema {
  collectionName: 'components_layout_latest_projects';
  info: {
    description: '';
    displayName: 'Latest Projects Section';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.link', false>;
    heading: Schema.Attribute.String;
  };
}

export interface LayoutSkillSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_skill_sections';
  info: {
    description: '';
    displayName: 'Skills Section';
  };
  attributes: {
    heading: Schema.Attribute.String;
    skill: Schema.Attribute.Component<'components.skill', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.filter': ComponentsFilter;
      'components.footer-col1': ComponentsFooterCol1;
      'components.footer-column-three': ComponentsFooterColumnThree;
      'components.footer-column-two': ComponentsFooterColumnTwo;
      'components.link': ComponentsLink;
      'components.logo': ComponentsLogo;
      'components.seo': ComponentsSeo;
      'components.skill': ComponentsSkill;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.hero-section': LayoutHeroSection;
      'layout.latest-articles-section': LayoutLatestArticlesSection;
      'layout.latest-projects': LayoutLatestProjects;
      'layout.skill-section': LayoutSkillSection;
    }
  }
}
