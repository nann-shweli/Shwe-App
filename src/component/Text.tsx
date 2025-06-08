import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';

const Text = ({
  children,
  color = '#000',
  size = 14,
  weight = 'normal',
  align = 'left',
  style,
  numberOfLines,
  ...rest
}: any) => {
  return (
    <RNText
      style={[
        styles.text,
        {color, fontSize: size, fontWeight: weight, textAlign: align},
        style,
      ]}
      numberOfLines={numberOfLines}
      {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {},
});

export default Text;
