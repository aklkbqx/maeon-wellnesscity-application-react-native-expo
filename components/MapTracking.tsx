import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Dimensions, Animated, Platform, Linking } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import tw from "twrnc";
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native-ui-lib';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useStatusBar } from '@/hooks/useStatusBar';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import TextTheme from '@/components/TextTheme';
import { ScrollView } from 'react-native-gesture-handler';
import { handleErrorMessage } from '@/helper/my-lib';
import Loading from './Loading';
import axios from 'axios';
import { calculateDistance, formatDistance, getTurnDirection, getTurnIcon } from '@/helper/utiles';
import RenderRouteDetails from './MapTracking/RenderRouteDetails';
import debounce from 'lodash/debounce';

// Types
interface Coordinate {
    latitude: number;
    longitude: number;
}

interface LocationObject {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
}

interface MapTrackingProps {
    destination: {
        keyword: string;
        latitude: number;
        longitude: number;
    };
}

interface GuideStep {
    distance: number;
    interval: number;
    name: string;
    turn: number;
    location: {
        lat: number;
        lon: number;
    };
}

export interface RouteInfo {
    distance: number;
    interval: number;
    guide: GuideStep[];
}

// Constants
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const MapMaker = require("@/assets/images/MapMarker.png");
const BlueDot = require("@/assets/images/blue-dot.png");
const API_KEY = "c829ec7870e7bca96c609f6c92119eee"; // Longdo Map API key


// MapTracking Component
const MapTracking: React.FC<MapTrackingProps> = ({ destination }) => {
    useStatusBar("dark-content");

    // State
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
    const [focusState, setFocusState] = useState<'off' | 'center' | 'forward'>('off');
    const [hasCenteredOnce, setHasCenteredOnce] = useState<boolean>(false);
    const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [placeNames, setPlaceNames] = useState({ start: '', destination: '' });
    const [destinationCoordinate, setDestinationCoordinate] = useState<Coordinate | null>(null);
    const [hasArrived, setHasArrived] = useState<boolean>(false);

    // Refs
    const watchPositionSubscription = useRef<Location.LocationSubscription | null>(null);
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const prevLocationRef = useRef<typeof location | null>(null);
    const prevDestinationRef = useRef<typeof destination | null>(null);
    const prevDestinationCoordinateRef = useRef<typeof destinationCoordinate | null>(null);

    // BottomSheet
    const snapPoints = useMemo(() => ['15%', '25%', '50%', '75%'], []);
    const animatedPosition = useRef(new Animated.Value(0)).current;
    const floatingTextStyle = useMemo(() => ({
        transform: [{
            translateY: animatedPosition.interpolate({
                inputRange: [0, 1, 2, 3],
                outputRange: [
                    Platform.OS === "ios" ? 80 : 75,
                    Platform.OS === "ios" ? 0 : -15,
                    Platform.OS === "ios" ? -SCREEN_HEIGHT * 0.25 : (-SCREEN_HEIGHT * 0.25) - 20,
                    Platform.OS === "ios" ? -SCREEN_HEIGHT * 0.5 : (-SCREEN_HEIGHT * 0.5) - 30
                ],
            }),
        }],
    }), [animatedPosition]);

    // Memoized functions
    const handleSheetChanges = useCallback((index: number) => {
        Animated.spring(animatedPosition, {
            toValue: index,
            useNativeDriver: true,
        }).start();
        setIsBottomSheetVisible(index !== -1);
    }, []);

    const openBottomSheet = useCallback(() => {
        bottomSheetRef.current?.expand();
        setIsBottomSheetVisible(true);
    }, []);

    const updateCurrentStep = useCallback((newLocation: LocationObject) => {
        if (routeInfo && routeInfo.guide && routeInfo.guide.length > 0) {
            let minDistance = Infinity;
            let closestStepIndex = 0;

            routeInfo.guide.forEach((step, index) => {
                if (step && step.location && typeof step.location.lat === 'number' && typeof step.location.lon === 'number') {
                    const distance = calculateDistance(
                        newLocation.coords.latitude,
                        newLocation.coords.longitude,
                        step.location.lat,
                        step.location.lon
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestStepIndex = index;
                    }
                }
            });

            setCurrentStepIndex(closestStepIndex);
        }
    }, [routeInfo]);

    const searchPlace = useCallback(async (keyword: string) => {
        try {
            const url = `https://search.longdo.com/mapsearch/json/search?key=${API_KEY}&limit=1&keyword=${encodeURIComponent(keyword)}`;
            const { data } = await axios.get(url);
            if (data && data.data && data.data.length > 0) {
                const place = data.data[0];
                setDestinationCoordinate({
                    latitude: place.lat,
                    longitude: place.lon
                });
                setPlaceNames(prev => ({ ...prev, destination: place.name }));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error searching for place:", error);
            handleErrorMessage("เกิดข้อผิดพลาดในการค้นหาสถานที่", true);
            return false;
        }
    }, []);

    useEffect(() => {
        searchPlace(destination.keyword)
    }, [])

    const updatePlaceName = useCallback(debounce(async (coordinate: Coordinate, type: 'start' | 'destination') => {
        try {
            if (type === 'destination' && destination.keyword) {
                const found = await searchPlace(destination.keyword);
                if (found) return;
            }

            const addressUrl = `https://api.longdo.com/map/services/address?lon=${coordinate.longitude}&lat=${coordinate.latitude}&key=${API_KEY}`;
            const { data: addressData } = await axios.get(addressUrl);

            let placeName = "ไม่พบชื่อสถานที่";
            if (addressData && addressData.road) {
                placeName = `${addressData.road}, ${addressData.subdistrict}, ${addressData.district}`;
            }

            setPlaceNames(prev => ({ ...prev, [type]: placeName }));
            if (type === 'destination') {
                setDestinationCoordinate(coordinate);
            }
        } catch (error) {
            console.error("Error fetching place name:", error);
            setPlaceNames(prev => ({ ...prev, [type]: "ไม่สามารถดึงข้อมูลชื่อสถานที่ได้" }));
        }
    }, 500), [destination.keyword, searchPlace]);

    const checkArrival = useCallback((currentLocation: LocationObject) => {
        if (destinationCoordinate) {
            const distance = calculateDistance(
                currentLocation.coords.latitude,
                currentLocation.coords.longitude,
                destinationCoordinate.latitude,
                destinationCoordinate.longitude
            );
            setHasArrived(distance <= 0.1);
        }
    }, [destinationCoordinate]);

    // Location tracking
    const startLocationTracking = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('ไม่ได้รับอนุญาติให้ระบุตำแหน่ง');
            }

            let initialLocation = await Location.getCurrentPositionAsync({});
            setLocation(initialLocation as LocationObject);
            updatePlaceName({
                latitude: initialLocation.coords.latitude,
                longitude: initialLocation.coords.longitude
            }, 'start');
            checkArrival(initialLocation as LocationObject);

            watchPositionSubscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 5000,
                    distanceInterval: 10,
                },
                ((newLocation: Location.LocationObject) => {
                    setLocation(newLocation as LocationObject);
                    updateCurrentStep(newLocation as LocationObject);
                    checkArrival(newLocation as LocationObject);
                })
            );
            setIsLoading(false);
        } catch (error) {
            handleErrorMessage('จำเป็นต้องมีการเข้าถึงตำแหน่งเพื่อใช้ฟีเจอร์นี้ โปรดเปิดใช้งานในการตั้งค่าของคุณ');
        }
    }, [checkArrival, updateCurrentStep, updatePlaceName]);

    // Fetch Route
    const fetchRoute = useCallback(debounce(async (start: Coordinate, end: Coordinate) => {
        try {
            const response = await fetch(
                `http://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
            );
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                const coordinates = data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoordinates(coordinates);
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    }, 1000), []);

    const fetchRouteInfo = useCallback(debounce(async (start: Coordinate, end: Coordinate) => {
        try {
            const url = `https://api.longdo.com/RouteService/json/route/guide?flon=${start.longitude}&flat=${start.latitude}&tlon=${end.longitude}&tlat=${end.latitude}&type=25&locale=th&key=${API_KEY}`;
            const { data } = await axios.get(url);
            if (data && data.data) {
                const routeData = data.data[0];
                setRouteInfo({
                    distance: routeData.distance,
                    interval: routeData.interval,
                    guide: routeData.guide
                });
            }
        } catch (error) {
            handleErrorMessage("เกิดข้อผิดพลาดในการดึงข้อมูลเส้นทาง");
        }
    }, 1000), []);

    // Toggle focus
    const toggleFocus = useCallback(() => {
        setFocusState((prevState) => {
            switch (prevState) {
                case 'off':
                    setHasCenteredOnce(false);
                    return 'center';
                case 'center':
                    return 'forward';
                case 'forward':
                    return 'off';
                default:
                    return 'off';
            }
        });
    }, []);

    const calculateForwardPosition = useCallback((location: LocationObject): Coordinate => {
        const R = 6371;
        const d = 0.1;
        const lat1 = location.coords.latitude * Math.PI / 180;
        const lon1 = location.coords.longitude * Math.PI / 180;
        const bearing = (location.coords.heading || 0) * Math.PI / 180;
        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(d / R) +
            Math.cos(lat1) * Math.sin(d / R) * Math.cos(bearing)
        );
        const lon2 = lon1 + Math.atan2(
            Math.sin(bearing) * Math.sin(d / R) * Math.cos(lat1),
            Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
        );

        return {
            latitude: lat2 * 180 / Math.PI,
            longitude: lon2 * 180 / Math.PI
        };
    }, []);

    const updateMapView = useCallback(() => {
        if (location && mapRef.current) {
            const cameraConfig = {
                center: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                pitch: 0,
                heading: 0,
                altitude: 500,
                zoom: Platform.OS !== "ios" ? 18 : 15,
            };

            switch (focusState) {
                case 'center':
                    mapRef.current.animateCamera(cameraConfig, { duration: 1000 });
                    break;
                case 'forward':
                    const forwardPosition = calculateForwardPosition(location);
                    mapRef.current.animateCamera({
                        ...cameraConfig,
                        center: forwardPosition,
                        pitch: 60,
                        heading: location.coords.heading || 0,
                        zoom: 18,
                    }, { duration: 1000 });
                    break;
                case 'off':
                    if (!hasCenteredOnce) {
                        mapRef.current.animateCamera(cameraConfig, { duration: 1000 });
                        setHasCenteredOnce(true);
                    }
                    break;
            }
        }
    }, [location, focusState, calculateForwardPosition, hasCenteredOnce]);

    const handleMapMovement = useCallback(() => {
        if (focusState !== 'off' && !hasCenteredOnce) {
            // Do nothing
        } else {
            setFocusState('off');
            setHasCenteredOnce(true);
        }
    }, [focusState, hasCenteredOnce]);

    const openMaps = useCallback((latitude: number, longitude: number) => {
        const url = Platform.select({
            ios: `http://maps.apple.com/?daddr=${latitude},${longitude}`,
            android: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        });
        if (url) {
            Linking.openURL(url).catch(err => console.error('An error occurred', err));
        }
    }, []);

    // Effects
    useEffect(() => {
        startLocationTracking();
        return () => {
            if (watchPositionSubscription.current) {
                watchPositionSubscription.current.remove();
            }
        };
    }, [startLocationTracking]);

    useEffect(() => {
        if (location && destination) {
            const isSignificantChange = (
                !prevLocationRef.current ||
                !prevDestinationRef.current ||
                Math.abs(prevLocationRef.current.coords.latitude - location.coords.latitude) > 0.0001 ||
                Math.abs(prevLocationRef.current.coords.longitude - location.coords.longitude) > 0.0001 ||
                prevDestinationRef.current !== destination
            );

            if (isSignificantChange) {
                fetchRoute(
                    { latitude: location.coords.latitude, longitude: location.coords.longitude },
                    destination
                );
                prevLocationRef.current = location;
                prevDestinationRef.current = destination;
            }
        }
    }, [location, destination, fetchRoute]);

    useEffect(() => {
        if (location && destinationCoordinate) {
            const isSignificantChange = (
                !prevLocationRef.current ||
                !prevDestinationCoordinateRef.current ||
                Math.abs(prevLocationRef.current.coords.latitude - location.coords.latitude) > 0.0001 ||
                Math.abs(prevLocationRef.current.coords.longitude - location.coords.longitude) > 0.0001 ||
                Math.abs(prevDestinationCoordinateRef.current.latitude - destinationCoordinate.latitude) > 0.0001 ||
                Math.abs(prevDestinationCoordinateRef.current.longitude - destinationCoordinate.longitude) > 0.0001
            );

            if (isSignificantChange) {
                fetchRouteInfo(
                    { latitude: location.coords.latitude, longitude: location.coords.longitude },
                    destinationCoordinate
                );

                prevLocationRef.current = location;
                prevDestinationCoordinateRef.current = destinationCoordinate;
            }
        }
    }, [location, destinationCoordinate, fetchRouteInfo]);

    useEffect(() => {
        updateMapView();
    }, [focusState, location, updateMapView]);

    useEffect(() => {
        const updateLocationName = () => {
            if (location) {
                const isSignificantChange = (
                    !prevLocationRef.current ||
                    Math.abs(prevLocationRef.current.coords.latitude - location.coords.latitude) > 0.0001 ||
                    Math.abs(prevLocationRef.current.coords.longitude - location.coords.longitude) > 0.0001
                );

                if (isSignificantChange) {
                    updatePlaceName({ latitude: location.coords.latitude, longitude: location.coords.longitude }, 'start');
                    prevLocationRef.current = location;
                }
            }
        };

        const updateDestinationName = () => {
            if (destination) {
                const isSignificantChange = (
                    !prevDestinationRef.current ||
                    Math.abs(prevDestinationRef.current.latitude - destination.latitude) > 0.0001 ||
                    Math.abs(prevDestinationRef.current.longitude - destination.longitude) > 0.0001
                );

                if (isSignificantChange) {
                    updatePlaceName({ latitude: destination.latitude, longitude: destination.longitude }, 'destination');
                    prevDestinationRef.current = destination;
                }
            }
        };

        updateLocationName();
        updateDestinationName();

    }, [location, destination, updatePlaceName]);

    const initialRegion: Region | undefined = location
        ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        : undefined;

    // Render methods
    const renderCurrentLocationInfo = () => {
        if (hasArrived) {
            return (
                <Animated.View style={[tw`absolute left-4 right-4 mb-2`, floatingTextStyle, { bottom: SCREEN_HEIGHT * 0.25 }]}>
                    <View style={tw`bg-green-500 p-4 rounded-3xl shadow-md`}>
                        <TextTheme font='Prompt-SemiBold' size='lg' style={tw`text-white text-center`}>
                            มาถึงจุดหมายแล้ว!
                        </TextTheme>
                    </View>
                </Animated.View>
            );
        }
        if (!routeInfo || !routeInfo.guide[currentStepIndex]) {
            return null;
        }

        const currentStep = routeInfo.guide[currentStepIndex];
        const nextStep = routeInfo.guide[currentStepIndex + 1];
        const distanceToNextTurn = (currentStep.distance / 1000);

        return (
            <Animated.View style={[tw`absolute left-4 right-4 mb-2`, floatingTextStyle, { bottom: SCREEN_HEIGHT * 0.25 }]}>
                <View style={tw`flex-col gap-2`}>
                    <View style={tw`flex-row justify-between`}>
                        <TouchableOpacity
                            style={tw`bg-blue-500 py-2 px-3 rounded-full flex-row gap-2 items-center justify-center`}
                            onPress={() => destinationCoordinate && openMaps(destinationCoordinate.latitude, destinationCoordinate.longitude)}
                        >
                            <MaterialIcons name="assistant-navigation" size={24} color={String(tw.color("white"))} />
                            <TextTheme font='Prompt-SemiBold' size='sm' style={tw`text-white`}>นำทาง</TextTheme>
                        </TouchableOpacity>

                        <TouchableOpacity style={tw`bg-white p-2 rounded-full shadow-lg z-99 mr-2`} onPress={toggleFocus}>
                            <MaterialIcons
                                name={focusState === 'off' ? "gps-not-fixed" : (focusState === 'center' ? "gps-fixed" : "navigation")}
                                size={24}
                                color={String(tw.color(focusState !== 'off' ? "blue-500" : "gray-500"))}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`bg-white p-4 rounded-3xl shadow-md`}>
                        <View style={tw`flex-row items-center mb-4`}>
                            <FontAwesome5 name="map-marker-alt" size={24} color="red" />
                            <TextTheme style={tw`ml-3 flex-1`} size='sm' numberOfLines={2}>{currentStep.name}</TextTheme>
                        </View>
                        {nextStep && (
                            <View style={tw`flex-row items-center`}>
                                {getTurnIcon(nextStep.turn, false)}
                                <View style={tw`ml-3 flex-1`}>
                                    <TextTheme size='sm' font='Prompt-SemiBold'>
                                        {getTurnDirection(nextStep.turn)} ใน {formatDistance(distanceToNextTurn)}
                                    </TextTheme>
                                    <TextTheme size='sm' style={tw`text-gray-600`} numberOfLines={1}>{nextStep.name}</TextTheme>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Animated.View>
        );
    };

    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white bg-opacity-50`}>
                <Loading loading={isLoading} />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{
                headerShown: true,
                headerTitle: "",
                headerTitleStyle: { fontFamily: "Prompt-SemiBold", fontSize: 18, color: String(tw.color('black')) },
                headerShadowVisible: false,
                gestureEnabled: false,
                headerTransparent: true,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={tw`flex-row items-center bg-white rounded-full p-2`}>
                        <Ionicons name="chevron-back" size={24} color={tw.color('black')} />
                    </TouchableOpacity>
                )
            }} />
            <View style={tw`flex-1 justify-center items-center`}>
                {location && (
                    <MapView
                        ref={mapRef}
                        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                        initialRegion={initialRegion}
                        userInterfaceStyle="light"
                        onPanDrag={handleMapMovement}
                        onRegionChangeComplete={handleMapMovement}
                    >
                        {location && (
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                title="ตำแหน่งของฉัน"
                                image={BlueDot}
                            />
                        )}
                        {destinationCoordinate && (
                            <Marker
                                coordinate={destinationCoordinate}
                                title="จุดหมาย"
                                image={MapMaker}
                            />
                        )}
                        {routeCoordinates.length > 0 && (
                            <Polyline
                                coordinates={routeCoordinates}
                                strokeColor={String(tw.color("blue-400"))}
                                strokeWidth={5}
                                style={tw`rounded-full`}
                            />
                        )}
                    </MapView>
                )}
                {renderCurrentLocationInfo()}
                {!isBottomSheetVisible && (
                    <TouchableOpacity
                        style={tw`absolute bottom-4 right-4 bg-blue-500 p-3 rounded-full shadow-lg`}
                        onPress={openBottomSheet}
                    >
                        <MaterialIcons name="info" size={24} color="white" />
                    </TouchableOpacity>
                )}
                <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    android_keyboardInputMode="adjustResize"
                    keyboardBlurBehavior="restore"
                    enableOverDrag={false}
                    enablePanDownToClose={true}
                    enableContentPanningGesture={false}
                >
                    <BottomSheetView style={tw`flex-1`}>
                        <TextTheme style={tw`text-center pb-2`} font='Prompt-SemiBold' size='xl'>รายละเอียดการเดินทาง</TextTheme>
                        <ScrollView style={tw`flex-1`}>
                            {routeInfo ? <RenderRouteDetails routeInfo={routeInfo} placeNames={placeNames} currentStepIndex={currentStepIndex} /> : null}
                        </ScrollView>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </>
    );
};

export default MapTracking;