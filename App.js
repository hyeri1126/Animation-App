import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
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
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  const Y = new Animated.Value(0)
  const moveUp = () => {
    Animated.spring(Y, {
      toValue:-200,
      bounciness:30,
      useNativeDriver:true,
    }).start();
  };
  console.log(Y)
  Y.addListener(()=>console.log(Y))
  return (
    <Container>
      <TouchableOpacity onPress={moveUp} >
        <AnimatedBox
          style={{
            transform : [{translateY:Y}]
          }}>
            
        </AnimatedBox>
      </TouchableOpacity>
     
    </Container>
  );
}

