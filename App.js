import React, { useRef, useState } from 'react';
import { Dimensions, PanResponder, Pressable, TouchableOpacity , Animated} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
`
const Box = styled.View`
  background-color: tomato;
  width: 200px;
  height: 200px;
`
const AnimatedBox = Animated.createAnimatedComponent(Box)


export default function App() {
  const POSITION = useRef(
    new Animated.ValueXY({
      x:0, 
      y:0,
    })
  ).current;
  
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200 ],
    outputRange: [100, 0 ]
  })
  const bgColor = POSITION.y.interpolate({
    inputRange:[-200,200],
    outputRange:["rgb(255,99,71)", "rgb(71,166,255)"]
  })
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:() => true,
      onPanResponderMove:(_, {dx,dy}) => {
        POSITION.setValue({
          x:dx,
          y:dy,
        });
      },
      onPanResponderRelease: () => {
        
      },
    })
  ).current;
  console.log(PanResponder);
  return (
      <TouchableOpacity 
        style={{flex:1, alignItems:'center', justifyContent:'center'}} 
       
      >
        <AnimatedBox
        {...panResponder.panHandlers}
          style={{
            borderRadius,
            backgroundColor:bgColor,
            transform : [
              ...POSITION.getTranslateTransform(),
            ],
          }}>
            
        </AnimatedBox>
      </TouchableOpacity>
     
  );
}

