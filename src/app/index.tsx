// app/index.tsx
import { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useContacts } from "../hooks/useContacts";
import { initDB } from "../lib/db";
import ContactItem from "../components/ContactItem";

export default function Home() {
  const { contacts, loadContacts } = useContacts();

  useEffect(() => {
    // tạo bảng + seed từ Câu 2
    initDB();

    // load danh sách
    loadContacts();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
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
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>Simple Contacts</Text>
        <Text style={{ color: '#DBEAFE', fontSize: 14 }}>Quản lý danh bạ của bạn</Text>
      </View>

      {/* Add Button - Floating Style */}
      <View style={{ position: 'absolute', top: 80, right: 24, zIndex: 10 }}>
        <Link href="/modal/contact-modal" asChild>
          <TouchableOpacity style={{
            backgroundColor: '#FFFFFF',
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6,
          }}>
            <Text style={{ color: '#2563EB', fontSize: 28, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Contact List */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24, marginTop: -16 }}>
        <View style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          flex: 1,
          paddingTop: 20,
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}>
          {contacts.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 }}>
              <View style={{
                backgroundColor: '#EFF6FF',
                width: 128,
                height: 128,
                borderRadius: 64,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}>
                <Text style={{ fontSize: 64 }}>📱</Text>
              </View>
              <Text style={{ color: '#374151', fontSize: 20, fontWeight: '600' }}>Chưa có liên hệ</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>Bắt đầu thêm liên hệ bằng cách nhấn nút + ở góc trên</Text>
            </View>
          ) : (
            <>
              <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, paddingHorizontal: 4 }}>
                {contacts.length} liên hệ
              </Text>
              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ContactItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
}
