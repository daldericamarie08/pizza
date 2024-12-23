import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Modal,
  Image,
} from 'react-native';

const PizzaStoreApp = () => {
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);
  const [viewCart, setViewCart] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(''); 

  const calculateTotal = () => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };
  
  const pizzaOptions = [
    {
      name: 'Margherita',
      prices: { Small: 200, Medium: 350, Large: 500 },
      image: require('./photos/mg.jpg'),
    },
    {
      name: 'Pepperoni',
      prices: { Small: 250, Medium: 400, Large: 600 },
      image: require('./photos/pep.jpg'),
    },
    {
      name: 'BBQ Chicken',
      prices: { Small: 300, Medium: 450, Large: 700 },
      image: require('./photos/bbq.jpg'),
    },
    {
      name: 'Spinach Dip',
      prices: { Small: 220, Medium: 370, Large: 520 },
      image: require('./photos/spinach.jpg'),
    },
    {
      name: 'Hawaiian',
      prices: { Small: 230, Medium: 380, Large: 550 },
      image: require('./photos/haw.jpg'),
    },
    {
      name: 'Veggie Delight',
      prices: { Small: 200, Medium: 330, Large: 480 },
      image: require('./photos/veg.jpg'),
    },
  ];

  const sizes = ['Small', 'Medium', 'Large'];
  const quantities = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const handlePizzaSelect = (pizza) => {
    setSelectedPizza(pizza);
    setSize('');
    setQuantity('');
    setIsModalVisible(true);
    setEditOrderId(null);
  };

  const handleAddOrUpdateOrder = () => {
    if (!size.trim() || !quantity.trim()) {
      Alert.alert('Please fill in all fields!');
      return;
    }

    const numericQuantity = parseInt(quantity, 10);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      Alert.alert('Quantity must be a valid positive number!');
      return;
    }

    const price = selectedPizza.prices[size];
    const totalPrice = price * numericQuantity;

    const newOrder = {
      id: Date.now().toString(),
      pizzaName: selectedPizza.name,
      size,
      quantity: numericQuantity,
      price,
      totalPrice,
    };

    if (editOrderId !== null) {
      const updatedOrders = orders.map((order) =>
        order.id === editOrderId
          ? { ...newOrder, id: editOrderId }
          : order
      );
      setOrders(updatedOrders);
      setEditOrderId(null);
    } else {
      setOrders([...orders, newOrder]);
    }

    setIsModalVisible(false);
    setSize('');
    setQuantity('');
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
  };

  const handleOrderNow = () => {
    if (orders.length === 0) {
      Alert.alert('No items in your cart. Please add pizzas to your cart.');
      return;
    }

    const orderTotal = calculateTotal(); 
    const orderWithTotal = {
      id: Date.now().toString(), 
      date: new Date().toLocaleString(), 
      total: orderTotal, 
      paymentMethod,
      items: [...orders], 
    };

    setOrderHistory([...orderHistory, orderWithTotal]);
    setOrders([]);
    
    Alert.alert(
      'Order Placed!',
      `Your order has been placed using ${paymentMethod}. Thank you for ordering from PIZZAlicious.`
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>
        {item.pizzaName} - {item.size} x {item.quantity} (₱{item.totalPrice})
      </Text>
      {!viewHistory && (
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007BFF' }]}
            onPress={() => {
              const pizza = pizzaOptions.find((p) => p.name === item.pizzaName);
              setSelectedPizza(pizza);
              setSize(item.size);
              setQuantity(item.quantity.toString());
              setEditOrderId(item.id);
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
            onPress={() => handleDeleteOrder(item.id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderOrderHistory = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>
        <Text style={{ fontWeight: 'bold' }}>Order Date:</Text> {item.date}
      </Text>
      {item.items.map((order) => (
        <Text key={order.id} style={styles.orderText}>
          {order.pizzaName} - {order.size} x {order.quantity} (₱{order.totalPrice})
        </Text>
      ))}
      <Text style={[styles.orderText, { fontWeight: 'bold' }]}>
        Total: ₱{item.total}
      </Text>
    </View>
  );
  
  const renderPizzaOption = ({ item }) => (
    <TouchableOpacity
      style={styles.pizzaItem}
      onPress={() => handlePizzaSelect(item)}
    >
      <Image source={item.image} style={styles.pizzaImage} />
      <Text style={styles.pizzaOptionText}>{item.name}</Text>
      <Text style={styles.pizzaOptionText}>
        Small: ₱{item.prices.Small}  Medium: ₱{item.prices.Medium}  Large: ₱{item.prices.Large}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require('./photos/PIZZA.png')} style={styles.headerImage} />
        <Text style={styles.header}>PIZZAlicious</Text>
      </View>

      {!viewCart && !viewHistory && (
        <>
          <Text style={styles.subHeader}>Choose a Pizza</Text>
          <FlatList
            data={pizzaOptions}
            keyExtractor={(item) => item.name}
            renderItem={renderPizzaOption}
            numColumns={2}
          />
        </>
      )}

      {(viewCart || viewHistory) && (
        <FlatList
        data={viewHistory ? orderHistory : orders}
        keyExtractor={(item) => item.id}
        renderItem={viewHistory ? renderOrderHistory : renderOrder}
        ListEmptyComponent={
          <Text style={styles.noOrders}>
            {viewHistory ? 'No past orders yet' : 'Your cart is empty'}
          </Text>
        }
      />
      )}

     

      {viewCart && orders.length > 0 && (
        <>
          <Text style={styles.totalText}>Total: ₱{calculateTotal()}</Text>
          <Text style={styles.label}>Payment Method</Text>
          <Picker
            selectedValue={paymentMethod}
            style={styles.picker}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="GCash" value="GCash" />
            <Picker.Item label="Cash on Delivery" value="Cash on Delivery" />
          </Picker>
          <TouchableOpacity style={styles.orderNowButton} onPress={handleOrderNow}>
            <Text style={styles.buttonText}>Order Now</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editOrderId ? 'Edit Order' : 'Add Order'}
            </Text>
            <Text style={styles.modalSubtitle}>Pizza: {selectedPizza?.name}</Text>

            <Text style={styles.label}>Size</Text>
            <Picker
              selectedValue={size}
              style={styles.picker}
              onValueChange={(itemValue) => setSize(itemValue)}
            >
              <Picker.Item label="Select Size" value="" />
              {sizes.map((s) => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>

            <Text style={styles.label}>Quantity</Text>
            <Picker
              selectedValue={quantity}
              style={styles.picker}
              onValueChange={(itemValue) => setQuantity(itemValue)}
            >
              <Picker.Item label="Select Quantity" value="" />
              {quantities.map((q) => (
                <Picker.Item key={q} label={q} value={q} />
              ))}
            </Picker>

            <TouchableOpacity
              style={[
                styles.button,
                editOrderId ? styles.updateOrderButton : styles.addOrderButton,
              ]}
              onPress={handleAddOrUpdateOrder}
            >
              <Text style={styles.buttonText}>
                {editOrderId ? 'Update Order' : 'Add to Orders'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { marginTop: 20 }]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setViewCart(false);
            setViewHistory(false);
          }}
        >
          <Ionicons name="pizza" size={24} color={viewCart ? '#FF3B30' : '#000'} />
          <Text>Pizza</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setViewCart(true);
            setViewHistory(false);
          }}
        >
          <Ionicons name="cart" size={24} color={viewCart ? '#FF3B30' : '#000'} />
          <Text>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            setViewCart(false);
            setViewHistory(true);
          }}
        >
          <Ionicons name="time" size={24} color={viewHistory ? '#FF3B30' : '#000'} />
          <Text>History</Text>
        </TouchableOpacity>

         {/* Profile Icon */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => Alert.alert('Profile', 'Navigate to Profile')}
        >
          <Image
            source={require('./photos/rica.png')} 
            style={styles.profileNavImage}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#A0153E',
    paddingHorizontal: 10,
  },

  headerContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30,
    marginTop: 1,
  },
  
  headerImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  header: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    flexShrink: 1, 
  },
  
  toggleButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 1,
    marginTop: 1,
  },
  pizzaOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between', 
  },
  pizzaOption: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120, 
    marginBottom: 20,
  },
  pizzaContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, 
  },
 
  orderItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, 
  },
  orderText: {
    fontSize: 16,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
  },
  noOrders: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
  },
  orderNowButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
  },
  
  cancelButton: {
    backgroundColor: '#FF3B30', 
    paddingVertical: 6,        
    paddingHorizontal: 10,      
    borderRadius: 10,           
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,               
  },
  
  updateOrderButton: {
    backgroundColor: '#FFA500', 
    paddingVertical: 6,         
    paddingHorizontal: 10,       
    borderRadius: 10,            
    shadowColor: '#000',         
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,                
  },

  addOrderButton: {
    backgroundColor: '#28A745', 
    paddingVertical: 6,        
    paddingHorizontal: 10,      
    borderRadius: 15,          
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,               
  },

  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
  },
  
  historyButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 10,
    marginLeft: 10, 
  },

  gridContainer: {
    flex: 5, 
    marginHorizontal: 10,
    marginTop: 20,
  },
  
  rowWrapper: {
    justifyContent: 'space-between', 
    marginBottom: 20, 
  },
  pizzaItem: {
    flex: 1,
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pizzaImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  pizzaOptionText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonContainer: {
  flexDirection: 'column', 
  alignItems: 'center', 
  marginTop: 20, 
  marginBottom: 20, 
  },
  historyButtonContainer: {
    backgroundColor: '#FFC107', 
    padding: 10,
    borderRadius: 5,
    marginTop: 10, 
    width: '100%', 
    alignItems: 'center',
    elevation: 3, 
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },  

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 14, 
    color: '#000',
    marginTop: 5,
  },
  profileNavImage: {
    width: 25, 
    height: 25,
    borderRadius: 15, 
    marginBottom: 0, 
  },

  totalText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: 'center',
  marginVertical: 10,
},

});

export default PizzaStoreApp;
