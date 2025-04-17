import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Play, Pause, SkipBack, SkipForward, Volume2, Plus, Music, Edit2, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import { usePetStore } from '@/store/pet-store';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  imageUrl: string;
}

export default function MusicPlayerScreen() {
  const router = useRouter();
  const { getActivePet } = usePetStore();
  const activePet = getActivePet();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(80);
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      title: 'Relaxing Piano',
      artist: 'Calm Music',
      duration: 180,
      imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Nature Sounds',
      artist: 'Ambient Sounds',
      duration: 240,
      imageUrl: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2076&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Gentle Rain',
      artist: 'Sleep Sounds',
      duration: 300,
      imageUrl: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?q=80&w=2074&auto=format&fit=crop'
    },
  ]);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(tracks.length - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const addNewTrack = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newTrack: Track = {
          id: Date.now().toString(),
          title: 'New Track',
          artist: 'Custom',
          duration: Math.floor(Math.random() * 300) + 120,
          imageUrl: result.assets[0].uri
        };
        
        setTracks([...tracks, newTrack]);
        Alert.alert('Thành công', 'Đã thêm bản nhạc mới');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm bản nhạc mới');
    }
  };

  const deleteTrack = (id: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa bản nhạc này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const newTracks = tracks.filter(track => track.id !== id);
            setTracks(newTracks);
            
            if (currentTrack.id === id) {
              setCurrentTrackIndex(0);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen options={{ 
        title: 'Nhạc thư giãn',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors.background },
      }} />

      <View style={styles.content}>
        <View style={styles.playerContainer}>
          <Image 
            source={{ uri: currentTrack.imageUrl }} 
            style={styles.albumArt} 
          />
          
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.title}</Text>
            <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '45%' }]} />
            </View>
            <View style={styles.timeInfo}>
              <Text style={styles.timeText}>1:21</Text>
              <Text style={styles.timeText}>{formatTime(currentTrack.duration)}</Text>
            </View>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={prevTrack}>
              <SkipBack size={24} color={Colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
              {isPlaying ? (
                <Pause size={32} color={Colors.card} />
              ) : (
                <Play size={32} color={Colors.card} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={nextTrack}>
              <SkipForward size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.volumeContainer}>
            <Volume2 size={20} color={Colors.textLight} />
            <View style={styles.volumeBar}>
              <View style={[styles.volumeLevel, { width: `${volume}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.playlistContainer}>
          <View style={styles.playlistHeader}>
            <Text style={styles.playlistTitle}>Danh sách phát</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addNewTrack}
            >
              <Plus size={20} color={Colors.card} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={tracks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={[
                  styles.trackItem,
                  index === currentTrackIndex && styles.activeTrackItem
                ]}
                onPress={() => setCurrentTrackIndex(index)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.trackImage} />
                <View style={styles.trackItemInfo}>
                  <Text style={[
                    styles.trackItemTitle,
                    index === currentTrackIndex && styles.activeTrackText
                  ]}>
                    {item.title}
                  </Text>
                  <Text style={styles.trackItemArtist}>{item.artist}</Text>
                </View>
                <Text style={styles.trackDuration}>{formatTime(item.duration)}</Text>
                
                <View style={styles.trackActions}>
                  <TouchableOpacity style={styles.trackActionButton}>
                    <Edit2 size={16} color={Colors.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.trackActionButton}
                    onPress={() => deleteTrack(item.id)}
                  >
                    <Trash2 size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  playerContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 24,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 16,
    color: Colors.textLight,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginLeft: 12,
  },
  volumeLevel: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  playlistContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  playlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playlistTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeTrackItem: {
    backgroundColor: Colors.primary + '10',
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  trackItemInfo: {
    flex: 1,
  },
  trackItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activeTrackText: {
    color: Colors.primary,
  },
  trackItemArtist: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  trackDuration: {
    fontSize: 12,
    color: Colors.textLight,
    marginRight: 12,
  },
  trackActions: {
    flexDirection: 'row',
  },
  trackActionButton: {
    padding: 8,
  },
});