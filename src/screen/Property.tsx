import {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../component/Text';

const MMK_PER_YWAY = 50;

const STORAGE_KEY_ITEMS = 'propertyItems';
const WEIGHT = 'propertyTotalWeight';

const ListHeaderComponent = () => (
  <View style={[styles.itemRow, styles.borderWidth]}>
    <Text weight="bold" style={styles.columnName}>
      အမျိုးအမည်
    </Text>
    <Text weight="bold" style={styles.column}>
      ကျပ်
    </Text>
    <Text weight="bold" style={styles.column}>
      ပဲ
    </Text>
    <Text weight="bold" style={styles.column}>
      ရွေး
    </Text>
  </View>
);

const Property = () => {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [newName, setNewName] = useState('');
  const [newKyat, setNewKyat] = useState('');
  const [newPal, setNewPal] = useState('');
  const [newYway, setNewYway] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY_ITEMS);
      if (json) {
        setItems(JSON.parse(json));
      }
    } catch (e) {
      console.error('Failed to load items:', e);
    }
  };

  const saveItems = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
      await AsyncStorage.setItem(WEIGHT, JSON.stringify(totalWeight));
    } catch (e) {
      console.error('Failed to save items:', e);
    }
  };

  const convertToYway = (kyat, pal, yway) => kyat * 16 * 8 + pal * 8 + yway;

  const totalYway = items.reduce(
    (sum, item) => sum + convertToYway(item.kyat, item.pal, item.yway),
    0,
  );

  const convertBack = total => {
    const kyat = Math.floor(total / (16 * 8));
    const pal = Math.floor((total % (16 * 8)) / 8);
    const yway = total % 8;
    return {
      kyat,
      pal: Number(pal.toFixed(2)),
      yway: Number(yway.toFixed(2)),
    };
  };

  const totalWeight = convertBack(totalYway);
  const totalMMK = totalYway * MMK_PER_YWAY;

  const addItem = () => {
    if (!newName.trim()) {
      alert('Please enter item name');
      return;
    }

    const kyatNum = Number(newKyat) || 0;
    const palNum = Number(newPal) || 0;
    const ywayNum = Number(newYway) || 0;

    const newItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      kyat: kyatNum,
      pal: palNum,
      yway: ywayNum,
    };

    setItems([...items, newItem]);
    setNewName('');
    setNewKyat('');
    setNewPal('');
    setNewYway('');

    setModalVisible(false);
  };

  const deleteItem = id => {
    setItems(items.filter(item => item.id !== id));
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={[styles.itemRow, styles.borderWidth]}>
        <Text style={styles.columnName}>{item.name}</Text>
        <Text style={styles.column}>{item.kyat}</Text>
        <Text style={styles.column}>{item.pal}</Text>
        <Text style={styles.column}>{item.yway}</Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteItem(item.id)}
        style={styles.deleteBtn}>
        <Icon name="delete" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You have no property items. Add some!
          </Text>
        }
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalTitle}>Total Weight:</Text>
        <Text style={[styles.totalValue, styles.bold]}>
          {totalWeight.kyat ? `${totalWeight.kyat} ကျပ် ` : ''}
          {totalWeight.pal ? `${totalWeight.pal} ပဲ ` : ''}
          {totalWeight.yway ? `${totalWeight.yway} ရွေး` : ''}
        </Text>
      </View>

      <Button title="Add New Item" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>

            <TextInput
              placeholder="Item Name"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />
            <TextInput
              placeholder="Kyat"
              value={newKyat}
              onChangeText={setNewKyat}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Pal"
              value={newPal}
              onChangeText={setNewPal}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Yway"
              value={newYway}
              onChangeText={setNewYway}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add Item" onPress={addItem} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
    width: '90%',
  },
  borderWidth: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  columnName: {
    fontSize: 16,
    width: '50%',
  },
  column: {
    flex: 1,
    fontSize: 16,
    width: '15%',
  },
  deleteBtn: {
    paddingLeft: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalContainer: {
    marginTop: 16,
    borderTopWidth: 0.4,
    paddingVertical: 32,
  },
  totalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#777',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 6,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  bold: {fontWeight: 'bold', color: '#F50057'},
});

export default Property;
