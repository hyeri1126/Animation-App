import React, { useRef, useState } from 'react';
import { Dimensions, Pressable, TouchableOpacity , Animated, ProgressBarAndroidBase, View, PanResponder, Text, Easing} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import icons from './icons';
import styled from 'styled-components/native';

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ECC71";
const RED = "#E74C3C";


// Animate할 대상 :  Icon Card와 Text Circle -> Animated.View(애니메이션 컴포넌트)로 만들기
const Container = styled.View`
  flex:1;
  background-color: ${BLACK_COLOR};
`
const Edge = styled.View `
  flex: 3;
  /* background-color: ${RED}; */
  align-items: center;
  justify-content: center;
  z-index: 1;
`
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`
const Word = styled.Text`
  font-size: 20px;
  font-weight:600;
  padding: 10px 20px;
  color: ${props => props.color};
`
const Center = styled.View`
  flex:5;
  justify-content: center;
  align-items: center;
  z-index: 10;
`
const IconCard = styled(Animated.createAnimatedComponent(View))`
  padding: 5px 10px;
`

export default function App() {
  // Animation Values -> 이 값들을 Animated 컴포넌트들과 연결해야함. 
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({x:0, y:0})).current;
  const opacity = useRef(new Animated.Value(1)).current;
  // Interpolation 
  const scaleOne = position.y.interpolate({
    inputRange:[-350, -220],
    outputRange:[1.5, 1],
    extrapolate:"clamp",
  })
  const scaleTwo = position.y.interpolate({
    inputRange:[230, 350],
    outputRange:[1, 1.5],
    extrapolate:"clamp",
  })
  // Animations 
  const onPressIn = Animated.spring(scale, {
    toValue:0.8,
    useNativeDriver:true,
  });
  const onPressOut = Animated.spring(scale,{
    toValue:1,
    useNativeDriver:true,
  });
  const goHome = Animated.spring(position,{
    toValue:0,
    useNativeDriver:true,
  })
  const onDrop = Animated.timing(scale,{
    toValue:0,
    useNativeDriver:true,
    duration:200,
    easing: Easing.linear,
  })
  const onDropOpacity =  Animated.timing(opacity, {
    toValue:0,
    duration:200,
    easing: Easing.linear,
    useNativeDriver:true,
  })
  // Pan ResPonders (사용자의 터치 인식), panResponder를 생성할 때 여러가지 함수를 받는데 View에게 넘겨줘야함. 
  const panResponder = useRef(PanResponder.create({
    //손가락 이벤트를 감지할 것인가 말 것인가를 정하는 함수
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, {dx, dy}) => {
      position.setValue({x:dx, y:dy});
    },
    //panResponder가 움직이기 시작하면 onPanResponderGrant를 실행시킴
    onPanResponderGrant:() => {
      //scale을 위한 애니메이션 
      onPressIn.start();
    },
    onPanResponderRelease:(_, {dy}) => {
      if(dy < -250 || dy > 250 ){
        Animated.sequence([
          Animated.parallel([onDropOpacity,onDrop]),
          Animated.timing(position,{
            toValue:0,
            duration:200,
            easing: Easing.linear,
            useNativeDriver:true,
          })
        ]).start(nextIcon);
      
      } else {
        
        Animated.parallel([onPressOut, goHome]).start();
      }
    }
  
  })).current;
  // State
  const [index, setIndex] = useState(0);
  const nextIcon = () => {
    setIndex((prev) => prev+1);
    Animated.parallel([
      Animated.spring(scale,{toValue:1, useNativeDriver:true}),
      Animated.spring(opacity, {toValue:1, useNativeDriver:true})
    ]).start();
    
  }
  return (
      <Container>
        <Edge>
          <WordContainer style={{
            transform:[
              {scale:scaleOne}
            ]
          }}
          >
            <Word color={GREEN}>I Know</Word>
          </WordContainer>
        </Edge>
        <Center>
          <IconCard 
            {...panResponder.panHandlers}
            style={{
              opacity:opacity,
              transform:[...position.getTranslateTransform(),{scale}]
            }}
          >
            <Ionicons name={icons[index]} color="white" size={140} />
          </IconCard>
        </Center>
        <Edge>
          <WordContainer style={{
            transform:[
              {scale:scaleTwo}
            ]
          }}>
            <Word color={RED}>I don't know</Word>
          </WordContainer>
        </Edge>
      </Container>
     
  );
}

