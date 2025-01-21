  import React, { useState, useEffect } from 'react';
  import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Image,
    Modal,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
  } from 'react-native';
  import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
  import { Picker } from '@react-native-picker/picker';
  import { getCurrentUser, getUserContact} from '../UserData';

  const ComplaintSubmissionScreen = () => {
    // State variables
    const [complaint, setComplaint] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [contact, setContact] = useState('');


    // User details state
    const [userDetails, setUserDetails] = useState({
      name: '',
      contact:''
    });

    // Simulate fetching user details from a backend or storage
    useEffect(() => {
      // Replace this with a real API call or async storage fetch
      const username =getCurrentUser();
      const contact =getUserContact();
      const fetchUserDetails = () => {
        setUserDetails({
          name: username,
          contact:contact
        });
      };
      fetchUserDetails();
    }, []);

    // Function to handle image picking
    const handleImagePick = (type) => {
      const options = { mediaType: 'photo', quality: 1 };
      const pickerFunction =
        type === 'camera' ? launchCamera : launchImageLibrary;

      pickerFunction(options, (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.error('Image picker error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          setImage(response.assets[0].uri);
        }
      });
    };

    // Handle complaint submission
    const handleSubmit = async () => {
      const endpoint = 'https://complaints-dashboard-v2.onrender.com/reports'; // Replace with your backend's actual URL
      const username = getCurrentUser();
      const contact = getUserContact();
      const payload = {
        username,
        complaint,
        department,
        location,
        contact,
      };
      console.log('Payload:', payload);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.error(`Error: ${response.status} - ${errorDetails}`);
          throw new Error(errorDetails || `Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Complaint submitted successfully:', data);

        alert('Complaint submitted successfully!');
      } catch (error) {
        console.error('Failed to submit complaint:', error.message);
        alert('Failed to submit complaint. Please try again.');
      }
    };

    return (
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>SERVICE DESK{'\n'}Submit a Complaint</Text>

          {/* Name Field */}
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={userDetails.name}
            editable={false}
          />

          {/* Department Picker */}
          <Text style={styles.label}>Department:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={department}
              onValueChange={(itemValue) => setDepartment(itemValue)}
            >
              <Picker.Item label="Select Department" value="" />
              <Picker.Item label="MIS" value="MIS" />
              <Picker.Item label="FINANCE" value="FINANCE" />
              <Picker.Item label="LEGAL" value="LEGAL" />
              <Picker.Item label="CORPORATE COMMUNICATIONS" value="CORPORATE COMMUNICATIONS" />
              <Picker.Item label="ENGINEERING" value="ENGINEERING" />
            </Picker>
          </View>

          {/* Location Picker */}
          <Text style={styles.label}>Location:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={location}
              onValueChange={(itemValue) => setLocation(itemValue)}
            >
              <Picker.Item label="Select Location" value="" />
              <Picker.Item label="AKUSE" value="AKUSE" />
              <Picker.Item label="AKOSSOMBO" value="AKOSSOMBO" />
              <Picker.Item label="ACCRA" value="ACCRA" />
            </Picker>
          </View>

          {/* Complaint Field */}
          <Text style={styles.label}>Complaint:</Text>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={4}
            value={complaint}
            onChangeText={setComplaint}
            placeholder="Describe your issue..."
          />

          {/* Attach Picture */}
          <Text style={styles.label}>Attach Picture:</Text>
          <View style={styles.buttonRow}>
            <Button title="Take Photo" onPress={() => handleImagePick('camera')} />
            <Button title="Upload Photo" onPress={() => handleImagePick('library')} />
          </View>
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <View style={styles.buttonContainer}>
            <Button title="Submit Complaint" onPress={handleSubmit} />
          </View>

          {/* Confirmation Modal */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <Text style={styles.modalText}>Your complaint has been submitted!</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginVertical: 5 },
    input: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 10,
      marginBottom: 10,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
    },
    textarea: {
      height: 100,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingLeft: 10,
      paddingTop: 10,
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    buttonContainer: { marginVertical: 20 },
    imagePreview: { width: '100%', height: 200, resizeMode: 'cover', marginTop: 10 },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: { backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalText: { fontSize: 18, marginBottom: 20 },
  });

  export default ComplaintSubmissionScreen;
