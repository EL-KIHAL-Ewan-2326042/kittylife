import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';

// Liste des activités disponibles
const activityItems = [
    {
        id: 'laser',
        name: 'Pointeur laser',
        image: require('../../assets/activities/laser.png'),
        value: 20,
        animation: 'playing_laser'
    },
    {
        id: 'toy',
        name: 'Souris en peluche',
        image: require('../../assets/activities/mouse.png'),
        value: 15,
        animation: 'playing_toy'
    },
    {
        id: 'petting',
        name: 'Caresses',
        image: require('../../assets/activities/petting.png'),
        value: 10,
        animation: 'playing_petting'
    }
];

const ActivityItem = ({ activity, onSelect }) => (
    <TouchableOpacity
        style={styles.activityItem}
        onPress={() => onSelect(activity)}
    >
        <Image source={activity.image} style={styles.activityImage} />
        <Text style={styles.activityName}>{activity.name}</Text>
    </TouchableOpacity>
);

const ActivityList = ({ visible, onClose, onActivitySelect }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
    >
        <View style={styles.modalOverlay}>
            <View style={styles.activityModal}>
                <Text style={styles.activityModalTitle}>Choisir une activité</Text>
                <Text style={styles.activityInstructions}>
                    Sélectionnez une activité pour jouer avec votre chat
                </Text>

                <View style={styles.activityItemsContainer}>
                    {activityItems.map(activity => (
                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                            onSelect={onActivitySelect}
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
    activityModal: {
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
    activityModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    activityInstructions: {
        textAlign: 'center',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    activityItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    activityItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        margin: 5,
        width: 90,
        height: 110,
    },
    activityImage: {
        width: 60,
        height: 60,
        marginBottom: 5,
    },
    activityName: {
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

export { activityItems, ActivityList };