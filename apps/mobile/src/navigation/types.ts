import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Dashboard: undefined;
  AddGig: undefined;
  Stats: undefined;
};

export type RootStackParamList = {
  Login: { registeredMessage?: string } | undefined;
  Register: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  EditGig: { id: string };
};
