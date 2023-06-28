import React, { useRef, useState } from 'react';
import { Dimensions, PanResponder, Pressable, TouchableOpacity , Animated, ProgressBarAndroidBase} from 'react-native';
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
      //터치가 시작될 때 호출되는 함수.
      onPanResponderGrant: () => {
        console.log("Touch Started");
        POSITION.setOffset({
          //전에 있었던 위치의 값을 받아옴.
          x: POSITION.x._value,
          y: POSITION.y._value,
        })
      },
      onPanResponderMove:(_, {dx,dy}) => {
        console.log("Finger Moving")
        //dx,dy는 터치한 시작부터 움직인 거리임. 항상 0부터 시작. 
        POSITION.setValue({
          x:dx,
          y:dy,
        });
      },
      onPanResponderRelease: () => {
        console.log("Touch Finished");
        POSITION.flattenOffset();
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

