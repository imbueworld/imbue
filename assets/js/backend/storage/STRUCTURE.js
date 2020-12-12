const STRUCTURE = {
  users: Object.freeze({
    account_type: String,
    active_classes: Array,
    active_memberships: Array,
    scheduled_classes: Array,
    email: String,
    first: String,
    last: String,
    dob: Object,
    icon_uri: String,
    icon_uri_foreign: String,
    // Fields not meant for editting
    // id: String,
  }),
  partners: Object.freeze({
    account_type: String,
    associated_classes: Array,
    associated_gyms: Array,
    email: String,
    name: String,
    first: String,
    last: String,
    icon_uri: String,
    icon_uri_foreign: String,
    revenue: Number,
    total_revenue: Number,
    social_media: String,
    //
    company_address: Object,
    formatted_company_address: String,
    company_name: String,
    tax_id: String,
    //
    phone: String,
    dob: Object,
    address: Object,
    formatted_address: String,
    ssn_last_4: String,
    // Fields not meant for editting
    // id: String,
  }),
  gyms: Object.freeze({
    name: String,
    description: String,
    genres: Array,
    address: Object,
    formatted_address: String, 
    membership_price_online: Number,
    membership_price_instudio: Number,
    coordinates: Object,
    image_uri: String,
    image_uris: Array,
    // Core fields
    partner_id: String,
    product_id: String,
    // Fields not meant for editting
    // id: String,
  }),
  classes: Object.freeze({
    active_times: Array,
    description: String,
    instructor: String,
    name: String,
    img: String,
    genres: Array,
    type: String,
    price: Number,
    priceType: String,
    // Core fields
    gym_id: String,
    partner_id: String,
    // Fields not meant for editting
    // id: String,
  }),
}

export default Object.freeze(STRUCTURE)
