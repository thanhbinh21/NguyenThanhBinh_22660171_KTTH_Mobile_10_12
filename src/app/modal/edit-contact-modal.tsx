import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useContacts } from "../../hooks/useContacts";

export default function EditContactModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateContact } = useContacts();

  // Parse contact data từ params
  const contactId = parseInt(params.id as string);
  const [name, setName] = useState(params.name as string || "");
  const [phone, setPhone] = useState(params.phone as string || "");
  const [email, setEmail] = useState(params.email as string || "");

  const handleUpdate = async () => {
    // Validate: name không rỗng
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên không được để trống!");
      return;
    }

    // Validate: email phải chứa @ nếu không rỗng
    if (email.trim() && !email.includes("@")) {
      Alert.alert("Lỗi", "Email phải chứa ký tự @!");
      return;
    }

    // Update contact
    await updateContact(contactId, { 
      name: name.trim(), 
      phone: phone.trim(), 
      email: email.trim() 
    });

    // Đóng modal và quay lại trang chính
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Modern Header */}
      <View style={{
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
      }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' }}>Sửa liên hệ</Text>
        <Text style={{ color: '#DBEAFE', fontSize: 14, marginTop: 4 }}>Chỉnh sửa thông tin liên hệ</Text>
      </View>

      {/* Form Card */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24, marginTop: -16 }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          flex: 1,
          padding: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}>
          {/* Name Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#374151', fontWeight: 'bold', marginBottom: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Tên <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={{
              backgroundColor: '#F9FAFB',
              borderWidth: 2,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <TextInput
                style={{ paddingHorizontal: 16, paddingVertical: 16, fontSize: 16 }}
                placeholder="Nhập tên"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#374151', fontWeight: 'bold', marginBottom: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>📱 Số điện thoại</Text>
            <View style={{
              backgroundColor: '#F9FAFB',
              borderWidth: 2,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <TextInput
                style={{ paddingHorizontal: 16, paddingVertical: 16, fontSize: 16 }}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ color: '#374151', fontWeight: 'bold', marginBottom: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>✉️ Email</Text>
            <View style={{
              backgroundColor: '#F9FAFB',
              borderWidth: 2,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <TextInput
                style={{ paddingHorizontal: 16, paddingVertical: 16, fontSize: 16 }}
                placeholder="Nhập email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#2563EB',
                paddingVertical: 16,
                borderRadius: 16,
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
              onPress={handleUpdate}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>✓ Cập nhật</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#F3F4F6',
                paddingVertical: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
              onPress={() => router.back()}
            >
              <Text style={{ color: '#374151', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>✕ Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
