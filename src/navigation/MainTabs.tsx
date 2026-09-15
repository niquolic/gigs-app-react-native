import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "@/screens/DashboardScreen";
import AddGigScreen from "@/screens/AddGigScreen";
import StatsScreen from "@/screens/StatsScreen";
import CustomTabBar from "./CustomTabBar";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Équivalent du <div class="topnav"> de menu.component.html, mais en barre
 * d'onglets native avec un bouton central flottant pour "Ajouter" — pattern
 * courant dans les apps musicales/créatives plutôt qu'un simple 3e onglet.
 */
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="AddGig" component={AddGigScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}
