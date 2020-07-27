import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { StyleSheet, Dimensions, View, Image } from 'react-native';
import Animated, { Clock, Easing, block, timing, cond, eq, set, not, Value, useCode, startClock, clockRunning, add } from "react-native-reanimated";
const {height, width} = Dimensions.get("screen");
const RAIN_DROP_SIZE = height * 0.02;
const ROUNDED = false

const runProgress = (duration: number, toValue: Animated.Adaptable<number>, clock: Clock) => {
  
  const state = { 
    finished: new Value(0), 
    position: new Value(0), 
    frameTime: new Value(0), 
    time: new Value(0) 
  };

  const config = { 
    toValue, 
    duration, 
    easing: Easing.linear
  };

  return block([
    cond(not(clockRunning(clock)), [
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(state.position, 0)
    ]),
    state.position
  ])
  
}

const rainDrop = (index: string, horizontal: number, vertical: number, translateY: Animated.Adaptable<number>) =>  (
  <Animated.View key={index} style={
    [
      styles.rain_drop2,
      {left: horizontal, top: -vertical}, 
      {transform: [{translateY}]}
    ]}
  />
);

const roundedRainDrop = (index: string, horizontal: number, vertical: number, translateY: Animated.Adaptable<number>) =>  (
  <Animated.View key={index} style={
    [
      styles.rain_wrapper,
      {left: horizontal, top: -vertical}, 
      {transform: [{translateY}]}
    ]}>
    <Animated.View style={styles.rain_drop}/>
  </Animated.View>
);

const getElement = (position: Animated.Value<number>, toValue: Animated.Value<number>, clock: Animated.Clock) => {
  return Array.from({length: 500}).map((_, index: number) => {
    const horizontal = Math.random() * width;
    const vertical = Math.random() * height;
    const duration = (Math.random() * 3000 + 2000) - 500;
    const translateY = runProgress(duration, add(toValue, vertical), clock);

    return ROUNDED ? 
      roundedRainDrop(index.toString(), horizontal, -vertical, translateY) :
      rainDrop(index.toString(), horizontal, -vertical, translateY);
  });
}

export default function App() {
  const position = useRef(new Value<number>(0)).current;
  const toValue = useRef(new Value<number>(height)).current;
  const clock = useRef(new Clock()).current;

  return (
    <View style={styles.container}>
      <Image style={StyleSheet.absoluteFillObject} source={require("./city.jpg")}/>
      {getElement(position, toValue, clock)}
      <StatusBar style="light" hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  rain_wrapper: {
    position: "absolute",
    top: -RAIN_DROP_SIZE/2,
    left: width/2-RAIN_DROP_SIZE/2,
  },
  rain_drop: {
    height: RAIN_DROP_SIZE,
    width: RAIN_DROP_SIZE,
    backgroundColor: "#444",
    
    borderTopLeftRadius: RAIN_DROP_SIZE/2,
    borderBottomLeftRadius: RAIN_DROP_SIZE/2,
    borderTopRightRadius: RAIN_DROP_SIZE/2,

    transform: [
      {rotateZ: "-135deg"},
    ] 
  },
  rain_drop2:{
    position: "absolute", 
    top: height/2, 
    left: width/2, 
    width: 1, 
    height: 40, 
    backgroundColor: "#444",
  }
});
