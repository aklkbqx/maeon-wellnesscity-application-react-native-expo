import PropTypes from 'prop-types';
import React, { useCallback, useRef, useMemo } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, Text, View } from 'react-native';
import { xdateToData } from '../../../interface';
import styleConstructor from './style';
import Dot from '../dot';
const PeriodDay = (props) => {
    const { theme, marking, date, onPress, onLongPress, state, accessibilityLabel, testID, children, currentDate } = props;
    const dateData = date ? xdateToData(date) : undefined;
    const style = useRef(styleConstructor(theme));
    const isDisabledDay = useMemo(() => {
        if (!currentDate || !date) return false;
        const current = new Date(currentDate);
        const day = new Date(date);
        return day < current;
    }, [currentDate, date]);
    const markingStyle = useMemo(() => {
        const defaultStyle = { textStyle: {}, containerStyle: {} };
        if (!marking) {
            return defaultStyle;
        }
        else {
            if (marking.disabled) {
                defaultStyle.textStyle = { color: style.current.disabledText.color };
            }
            else if (marking.inactive) {
                defaultStyle.textStyle = { color: style.current.inactiveText.color };
            }
            else if (marking.selected) {
                defaultStyle.textStyle = { color: style.current.selectedText.color };
            }
            if (marking.startingDay) {
                defaultStyle.startingDay = { backgroundColor: marking.color };
            }
            if (marking.endingDay) {
                defaultStyle.endingDay = { backgroundColor: marking.color };
            }
            if (!marking.startingDay && !marking.endingDay) {
                defaultStyle.day = { backgroundColor: marking.color };
            }
            if (marking.textColor) {
                defaultStyle.textStyle = { color: marking.textColor };
            }
            if (marking.customTextStyle) {
                defaultStyle.textStyle = marking.customTextStyle;
            }
            if (marking.customContainerStyle) {
                defaultStyle.containerStyle = marking.customContainerStyle;
            }
            return defaultStyle;
        }
    }, [marking]);
    const containerStyle = useMemo(() => {
        const containerStyle = [style.current.base];
        if (state === 'today') {
            containerStyle.push(style.current.today);
        }
        if (isDisabledDay) {
            containerStyle.push(style.current.disabled);
        }
        if (marking) {
            containerStyle.push({
                borderRadius: 17,
                overflow: 'hidden'
            });
            const start = markingStyle.startingDay;
            const end = markingStyle.endingDay;
            if (start && !end) {
                containerStyle.push({ backgroundColor: markingStyle.startingDay?.backgroundColor });
            }
            else if (end && !start || end && start) {
                containerStyle.push({ backgroundColor: markingStyle.endingDay?.backgroundColor });
            }
            if (markingStyle.containerStyle) {
                containerStyle.push(markingStyle.containerStyle);
            }
        }
        return containerStyle;
    }, [marking, state, isDisabledDay]);
    const textStyle = useMemo(() => {
        const textStyle = [style.current.text];
        if (state === 'disabled' || isDisabledDay) {
            textStyle.push(style.current.disabledText);
        } else if (state === 'inactive') {
            textStyle.push(style.current.inactiveText);
        } else if (state === 'today') {
            textStyle.push(style.current.todayText);
        }
        if (marking) {
            if (markingStyle.textStyle) {
                textStyle.push(markingStyle.textStyle);
            }
        }
        return textStyle;
    }, [marking, state, isDisabledDay]);
    const fillerStyles = useMemo(() => {
        const leftFillerStyle = { backgroundColor: undefined };
        const rightFillerStyle = { backgroundColor: undefined };
        let fillerStyle = {};
        const start = markingStyle.startingDay;
        const end = markingStyle.endingDay;
        if (start && !end) {
            rightFillerStyle.backgroundColor = markingStyle.startingDay?.backgroundColor;
        }
        else if (end && !start) {
            leftFillerStyle.backgroundColor = markingStyle.endingDay?.backgroundColor;
        }
        else if (markingStyle.day) {
            leftFillerStyle.backgroundColor = markingStyle.day?.backgroundColor;
            rightFillerStyle.backgroundColor = markingStyle.day?.backgroundColor;
            fillerStyle = { backgroundColor: markingStyle.day?.backgroundColor };
        }
        return { leftFillerStyle, rightFillerStyle, fillerStyle };
    }, [marking]);
    const renderFillers = () => {
        if (marking) {
            return (<View style={[style.current.fillers, fillerStyles.fillerStyle]}>
                <View style={[style.current.leftFiller, fillerStyles.leftFillerStyle]} />
                <View style={[style.current.rightFiller, fillerStyles.rightFillerStyle]} />
            </View>);
        }
    };
    const _onPress = useCallback(() => {
        onPress?.(dateData);
    }, [onPress]);
    const _onLongPress = useCallback(() => {
        onLongPress?.(dateData);
    }, [onLongPress]);
    const Component = marking ? TouchableWithoutFeedback : TouchableOpacity;
    return (
        <Component
            testID={testID}
            onPress={_onPress}
            onLongPress={_onLongPress}
            disabled={marking?.disableTouchEvent || isDisabledDay}
            accessible
            accessibilityRole={marking?.disableTouchEvent || isDisabledDay ? undefined : 'button'}
            accessibilityLabel={accessibilityLabel}
        >
            <View style={style.current.wrapper}>
                {renderFillers()}
                <View style={containerStyle}>
                    <Text allowFontScaling={false} style={textStyle}>
                        {String(children)}
                    </Text>
                    <View style={style.current.dotContainer}>
                        <Dot theme={theme} color={marking?.dotColor} marked={marking?.marked} />
                    </View>
                </View>
            </View>
        </Component>);
};
export default PeriodDay;
PeriodDay.displayName = 'PeriodDay';
PeriodDay.propTypes = {
    state: PropTypes.oneOf(['selected', 'disabled', 'inactive', 'today', '']),
    marking: PropTypes.any,
    theme: PropTypes.object,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    date: PropTypes.string,
    currentDate: PropTypes.string
};
