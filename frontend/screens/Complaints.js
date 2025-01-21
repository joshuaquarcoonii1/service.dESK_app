import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,SafeAreaView,
} from 'react-native';
import { getCurrentUser } from '../UserData';

const HistoryScreen = () => {
  const [complaints, setComplaints] = useState([]); // State for complaints
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  

  // Fetch complaints from the server

  const fetchComplaints = async () => {
    const username =await getCurrentUser();
    try {
      const response = await fetch(`http://172.20.10.2:3000/Greports/${username}`); // Replace with your actual server URL
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json(); // Parse the response
      setComplaints(data); // Set complaints state
    } catch (err) {
      console.error('Error fetching complaints:', err.message);
      setError('Failed to fetch complaints. Please try again.');
      Alert.alert('Error', 'Failed to load complaints.');
    } finally {
      setLoading(false); // Stop loading
    }
  };



  // Fetch complaints on component mount

  
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Render a single complaint item
  const renderComplaint = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Complaint: {item.complaint}</Text>
      <Text style={styles.detail}>Department: {item.department}</Text>
      <Text style={styles.detail}>Location: {item.location}</Text>
      <Text style={styles.detail}>Status: {item.status}</Text>
      <Text style={styles.detail}>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Complaint History</Text>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      {!loading && error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && complaints.length === 0 && (
        <Text style={styles.noComplaints}>No complaints found.</Text>
      )}

      {!loading && !error && (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id} // Assuming each complaint has a unique _id
          renderItem={renderComplaint}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginBottom: 3,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  noComplaints: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  list: {
    paddingBottom: 20,
  },
});

export default HistoryScreen;
