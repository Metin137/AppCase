import colors from '@constants/colors';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {FileStack, Home, Search, UserCircle2} from 'lucide-react-native';
import {View, TouchableOpacity, StyleSheet} from 'react-native';

function MyBottomBar({state, descriptors, navigation}: BottomTabBarProps) {
  const icons = (color: string) => [
    <Home size={20} color={color} />,
    <Search size={20} color={color} />,
    <FileStack size={20} color={color} />,
    <UserCircle2 size={20} color={color} />,
  ];

  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const color = isFocused ? colors.primary : colors.primaryText;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.item}>
            {icons(color)[index]}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default MyBottomBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  item: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
