import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import ProfileLayout from '../layouts/ProfileLayout'
import NewClassForm from '../components/NewClassForm'
import CustomSmallButton from '../components/CustomSmallButton'
import ClassList from '../components/ClassList'
import { retrieveUserData, retrieveClassesByGymIds } from '../backend/CacheFunctions'



export default function PartnerUpdateClasses(props) {
    let cache = props.route.params.cache

    const [page, setPage] = useState("overview")
    const [user, setUser] = useState(null)
    const [classes, setClasses] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            setUser(user)
            let classes = await retrieveClassesByGymIds(cache, { gymIds: user.associated_gyms })
            setClasses(classes)
        }
        init()
    }, [])

    if (!user || !classes) return <View />

    let PageContent
    switch(page) {
        case "overview":
            PageContent =
                <>
                <CustomSmallButton
                    title="Create New Class"
                    onPress={() => setPage("new_class")}
                />
                <ClassList data={classes} />
                </>
            break
        case "new_class":
            PageContent =
                <>
                <CustomSmallButton
                    title="See Class List"
                    onPress={() => setPage("overview")}
                />
                <NewClassForm cache={cache} />
                </>
            break
    }

    return (
        <ProfileLayout
            innerContainerStyle={{
                paddingBottom: 10,
            }}
            data={{ name: user.name, iconUri: user.icon_uri_full }}
        >
            {PageContent}
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})