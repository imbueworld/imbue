const STRUCTURE = {
  users: Object.freeze({
    account_type: String,
    active_classes: Array,
    active_memberships: Array,
    scheduled_classes: Array,
    email: String,
    first: String,
    last: String,
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
    // Fields not meant for editting
    // id: String,
  }),
  gyms: Object.freeze({
    active_clients_memberships: Array,
    name: String,
    description: String,
    genres: Array,
    address: String,
    membership_price: Number,
    coordinate: Object,
    icon_uri: String,
    image_uris: Array,
    // Fields not meant for editting
    // id: String,
    // partner_id: String,
    // product_id: String,
  }),
  classes: Object.freeze({
    active_times: Array,
    description: String,
    instructor: String,
    name: String,
    genres: Array,
    type: String,
    price: Number,
    // Fields not meant for editting
    // id: String,
    // gym_id: String,
    // partner_id: String,
  }),
}

export default Object.freeze(STRUCTURE)