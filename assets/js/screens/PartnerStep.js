import React, {useEffect} from 'react';
import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { useForm } from 'react-hook-form'
import { FONTS } from '../contexts/Styles'
import { PartnerApplyBackground } from '../components/PartnerApplyBackground';
import CustomTextInputV2 from '../components/CustomTextInputV2';
import { useNavigation, useRoute } from '@react-navigation/core';

export const PartnerStep = () => {
    const navigation = useNavigation()
    const { params } = useRoute()
    const { register, handleSubmit, setValue, errors } = useForm()

    const { step } = params;

    useEffect(() => {
        const rules = {
            required: 'Required fields must be filled.',
        }

        register('password', {
            ...rules,
            pattern: {
                value: /(?=.*[a-z])(?=.*[A-Z]).{8}/,
                message:
                    'Password must consist of at least 8 characters, '
                    + 'and at least 1 lowercase and uppercase letter.',
            },
        })

        register('confirm_password', {
            ...rules,
            validate: text =>
                text == local.passwordText
                || 'Passwords must match.',
        })

        register('gym_description', rules)

        register('social_media', rules)

        register('first', {
            ...rules,
            pattern: {
                value: /[A-Za-z]{2,100}/,
                message: 'Name should consist of only letters, and at least two.'
            },
        })

        register('last', {
            ...rules,
            pattern: {
                value: /[A-Za-z]{2,100}/,
                message: 'Name should consist of only letters, and at least two.'
            },
        })

        register('email', rules)
    }, [register])

    switch (step) {
        case 'name':
            return (
                <PartnerApplyBackground onNextButton={() => navigation.push('PartnerStep', {step: 'email'})}>
                    <Text style={styles.body}>
                        TO START, WHAT'S YOUR FIRST & LAST NAME?
                    </Text>
                    <View>
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.first)}
                            placeholder='FIRST NAME'
                            onChangeText={text => setValue('first', text)}
                        />
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.last)}
                            placeholder='LAST NAME'
                            onChangeText={text => setValue('last', text)}
                        />
                    </View>
                </PartnerApplyBackground>
            );
        case 'email':
            return (
                <PartnerApplyBackground  onNextButton={() => navigation.push('PartnerStep', {step: 'workout'})}>
                    <Text style={styles.body}>
                        ENTER YOUR EMAIL
                    </Text>
                    <View>
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.first)}
                            placeholder='EMAIL'
                            onChangeText={text => setValue('email', text)}
                        />
                    </View>
                </PartnerApplyBackground>
            );
        case 'workout':
            return (
                <PartnerApplyBackground onNextButton={() => navigation.push('PartnerStep', {step: 'social'})}>
                    <Text style={styles.body}>
                        DESCRIBE YOUR WORKOUTS
                    </Text>
                    <View>
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.first)}
                            placeholder='DESCRIBE YOUR WORKOUTS'
                            onChangeText={text => setValue('gym_description', text)}
                        />
                    </View>
                </PartnerApplyBackground>
            );
        case 'social':
            return (
                <PartnerApplyBackground onNextButton={() => navigation.push('PartnerStep', {step: 'password'})}>
                    <Text style={styles.body}>
                        WHERE CAN WE FIND YOU ON SOCIAL MEDIA?
                    </Text>
                    <View>
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.first)}
                            placeholder='SOCIAL MEDIA'
                            onChangeText={text => setValue('social_media', text)}
                        />
                    </View>
                </PartnerApplyBackground>
            );
        case 'password':
            return (
                <PartnerApplyBackground onNextButton={() => navigation.push('PartnerStep', {step: 'end'})}>
                    <Text style={styles.body}>
                        NOW, CREATE A PASSWORD
                    </Text>
                    <View>
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.first)}
                            placeholder='PASSWORD'
                            onChangeText={text => setValue('password', text)}
                        />
                        <CustomTextInputV2
                            containerStyle={styles.inputField}
                            red={Boolean(errors.first)}
                            placeholder='CONFIRM PASSWORD'
                            onChangeText={text => setValue('confirm_password', text)}
                        />
                    </View>
                </PartnerApplyBackground>
            );
        case 'end':
            return null;
        default:
            return null
    }

}

const styles = StyleSheet.create({
    body: {
        alignSelf: 'center',
        textAlign: 'center',
        ...FONTS.body,
        fontSize: 12,
        paddingBottom: 10,
    },
    inputField: {
        marginBottom: 20,
        marginRight: 30,
        marginLeft: 30,
        fontSize: 6
    },
})