export default function InformationStorageMechanism(Database, query) {
  const fields = query.split("/")
  let nextBase
  let previousBase

  // Ascertain that fields exist, and initialize them with {}, if they don't
  fields.forEach(field => {
    if (nextBase) {
      previousBase = nextBase
      if (!nextBase[ field ]) nextBase[ field ] = {}
      nextBase = nextBase[ field ]
      return
    }
    // First iteration
    previousBase = Database
    if (!Database[ field ]) Database[ field ] = {}
    nextBase = Database[ field ]
  })

  const queriedField = nextBase
  if (!queriedField._listeners) queriedField._listeners = []

  // Return interactable functions
  return {
    get: (uponFail=null) => {
      let val = queriedField._data

      if (uponFail == 'throw' && typeof val == 'undefined') {
        const err = new Error('Unavailable.')
        err.code = 'unavailable'
        throw err
      }

      return val
    },
    set: value => {
      // Hold onto old value
      let oldValue = queriedField._data

      // Set value
      queriedField._data = value

      // Call listeners
      queriedField._listeners.forEach(callback => {
        callback(value, oldValue)
      })
    },
    onChange: callback => {
      queriedField._listeners.push(callback)
    },
    ref: path => {
      return InformationStorageMechanism(Database, `${query}/${path}`)
    },
    _getDatabase: () => Database,
  }
}