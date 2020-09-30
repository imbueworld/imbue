import React, { useEffect, useState } from 'react'

import ProfileLayout from '../layouts/ProfileLayout'
import User from './backend/storage/User'



export default function TEMPLATE(props) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())
    }; init()
  }, [])



  return (
    <ProfileLayout>
    </ProfileLayout>
  )
}
