import { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  type TextInputKeyPressEventData,
  type StyleProp,
  type ViewStyle,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

export type TInputOTP = TextInputProps & {
  otpLength?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  onCodeChange?: (text: string) => void;
};

export function InputOTP(props: TInputOTP) {
  const {
    maxLength = 6,
    otpLength = 1,
    containerStyle,
    inputStyle,
    onCodeChange,
  } = props;
  const [codeArr, setCodeArr] = useState(new Array(maxLength).fill(''));
  const [maxLengthCode, setMaxLengthCode] = useState(maxLength);
  const refOTP = useRef<any>({});

  useEffect(() => {
    if (codeArr.join('').length > 0) {
      setMaxLengthCode(otpLength);
    } else {
      setMaxLengthCode(maxLength);
    }
  }, [codeArr, maxLength, otpLength]);

  useEffect(() => {
    if (codeArr.join('').length > 0) {
      setMaxLengthCode(otpLength);
    } else {
      setMaxLengthCode(maxLength);
    }
  }, [maxLength, otpLength, codeArr]);

  const setFocus = (index: number) => {
    if (index < maxLength && index > -1) {
      refOTP.current[index].focus();
    }
  };
  const setBlur = (index: number) => {
    refOTP.current[index].blur();
  };

  const handleChangeKeyPress = ({
    index,
    nativeEvent,
  }: {
    index: number;
    nativeEvent: TextInputKeyPressEventData;
  }): void => {
    if (nativeEvent.key === 'Backspace') {
      setFocus(index - 1);
    } else {
      setFocus(index + 1);
    }
    if (index === maxLength - 1) {
      setBlur(index);
    }
  };

  const onChangeText = (text: string, index: number) => {
    let newCodeArr = [...codeArr];
    newCodeArr[index] = text;
    if (text.length > 1) {
      newCodeArr = [...text.split('')];
      setBlur(index);
    }
    if (onCodeChange) {
      onCodeChange(newCodeArr.join(''));
    }
    if (index == maxLength - 1) {
      if (newCodeArr[index].length === maxLength) {
        setBlur(index);
      }
    }
    setCodeArr(newCodeArr);
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 20,
        },
        containerStyle,
      ]}
    >
      {codeArr.map((item, index) => (
        <TextInput
          key={`${item}${index}`}
          ref={(ref) => (refOTP.current[index] = ref!)}
          value={codeArr[index]}
          style={[
            {
              flex: 1,
              textAlign: 'center',
              padding: 8,
              borderColor: 'blue',
              borderBottomWidth: 2,
              fontSize: 18,
            },
            inputStyle,
          ]}
          onKeyPress={({ nativeEvent }): void => {
            handleChangeKeyPress({ index, nativeEvent });
          }}
          underlineColorAndroid="transparent"
          onChangeText={(text) => onChangeText(text, index)}
          maxLength={maxLengthCode}
          keyboardType={'number-pad'}
          {...props}
        />
      ))}
    </View>
  );
}
