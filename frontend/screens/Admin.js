import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ServiceDeskDashboard = () => {
  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from the database
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('https://complaints-dashboard-v2.onrender.com/Greports'); // Replace with your backend API endpoint
        const data = await response.stringify();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to fetch complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  // Handle status update
  const updateStatus = async (id) => {
    try {
      const response = await fetch(`https://complaints-dashboard-v2.onrender.com/Greports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Complete' }),
      });

      if (response.ok) {
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === id ? { ...complaint, status: 'Complete' } : complaint
          )
        );
        Alert.alert('Success', 'Status updated successfully!');
      } else {
        console.error('Failed to update status:', await response.text());
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Render a single complaint
  const renderComplaint = ({ data }) => (
    <View style={styles.card}>
      <Text style={styles.text}><Text style={styles.label}>ID:</Text> {data.id}</Text>
      <Text style={styles.text}><Text style={styles.label}>Name:</Text> {data.name}</Text>
      <Text style={styles.text}><Text style={styles.label}>Department:</Text> {data.department}</Text>
      <Text style={styles.text}><Text style={styles.label}>Location:</Text> {data.location}</Text>
      <Text style={styles.text}><Text style={styles.label}>Complaint:</Text> {data.complaint}</Text>
      <Text
        style={[
          styles.status,
          { backgroundColor: item.status === 'Pending' ? '#ffcccb' : '#c8e6c9' },
        ]}
      >
        {item.status}
      </Text>
      {item.status === 'Pending' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => updateStatus(item.id)}
        >
          <Text style={styles.buttonText}>Mark as Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Service Desk Dashboard</Text>
      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderComplaint}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  status: {
    alignSelf: 'flex-start',
    padding: 5,
    borderRadius: 5,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ServiceDeskDashboard;
