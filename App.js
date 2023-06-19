import React, { useRef, useState } from 'react';
import { Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { Animated } from 'react-native';
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

const {width:SCREEN_WIDTH,height:SCREEN_HEIGHT} = Dimensions.get("window")

export default function App() {
  const POSITION = useRef(new Animated.ValueXY({x:-SCREEN_WIDTH/2 + 100, y:-SCREEN_HEIGHT/2 + 100})).current;
  const topLeft = Animated.timing(POSITION,{
    toValue:{
      x:-SCREEN_WIDTH/2 + 100,
      y:-SCREEN_HEIGHT/2 + 100,
    },
    useNativeDriver:false,
  });
  const bottomLeft = Animated.timing(POSITION,{
    toValue:{
      x:-SCREEN_WIDTH/2 + 100,
      y:SCREEN_HEIGHT/2 - 100,
    },
    useNativeDriver:false,
  });
  const bottomRight = Animated.timing(POSITION,{
    toValue:{
      x:SCREEN_WIDTH/2 - 100,
      y:SCREEN_HEIGHT/2 - 100,
    },
    useNativeDriver:false,
  
  });
  const topRight = Animated.timing(POSITION,{
    toValue:{
      x:SCREEN_WIDTH/2 - 100,
      y:-SCREEN_HEIGHT/2 + 100,
    },
    useNativeDriver:false,
  
  });
  const moveUp = () => {
    Animated.loop(
      Animated.sequence([
        bottomLeft, bottomRight, topRight, topLeft
     ])
    ).start();
  };
  // const rotation = POSITION.y.interpolate({
  //   inputRange:[-200,200],
  //   outputRange:["-360deg", "360deg"]
  // })
  // const opacityValue = Y_POSITION.interpolate({
  //   inputRange: [-200, 0, 200],
  //   outputRange: [1, 0.5, 1],
  // })
  const borderRadius = POSITION.y.interpolate({
    inputRange: [-200, 200 ],
    outputRange: [100, 0 ]
  })
  const bgColor = POSITION.y.interpolate({
    inputRange:[-200,200],
    outputRange:["rgb(255,99,71)", "rgb(71,166,255)"]
  })

  return (
      <TouchableOpacity 
        style={{flex:1, alignItems:'center', justifyContent:'center'}} 
        onPress={moveUp} 
      >
        <AnimatedBox
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

