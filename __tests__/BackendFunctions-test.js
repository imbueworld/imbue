const res = {
  name: 'Jake',
  // age: 21,
}

const getData = () => res

test('Response contains all required fields.', () => {
  const fields = [
    'name',
    'age',
  ]

  const data = getData()
  fields.forEach(field => {
    let match = Object.keys(data).toString().match(field)
    match = match ? match[0] : ''

    expect(match).toEqual(field)
  })
})



// import {
//   geocodeAddress
// } from '../assets/js/backend/BackendFunctions'


// expect.extend() possible

// geocodeAddress
// test('Returns coordinates', () => {
//   geocodeAddress('', res => {
//     const { location } = res
//     expect(typeof location).toBe('object')
//     expect(typeof location.latitude).toBe('number')
//     expect(typeof location.longitude).toBe('number')
//   })
// })