import {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {moneyFormat} from '../utils/general';

const Home = () => {
  const navigation = useNavigation();

  const handleCheckPrice = () => {
    navigation.navigate('Detail');
  };

  const [goldRateRaw, setGoldRateRaw] = useState('');
  const [kyat, setKyat] = useState('');
  const [pal, setPal] = useState('');
  const [yway, setYway] = useState('');
  const [result, setResult] = useState('');

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

  const handleClear = () => {
    setGoldRateRaw('');
    setKyat('');
    setPal('');
    setYway('');
    setResult('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.header}>ရွှေတွက်စက်</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>လက်ရှိရွှေစျေးနှုန်း</Text>
          <TextInput
            style={styles.input}
            placeholder="ဥပမာ - 3,500,000 mmk"
            value={goldRateRaw}
            onChangeText={text => {
              const cleaned = text.replace(/,/g, '');
              if (!isNaN(Number(cleaned))) {
                const formatted = Number(cleaned).toLocaleString('en-US');
                setGoldRateRaw(formatted);
              } else {
                setGoldRateRaw('');
              }
            }}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.inputSmallGroup}>
            <Text style={styles.label}>ကျပ်</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={kyat}
              onChangeText={setKyat}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputSmallGroup}>
            <Text style={styles.label}>ပဲ</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={pal}
              onChangeText={setPal}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputSmallGroup}>
            <Text style={styles.label}>ရွေး</Text>
            <TextInput
              style={styles.input}
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
            <Text style={styles.buttonText}>တွက်မယ်</Text>
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
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  headContainer: {flex: 1},
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
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
  inputSmallGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  resultBox: {
    padding: 16,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    borderColor: '#81c784',
    borderWidth: 1,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
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
});

export default Home;
