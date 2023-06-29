import React, { useRef, useState } from 'react';
import { Dimensions, Pressable, TouchableOpacity , Animated, ProgressBarAndroidBase, View, PanResponder, Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import icons from './icons';

import styled from 'styled-components/native';

const Container = styled.View`
  flex:1;
  justify-content: center;
  align-items: center;
  background-color: blue;
`
const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 250px;
  height: 250px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(1, 1, 1 ,0.3);
  position: absolute;
`
const Btn = styled.TouchableOpacity`
  margin: 0 5px;
`
const BtnContaienr = styled.View`
  flex-direction: row;
  flex: 1;
  margin-top: -100px;
`
const CardContainter = styled.View`
  flex:3;
  justify-content: center;
  align-items: center;
`
export default function App() {
  
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  // InterPolates
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
    //extrapolate에서는 inputRange 바깥으로 나갔을 때 어떻게 처리할지 명시할 수 있음
  });
  const secondScale = position.interpolate({
    inputRange:[-280, 0, 280],
    outputRange:[1, 0.5, 1],
    extrapolate:"clamp",
  })
  //Animations
  //Animated.spring은 애니메이션이 완료되는데에 시간이 좀 걸림. bounce 효과 때문에! 
  //Animated.spring을 빠르게 만드는 옵션 두가지 : restSpeedThreshold, restDisplacementThreshold 
  // -> 둘을 조합해서 사용하면 애니메이션을 빨리 끝낼 수 있음. 
  const onPressIn = Animated.spring(scale, {
      toValue:0.95, 
      useNativeDriver:true,
  });
  const onPressOut = Animated.spring(scale,{
    toValue:1, 
    useNativeDriver:true,
  });
  const goCenter = Animated.spring(position, {
    toValue:0,
    useNativeDriver:true,
  });
  const goLeft = Animated.spring(position, {
    toValue:-500,
    tension: 1,
    useNativeDriver:true,
    restSpeedThreshold:100,
    restDisplacementThreshold:100,
  });
  const goRight = Animated.spring(position,{
    toValue:500,
    tension:1,
    useNativeDriver:true,
    restSpeedThreshold:100,
    restDisplacementThreshold:100,
  });
  // State 
  const [index, setIndex] = useState(0);
  // 카드가 옆으로 사라질 때 index 1 올려주는 함수
  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    setIndex((prev) => prev + 1);
  }
  const closePress = () => {
    goLeft.start(onDismiss);
  }
  const checkPress = () => {
    goRight.start(onDismiss);
  }
  
  //Pan Responders
  const panResponder = useRef(
    PanResponder.create({
      //터치에 의해 동작하겠다는 의미
      onStartShouldSetPanResponder : () => true,
      //panResponder 내에서 사용자가 터치하기 시작하면 호출되는 두가지 함수가 있음. -> onPanRespond,erGrant,onPanResponderRelease
      onPanResponderMove: (_, {dx}) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_,{dx}) => {
        if(dx < -230){
          goLeft.start(onDismiss);
        } else if(dx > 230) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut,goCenter]).start();
        }
        
      },
    })
  ).current;
  
  return (
      <Container>
        <CardContainter >
          <Card 
            style={{
              transform:[
                {scale:secondScale}
              ]
            }}>
              <Text>Back Card</Text>
            <Ionicons name={icons[index+1]} size={98} color="#192a56" />
          </Card>
          <Card 
            {...panResponder.panHandlers}
            style={{
              transform:[
                {scale}, 
                {translateX:position}, 
                {rotateZ:rotation},
              ]
            }}>
              <Text>Front Card</Text>
            <Ionicons name={icons[index]} size={98} color="#192a56" />
          </Card>
        </CardContainter>
        
        <BtnContaienr>
          <Btn onPress={closePress}>
            <Ionicons name='close-circle' color="white" size={42}  />
          </Btn>
          <Btn onPress={checkPress}>
            <Ionicons name='checkmark-circle' color="white" size={42}  />
          </Btn>
        </BtnContaienr>
       
      </Container>
     
  );
}

