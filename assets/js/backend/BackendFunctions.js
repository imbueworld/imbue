import React, { useEffect, useState } from 'react'
import storage from '@react-native-firebase/storage'
import config from '../../../App.config'
import cache from './storage/cache'
import algoliasearch from 'algoliasearch'
import ImagePicker from 'react-native-image-picker';



const ALGOLIA_ID = 'K75AA7U1MZ'
const ALGOLIA_SEARCH_KEY = 'c25a5639752b7ab096eeba92f81e99b6'
const ALGOLIA_GYM_INDEX = 'gyms' 



const defaultFnOptions = {
  geocodeAddress: {
    allowed_return_type: 'ROOFTOP',
  },
}

useEffect(() => {
  const init = async () => {
    const user = new User()
    setUser(await user.retrieveUser())
    userSettings = cache(`${user}`)
  }; init()
}, [])

/**
 * allowed_return_type in options can be set to null to avoid using this filter.
 */
export function geocodeAddress(address, callback=(() => {}), options=defaultFnOptions.geocodeAddress) {
  let xhr = new XMLHttpRequest()
  xhr.onload = async () => {
    const res = JSON.parse(xhr.responseText)

    switch (res.status) {
      case 'OK':
        const geometry = res.results[ 0 ].geometry
        const location = geometry.location
        const { formatted_address } = res.results[ 0 ]
        let [latitude, longitude] = Object.values(location)

        let newRes = {
          location: {
            latitude,
            longitude,
          },
          formatted_address,
        }

        // If does not include an allowed return type, return null
        if (options.allowed_return_type
            && geometry.location_type != options.allowed_return_type) {
          callback(null)
          break
        }

        callback(newRes)
        break
      case 'ZERO_RESULTS':
        callback(null)
        break
      default:
        callback(null)
        break
    }
  }

  xhr.open(
    'GET',
    `https://maps.googleapis.com/maps/api/geocode/json`
    + `?address=${address}`
    + `&key=${config.GOOGLE_API_KEY}`
    + `&language=en`)

  xhr.send()
}



/**
 * Does:
 *      [Read]  from Firebase Storage (from a Googe Cloud Storage Bucket)
 * 
 * Converts a file_id into a fully functioning uri
 * to retrieve a file from Google Cloud Storage.
 */
export async function publicStorage(fileName) {
  if (!fileName) return ''

  let file = cache(`files/${fileName}`).get()
  if (!file) {
    try {
      file = await storage().ref(fileName).getDownloadURL()
      cache(`files/${fileName}`).set(file)
    } catch (err) { }
  }
  return file || ''
}



/**
 * Searches gyms with Algolia search service.
 * 
 * @param {String} query
 */
export async function algoliaSearch(query) {
  const client = algoliasearch(ALGOLIA_ID, ALGOLIA_SEARCH_KEY)
  const index = client.initIndex(ALGOLIA_GYM_INDEX)
  return await index.search(query)
}


// Selects photo from camera roll for profile photos
export function pickAndUploadFile(user) {
  ImagePicker.showImagePicker((response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
      userSettings.set({ icon_uri: source })
      console.log("user img: " + user.icon_uri)
      
      return source

      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    }
  });
}
