import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const Home = () => {
  const navigation = useNavigation();

  const handleCalaulate = () => {
    navigation.navigate('Detail');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleCalaulate}>
        <Text>Calculate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
