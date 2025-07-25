import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {moneyFormat} from '../utils/general';
import Input from '../component/Input';
import Text from '../component/Text';

const WEIGHT = 'propertyTotalWeight';
type NavigationProp = StackNavigationProp<any>;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const {top} = useSafeAreaInsets();

  const [goldRateRaw, setGoldRateRaw] = useState('');
  const [kyat, setKyat] = useState('');
  const [pal, setPal] = useState('');
  const [yway, setYway] = useState('');
  const [result, setResult] = useState('');
  const [totalWeight, setTotalWeight] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadTotalWeight = async () => {
        try {
          const json = await AsyncStorage.getItem(WEIGHT);
          if (json) {
            setTotalWeight(JSON.parse(json));
          } else {
            setTotalWeight(null);
          }
        } catch (e) {
          console.error('Failed to load total weight:', e);
        }
      };
      loadTotalWeight();
    }, []),
  );

  const handleClear = () => {
    setGoldRateRaw('');
    setKyat('');
    setPal('');
    setYway('');
    setResult('');
  };

  const handleCalaulate = () => {
    const goldRateNumber = parseFloat(goldRateRaw.replace(/,/g, '')) || 0;
    const kyatNumber = parseFloat(kyat) || 0;
    const palNumber = parseFloat(pal) || 0;
    const ywayNumber = parseFloat(yway) || 0;

    const kyatToYway = kyatNumber * 128;
    const palToYway = palNumber * 8;

    const ywayResult = kyatToYway + palToYway + ywayNumber;
    const finalResult = ((goldRateNumber / 128) * ywayResult).toFixed(2);

    setResult(finalResult);
  };

  const handleCheckPrice = () => {
    navigation.navigate('Detail');
  };

  const handlePress = () => {
    navigation.navigate('MyProperty');
  };

  return (
    <View style={[styles.container, {paddingTop: top}]}>
      <View style={styles.flex1}>
        <TouchableOpacity onPress={handlePress}>
          <View style={styles.header}>
            <View>
              <Text size={15} weight={'bold'}>
                ရွှေစျေးနှုန်း{' '}
              </Text>
              <Text size={15} weight={'bold'}>
                16 ပဲရည် : 7,750,000 MMK
              </Text>
            </View>
            <View>
              <Icon name="chevron-right" size={22} />
            </View>
          </View>
          <View style={styles.goldRate}>
            <Text size={12} style={styles.text}>
              You have Total :
              {totalWeight?.kyat ? ` ${totalWeight.kyat} ကျပ်` : ''}
              {totalWeight?.pal && totalWeight.pal !== 0
                ? ` ${Number(totalWeight.pal).toFixed(2)} ပဲ`
                : ''}
              {totalWeight?.yway && totalWeight.yway !== 0
                ? ` ${Number(totalWeight.yway).toFixed(2)} ရွေး`
                : ''}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePress} style={styles.viewGoldDetail}>
          <Text color={'#1E88E5'} style={styles.underLine}>
            View gold price details
          </Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Input
            label="လက်ရှိရွှေစျေးနှုန်း"
            placeholder="ဥပမာ - 3,500,000 mmk"
            value={goldRateRaw}
            onChangeText={(text: any) => {
              const cleaned = text.replace(/,/g, '');
              if (!isNaN(Number(cleaned))) {
                const formatted = Number(cleaned).toLocaleString('en-US');
                setGoldRateRaw(formatted);
              } else {
                setGoldRateRaw('');
              }
            }}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Input
              label="ကျပ်"
              placeholder="0"
              value={kyat}
              onChangeText={setKyat}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.flex1}>
            <Input
              label="ပဲ"
              placeholder="0"
              value={pal}
              onChangeText={setPal}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.flex1}>
            <Input
              label="ရွေး"
              placeholder="0"
              value={yway}
              onChangeText={setYway}
              keyboardType="numeric"
            />
          </View>
        </View>

        {result !== '' && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              စုစုပေါင်း: {moneyFormat({amount: result})} ကျပ်
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCalaulate}>
            <Text style={styles.buttonText}>ရရှိမည့် ငွေပမာဏ တွက်မည်</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.checkPrice} onPress={handleCheckPrice}>
        <Text style={styles.textStyle}>Check Gold Price</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    borderRadius: 30,
    backgroundColor: '#BBDEFB',
    height: 150,
    padding: 16,
    gap: 5,
    opacity: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  flex1: {
    flex: 1,
  },
  resultBox: {
    padding: 16,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 18,
    color: '#F50057',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0D1A2D',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {flexDirection: 'row', gap: 20, marginTop: 40},
  clearButton: {justifyContent: 'center'},
  checkPrice: {right: 0, alignSelf: 'flex-end', marginBottom: 20},
  textStyle: {fontWeight: 700},
  goldRate: {
    borderRadius: 30,
    backgroundColor: '#ECEFF1',
    height: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
    top: -30,
    marginHorizontal: 50,
  },
  text: {alignItems: 'center', fontWeight: 'bold'},
  underLine: {textDecorationLine: 'underline'},
  viewGoldDetail: {
    alignItems: 'center',
    marginBottom: 25,
  },
});

export default Home;
