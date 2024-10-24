import type { Struct, Schema } from '@strapi/strapi';

export interface LayoutSkillSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_skill_sections';
  info: {
    displayName: 'Skills Section';
    description: '';
  };
  attributes: {
    skill: Schema.Attribute.Component<'components.skill', true>;
    heading: Schema.Attribute.String;
  };
}

export interface LayoutLatestProjects extends Struct.ComponentSchema {
  collectionName: 'components_layout_latest_projects';
  info: {
    displayName: 'Latest Projects Section';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    button: Schema.Attribute.Component<'components.link', false>;
  };
}

export interface LayoutLatestArticlesSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_latest_articles_sections';
  info: {
    displayName: 'Latest Articles Section';
  };
  attributes: {
    heading: Schema.Attribute.String;
    button: Schema.Attribute.Component<'components.link', false>;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    displayName: 'Hero Section';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    button: Schema.Attribute.Component<'components.link', false>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
    description: '';
  };
  attributes: {
    logo: Schema.Attribute.Component<'components.logo', false>;
    headerLink: Schema.Attribute.Component<'components.link', true>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
    description: '';
  };
  attributes: {
    footerColumnOne: Schema.Attribute.Component<
      'components.footer-col1',
      false
    >;
    footerColumnTwo: Schema.Attribute.Component<
      'components.footer-column-two',
      false
    >;
    footerColumnThree: Schema.Attribute.Component<
      'components.footer-column-three',
      false
    >;
  };
}

export interface ComponentsSkill extends Struct.ComponentSchema {
  collectionName: 'components_components_skills';
  info: {
    displayName: 'Skill';
    icon: '';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
  };
}

export interface ComponentsSeo extends Struct.ComponentSchema {
  collectionName: 'components_components_seos';
  info: {
    displayName: 'Seo';
  };
  attributes: {
    MetaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    MetaDescription: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsLogo extends Struct.ComponentSchema {
  collectionName: 'components_components_logos';
  info: {
    displayName: 'logo';
    description: '';
  };
  attributes: {
    url: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    url: Schema.Attribute.String;
    text: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ComponentsFooterColumnTwo extends Struct.ComponentSchema {
  collectionName: 'components_components_footer_column_twos';
  info: {
    displayName: 'Footer Column Two';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
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

export interface ComponentsFooterCol1 extends Struct.ComponentSchema {
  collectionName: 'components_components_footer_col1s';
  info: {
    displayName: 'Footer Column One';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    logo: Schema.Attribute.Component<'components.logo', false>;
    text: Schema.Attribute.String;
  };
}

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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.skill-section': LayoutSkillSection;
      'layout.latest-projects': LayoutLatestProjects;
      'layout.latest-articles-section': LayoutLatestArticlesSection;
      'layout.hero-section': LayoutHeroSection;
      'layout.header': LayoutHeader;
      'layout.footer': LayoutFooter;
      'components.skill': ComponentsSkill;
      'components.seo': ComponentsSeo;
      'components.logo': ComponentsLogo;
      'components.link': ComponentsLink;
      'components.footer-column-two': ComponentsFooterColumnTwo;
      'components.footer-column-three': ComponentsFooterColumnThree;
      'components.footer-col1': ComponentsFooterCol1;
      'components.filter': ComponentsFilter;
    }
  }
}
