import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';

// Liste des soins disponibles
const healingItems = [
    {
        id: 'medicine',
        name: 'Médicaments',
        image: require('../../assets/healing/medicine.png'),
        value: 30,
        animation: 'healing_medicine'
    },
    {
        id: 'brushing',
        name: 'Brossage',
        image: require('../../assets/healing/brushing.png'),
        value: 15,
        animation: 'healing_brushing'
    },
    {
        id: 'petting',
        name: 'Câlins',
        image: require('../../assets/healing/petting.png'),
        value: 10,
        animation: 'healing_petting'
    }
];

const HealingItem = ({ item, onSelect }) => (
    <TouchableOpacity
        style={styles.healingItem}
        onPress={() => onSelect(item)}
    >
        <Image source={item.image} style={styles.healingImage} />
        <Text style={styles.healingName}>{item.name}</Text>
    </TouchableOpacity>
);

const HealingList = ({ visible, onClose, onHealingSelect }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
    >
        <View style={styles.modalOverlay}>
            <View style={styles.healingModal}>
                <Text style={styles.healingModalTitle}>Choisir un soin</Text>
                <Text style={styles.healingInstructions}>
                    Sélectionnez un soin pour votre chat
                </Text>

                <View style={styles.healingItemsContainer}>
                    {healingItems.map(item => (
                        <HealingItem
                            key={item.id}
                            item={item}
                            onSelect={onHealingSelect}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    healingModal: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    healingModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    healingInstructions: {
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    healingItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    healingItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        margin: 5,
        width: 90,
        height: 110,
    },
    healingImage: {
        width: 60,
        height: 60,
        marginBottom: 5,
    },
    healingName: {
        fontSize: 12,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#4caf50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export { healingItems, HealingList };