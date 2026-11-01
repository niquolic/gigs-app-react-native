import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "@/screens/DashboardScreen";
import AddGigScreen from "@/screens/AddGigScreen";
import StatsScreen from "@/screens/StatsScreen";
import CustomTabBar from "./CustomTabBar";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <View className="flex-1 bg-night-900">
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="AddGig" component={AddGigScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </View>
  );
}
