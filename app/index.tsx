import React from 'react';
import { Redirect } from 'expo-router';


export default function IndexRootApp() {
    return (
        <Redirect href={"/(home)"} />
    );
};
