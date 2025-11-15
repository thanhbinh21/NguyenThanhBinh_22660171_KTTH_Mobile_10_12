// components/ContactItem.tsx
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { Link } from "expo-router";

export default function ContactItem({ item, onToggleFavorite, onDelete }: any) {
  const handleDelete = () => {
    // Sử dụng window.confirm cho web, Alert cho native
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Bạn có chắc muốn xóa liên hệ "${item.name}"?`);
      if (confirmed) {
        onDelete(item.id);
      }
    } else {
      Alert.alert(
        "Xác nhận xóa",
        `Bạn có chắc muốn xóa liên hệ "${item.name}"?`,
        [
          {
            text: "Hủy",
            style: "cancel"
          },
          {
            text: "Xóa",
            style: "destructive",
            onPress: () => onDelete(item.id)
          }
        ]
      );
    }
  };
  return (
    <View style={{
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      marginBottom: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#F3F4F6',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Avatar Circle */}
        <View style={{
          backgroundColor: '#3B82F6',
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 3,
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1F2937', flex: 1 }}>{item.name}</Text>
            
            {/* Star Icon - Clickable */}
            <TouchableOpacity 
              onPress={() => onToggleFavorite(item.id)}
              style={{
                padding: 4,
                marginLeft: 8,
              }}
            >
              <Text style={{ fontSize: 28 }}>
                {item.favorite === 1 ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {item.phone ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View style={{
                backgroundColor: '#DBEAFE',
                width: 24,
                height: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
              }}>
                <Text style={{ fontSize: 10 }}>📱</Text>
              </View>
              <Text style={{ color: '#4B5563', fontSize: 14 }}>{item.phone}</Text>
            </View>
          ) : null}
          
          {item.email ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <View style={{
                backgroundColor: '#D1FAE5',
                width: 24,
                height: 24,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8
              }}>
                <Text style={{ fontSize: 10 }}>✉️</Text>
              </View>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>{item.email}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {/* Edit Button */}
            <Link 
              href={{
                pathname: "/modal/edit-contact-modal",
                params: {
                  id: item.id,
                  name: item.name,
                  phone: item.phone || "",
                  email: item.email || ""
                }
              }}
              asChild
              style={{ flex: 1 }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#3B82F6',
                  paddingVertical: 8,
                  borderRadius: 8,
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
                  ✏️ Sửa
                </Text>
              </TouchableOpacity>
            </Link>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                flex: 1,
                backgroundColor: '#EF4444',
                paddingVertical: 8,
                borderRadius: 8,
                shadowColor: "#ef4444",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
                🗑️ Xóa
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
