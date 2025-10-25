import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'
import React from 'react'



const _layout = () => {

    return (
        <NativeTabs>

            <NativeTabs.Trigger name="index">
                <Label>Home</Label>
                <Icon sf={"house.fill"} drawable='custom_android_drawable'/>
            </NativeTabs.Trigger>
            
            <NativeTabs.Trigger name="search">
                <Label>Search</Label>
                <Icon sf={"magnifyingglass"} drawable='custom_android_drawable'/>
            </NativeTabs.Trigger>
            

            <NativeTabs.Trigger name="profile">
                <Label>Profile</Label>
                <Icon sf={"person.fill"} drawable='custom_android_drawable'/>
            </NativeTabs.Trigger>
            
            <NativeTabs.Trigger name="saved">
                <Label>Saved</Label>
                <Icon sf={"bookmark.fill"} drawable='custom_android_drawable'/>
            </NativeTabs.Trigger>
            
            

            
        </NativeTabs>
    )
}

export default _layout