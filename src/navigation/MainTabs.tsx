import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import DashboardScreen from "@/screens/DashboardScreen";
import AddGigScreen from "@/screens/AddGigScreen";
import StatsScreen from "@/screens/StatsScreen";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Équivalent du <div class="topnav"> de menu.component.html, mais en
 * barre d'onglets native (pattern standard sur mobile plutôt qu'un
 * menu horizontal en haut de page).
 */
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#333333" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#0056b3",
        tabBarInactiveTintColor: "#8e8e93",
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={size - 4} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddGig"
        component={AddGigScreen}
        options={{
          title: "Ajouter",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="plus-circle" size={size - 4} color={color} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: "Statistiques",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="chart-bar" size={size - 4} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
