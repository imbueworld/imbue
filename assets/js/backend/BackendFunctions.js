import React from 'react'; // for side-effects
import storage from '@react-native-firebase/storage';
import config from '../../../App.config';
import cache from './storage/cache';
import algoliasearch from 'algoliasearch';
// import ImagePicker from 'react-native-image-picker';

const ALGOLIA_ID = 'O50JZXNYWV';
const ALGOLIA_SEARCH_KEY = '2300b356761715188aa0242530b512d9';
const ALGOLIA_GYM_INDEX = 'gyms';

const defaultFnOptions = {
  geocodeAddress: {
    allowed_return_type: 'ROOFTOP',
  },
};

/**
 * allowed_return_type in options can be set to null to avoid using this filter.
 * By default, only returns addresses of type 'ROOFTOPS' (the actual building).
 *
 * @returns {Promise}
 * resolves to geocoded adress or null, if address is of undesired type.
 */
export function geocodeAddress(
  address,
  options = defaultFnOptions.geocodeAddress,
) {
  return new Promise((resolve) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = async () => {
      const res = JSON.parse(xhr.responseText);

      switch (res.status) {
        case 'OK':
          const geometry = res.results[0].geometry;
          const location = geometry.location;
          const {formatted_address, address_components} = res.results[0];
          let [latitude, longitude] = Object.values(location);

          // Populating data with useful pieces
          let city, state, country, postal_code;
          let route, street_number; // helper
          address_components.forEach((comp) => {
            const {types, short_name, long_name} = comp;
            if (types.includes('country')) country = short_name || '';
            if (types.includes('administrative_area_level_1'))
              state = short_name || '';
            if (types.includes('locality')) city = short_name || '';
            if (types.includes('postal_code')) postal_code = short_name || '';
            if (types.includes('route')) route = short_name || '';
            if (types.includes('street_number'))
              street_number = short_name || '';
          });
          let line1 = `${street_number} ${route}`;

          let newRes = {
            // For "backwards comp."
            location: {
              latitude,
              longitude,
            },
            formatted_address,

            // Actual results
            ...res.results[0],

            // Certain results, formatted
            address: {
              line1,
              city,
              state,
              country,
              postal_code,
            },
          };

          // If does not include an allowed return type, return null
          if (
            options.allowed_return_type &&
            geometry.location_type != options.allowed_return_type
          ) {
            resolve(null);
            break;
          }

          resolve(newRes);
          break;
        case 'ZERO_RESULTS':
          resolve(null);
          break;
        default:
          resolve(null);
          break;
      }
    };
    console.log(address);
    // Absolutely necessary conversions
    address = address.replace(' ', '%20');
    address = address.replace('#', '%23');

    xhr.open(
      'GET',
      `https://maps.googleapis.com/maps/api/geocode/json` +
        `?address=${address}` +
        `&key=${config.GOOGLE_API_KEY}` +
        `&language=en`,
    );

    xhr.send();
  });
}

/**
 * Does:
 *      [Read]  from Firebase Storage (from a Googe Cloud Storage Bucket)
 *
 * Converts a file_id into a fully functioning uri
 * to retrieve a file from Google Cloud Storage.
 */
export async function publicStorage(fileName, forcePull = false) {
  if (!fileName) return '';

  let file = cache(`files/${fileName}`).get();
  if (!file || forcePull) {
    try {
      file = await storage().ref(fileName).getDownloadURL();
      cache(`files/${fileName}`).set(file);
    } catch (err) {}
  }
  return file || '';
}

/**
 * Searches partners with Algolia search service.
 *
 * @param {String} query
 */
export async function algoliaSearch(query) {
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_KEY);
  const index = client.initIndex(ALGOLIA_GYM_INDEX);
  return await index.search(query);
}
