import type { Schema, Struct } from '@strapi/strapi';

export interface MissionsMission extends Struct.ComponentSchema {
  collectionName: 'components_missions_missions';
  info: {
    displayName: 'mission';
  };
  attributes: {
    mission: Schema.Attribute.String;
  };
}

export interface SharedCapability extends Struct.ComponentSchema {
  collectionName: 'components_sections_capabilities';
  info: {
    displayName: 'capability';
    icon: 'tools';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface SharedCertifications extends Struct.ComponentSchema {
  collectionName: 'components_shared_certifications';
  info: {
    displayName: 'certifications';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    issuer: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.Integer;
  };
}

export interface SharedClients extends Struct.ComponentSchema {
  collectionName: 'components_shared_clients';
  info: {
    displayName: 'clients';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContact extends Struct.ComponentSchema {
  collectionName: 'components_shared_contacts';
  info: {
    displayName: 'contact';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    officeHours: Schema.Attribute.String;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    displayName: 'gallery';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_stat_items';
  info: {
    displayName: 'stat-item';
    icon: 'chart-bar';
  };
  attributes: {
    label: Schema.Attribute.String;
    number: Schema.Attribute.String;
  };
}

export interface SharedSubService extends Struct.ComponentSchema {
  collectionName: 'components_shared_sub_services';
  info: {
    displayName: 'sub-service';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTechnologyTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_technology_tags';
  info: {
    displayName: 'technology-tag';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SocmedSocialMedia extends Struct.ComponentSchema {
  collectionName: 'components_socmed_social_medias';
  info: {
    displayName: 'Social Media';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'missions.mission': MissionsMission;
      'shared.capability': SharedCapability;
      'shared.certifications': SharedCertifications;
      'shared.clients': SharedClients;
      'shared.contact': SharedContact;
      'shared.slider': SharedSlider;
      'shared.stat-item': SharedStatItem;
      'shared.sub-service': SharedSubService;
      'shared.technology-tag': SharedTechnologyTag;
      'socmed.social-media': SocmedSocialMedia;
    }
  }
}
