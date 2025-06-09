import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Input from '../component/Input';

const Detail = () => {
  const [goldRateRaw, setGoldRateRaw] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');

  const convertYwayToText = (ywayValue: number) => {
    const KYAT_PER_YWAY = 128;
    const PAL_PER_YWAY = 8;
    const kyat = Math.floor(ywayValue / KYAT_PER_YWAY);
    const remainderAfterKyat = ywayValue % KYAT_PER_YWAY;
    const pal = Math.floor(remainderAfterKyat / PAL_PER_YWAY);
    const yway = parseFloat((remainderAfterKyat % PAL_PER_YWAY).toFixed(2));

    let result = '';
    if (kyat > 0) result += `${kyat} ကျပ် `;
    if (pal > 0) result += `${pal} ပဲ `;
    if (yway > 0) result += `${yway} ရွေး`;

    return result.trim() || '0 ရွေး';
  };

  const handleCalaulate = () => {
    const goldRateNumber = parseFloat(goldRateRaw.replace(/,/g, '')) || 0;
    const amountNumber = parseFloat(amount.replace(/,/g, '')) || 0;

    const oneYwayValue = goldRateNumber / 128;
    const estimateGetYway = amountNumber / oneYwayValue;
    setResult(convertYwayToText(estimateGetYway));
  };

  return (
    <View style={styles.container}>
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
      <Input
        label="သင့်ငွေပမာဏ"
        placeholder="1,000,000 mmk"
        value={amount}
        onChangeText={(text: any) => {
          const cleaned = text.replace(/,/g, '');
          if (!isNaN(Number(cleaned))) {
            const formatted = Number(cleaned).toLocaleString('en-US');
            setAmount(formatted);
          } else {
            setAmount('');
          }
        }}
      />

      {result !== '' && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            ခန့်မှန်းရွှေချိန် : {result} ဝန်းကျင်
          </Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCalaulate}>
          <Text style={styles.buttonText}>ရနိုင်သော ရွှေအလေးချိန် တွက်မည်</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#0D1A2D',
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
});

export default Detail;
