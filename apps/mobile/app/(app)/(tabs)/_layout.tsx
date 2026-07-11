import { colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? "700" : "500",
        color: focused ? colors.violet : colors.textFaint,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.violet,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarLabel: ({ focused }) => <TabLabel label="Início" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "Diário",
          tabBarLabel: ({ focused }) => <TabLabel label="Diário" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarLabel: ({ focused }) => <TabLabel label="Insights" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="conquistas"
        options={{
          title: "Conquistas",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Conquistas" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="assistente"
        options={{
          title: "Assistente",
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Assistente" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Mais",
          tabBarLabel: ({ focused }) => <TabLabel label="Mais" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
