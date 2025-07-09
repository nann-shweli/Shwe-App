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

  const [form, setForm] = useState({
    name: '',
    kyat: '',
    pal: '',
    yway: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const resetForm = () => {
    setForm({
      name: '',
      kyat: '',
      pal: '',
      yway: '',
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleSaveItem = () => {
    if (!form.name.trim()) {
      alert('Please enter item name');
      return;
    }

    const kyatNum = Number(form.kyat) || 0;
    const palNum = Number(form.pal) || 0;
    const ywayNum = Number(form.yway) || 0;

    if (isEditing && editingId !== null) {
      // Editing existing item
      const updatedItems = items.map(item =>
        item.id === editingId
          ? {
              ...item,
              name: form.name.trim(),
              kyat: kyatNum,
              pal: palNum,
              yway: ywayNum,
            }
          : item,
      );
      setItems(updatedItems);
    } else {
      // Adding new item
      const newItem = {
        id: Date.now().toString(),
        name: form.name.trim(),
        kyat: kyatNum,
        pal: palNum,
        yway: ywayNum,
      };
      setItems([...items, newItem]);
    }

    resetForm();
    setModalVisible(false);
  };

  const handleDelete = id => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEdit = item => {
    setIsEditing(true);
    setEditingId(item.id);
    setForm({
      name: item.name,
      kyat: String(item.kyat),
      pal: String(item.pal),
      yway: String(item.yway),
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    resetForm();
    setModalVisible(false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => handleEdit(item)}
      style={styles.itemContainer}>
      <View style={[styles.itemRow, styles.borderWidth]}>
        <Text style={styles.columnName}>{item.name}</Text>
        <Text style={styles.column}>{item.kyat}</Text>
        <Text style={styles.column}>{item.pal}</Text>
        <Text style={styles.column}>{item.yway}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteBtn}>
        <Icon name="delete" size={22} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
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

      <Button
        title="Add New Item"
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Item' : 'Add New Item'}
            </Text>

            <TextInput
              placeholder="Item Name"
              value={form.name}
              onChangeText={text => setForm({...form, name: text})}
              style={styles.input}
            />
            <TextInput
              placeholder="Kyat"
              value={form.kyat}
              onChangeText={text => setForm({...form, kyat: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Pal"
              value={form.pal}
              onChangeText={text => setForm({...form, pal: text})}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Yway"
              value={form.yway}
              onChangeText={text => setForm({...form, yway: text})}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={handleCancel} />
              <Button
                title={isEditing ? 'Save Changes' : 'Add Item'}
                onPress={handleSaveItem}
              />
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
  bold: {
    fontWeight: 'bold',
    color: '#F50057',
  },
});

export default Property;
