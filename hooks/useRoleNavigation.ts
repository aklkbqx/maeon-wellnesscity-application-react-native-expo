import { router } from 'expo-router';

const useRoleNavigation = (role: string) => {
    switch (role) {
        case 'USER':
            router.replace('/(home)');
            break;
        case 'ADMIN':
            router.replace('/');
            break;
        case 'MERCHANT':
            router.replace('/');
            break;
        case 'TOUR':
            router.replace('/');
            break;
        case 'LEARNING_RESOURCE':
            router.replace('/');
            break;
        case 'HOSPITAL':
            router.replace('/');
            break;
        default:
            console.log('Unknown role');
    }
};

export default useRoleNavigation;