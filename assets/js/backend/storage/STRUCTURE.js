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
    first: String,
    last: String,
    icon_uri: String,
    icon_uri_foreign: String,
    revenue: Number,
    revenue_total: Number,
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
    membership_price: Number,
    coordinate: Object,
    icon_uri: String,
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
    genres: Array,
    type: String,
    price: Number,
    // Core fields
    gym_id: String,
    partner_id: String,
    // Fields not meant for editting
    // id: String,
  }),
  
  // Uid == User uid
  membership_instances: Object.freeze({
    // Fields not meant for editting
    // id: String,
  }),
  // Uid == Date, in format of `mm_dd_yyyy`
  'membership_instances/visits': Object.freeze({
    //////////////////// Fields not meant for editting
    begin_time: Number, // milliseconds timestamp
    end_time: Number, // milliseconds timestamp
  }),
  // Uid == Gym uid
  'membership_instances/visits/gyms': Object.freeze({
    times_scheduled: Number,
    times_visited: Number,
  }),
}

export default Object.freeze(STRUCTURE)