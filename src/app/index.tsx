// app/index.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useContacts } from "../hooks/useContacts";
import { initDB } from "../lib/db";
import ContactItem from "../components/ContactItem";

export default function Home() {
  const { contacts, loadContacts, toggleFavorite, deleteContact } = useContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    // tạo bảng + seed từ Câu 2
    initDB();

    // load danh sách
    loadContacts();
  }, []);

  // Reload contacts khi màn hình được focus (quay về từ modal)
  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [])
  );

  // Filter contacts với useMemo để tối ưu performance
  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Filter theo favorite nếu được bật
    if (showFavoritesOnly) {
      result = result.filter((contact: any) => contact.favorite === 1);
    }

    // Filter theo search query (name hoặc phone)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((contact: any) => {
        const name = contact.name?.toLowerCase() || "";
        const phone = contact.phone?.toLowerCase() || "";
        return name.includes(query) || phone.includes(query);
      });
    }

    return result;
  }, [contacts, searchQuery, showFavoritesOnly]);

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

      {/* Search and Filter Section */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        {/* Search Input */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
          marginBottom: 12,
        }}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 16, color: '#1F2937' }}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={{ fontSize: 18, color: '#6B7280' }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Favorite Filter Button */}
        <TouchableOpacity
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          style={{
            backgroundColor: showFavoritesOnly ? '#FEF3C7' : '#FFFFFF',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: showFavoritesOnly ? '#F59E0B' : '#E5E7EB',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 6 }}>
            {showFavoritesOnly ? '⭐' : '☆'}
          </Text>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600',
            color: showFavoritesOnly ? '#D97706' : '#6B7280'
          }}>
            {showFavoritesOnly ? 'Chỉ yêu thích' : 'Tất cả'}
          </Text>
        </TouchableOpacity>
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
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
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
          {filteredContacts.length === 0 ? (
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
                <Text style={{ fontSize: 64 }}>
                  {contacts.length === 0 ? '📱' : '🔍'}
                </Text>
              </View>
              <Text style={{ color: '#374151', fontSize: 20, fontWeight: '600' }}>
                {contacts.length === 0 ? 'Chưa có liên hệ' : 'Không tìm thấy'}
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
                {contacts.length === 0 
                  ? 'Bắt đầu thêm liên hệ bằng cách nhấn nút + ở góc trên'
                  : 'Không có liên hệ nào khớp với tìm kiếm'}
              </Text>
            </View>
          ) : (
            <>
              <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, paddingHorizontal: 4 }}>
                {filteredContacts.length} / {contacts.length} liên hệ
              </Text>
              <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ContactItem 
                    item={item} 
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteContact}
                  />
                )}
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
