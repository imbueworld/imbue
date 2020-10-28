export default function InformationStorageMechanism(Database, query='_UNSET') {
  const RESERVED_FIELDS = ['_data', '_listeners']
  const fields = query.split('/')
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
    // Returns a list of objects that adhered to the instructions inputted
    where: (field, rule, query) => {
      const res = []

      for (let itemName in queriedField) {
        if (RESERVED_FIELDS.includes(itemName)) continue
        
        switch(rule) {
          case 'in':
            let doc = queriedField[ itemName ]._data || {} // Depends on it being an object, does not affect outcome
            let val = doc[ field ]
            if (query.includes(val)) res.push(doc)
            break
        }
      }

      return res
    },
    getChildren: () => {
      const res = []

      for (let itemName in queriedField) {
        if (RESERVED_FIELDS.includes(itemName)) continue
        res.push(queriedField[ itemName ]._data)
      }

      return res
    },
    _getDatabase: () => Database,
    _resetCache: () => {
      for (let key in Database) {
        delete Database[ key ]
      }
    },
  }
}