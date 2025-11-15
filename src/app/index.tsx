import { useEffect } from "react";
import { View, Text } from "react-native";
import { getDB } from "./lib/db";

export default function Home() {
  useEffect(() => {
    // test DB mở trên web
    getDB().then(() => console.log("DB opened OK (web async)"));
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Simple Contacts - Câu 1 OK</Text>
    </View>
  );
}
