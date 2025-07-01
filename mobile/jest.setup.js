import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn(),
    setAudioModeAsync: jest.fn(),
  },
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
  AntDesign: 'AntDesign',
  Feather: 'Feather',
  FontAwesome: 'FontAwesome',
  FontAwesome5: 'FontAwesome5',
  FontAwesome6: 'FontAwesome6',
  Entypo: 'Entypo',
  EvilIcons: 'EvilIcons',
  Foundation: 'Foundation',
  Octicons: 'Octicons',
  SimpleLineIcons: 'SimpleLineIcons',
  Zocial: 'Zocial',
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock Redux Persist
jest.mock('redux-persist', () => ({
  persistStore: jest.fn(),
  persistReducer: jest.fn((config, reducer) => reducer),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const createMockComponent = (name) => {
    const Comp = (props) => React.createElement('Svg' + name, props, props.children);
    Comp.displayName = name;
    return Comp;
  };
  return {
    __esModule: true,
    default: createMockComponent('Svg'),
    Svg: createMockComponent('Svg'),
    Circle: createMockComponent('Circle'),
    Path: createMockComponent('Path'),
    Rect: createMockComponent('Rect'),
    G: createMockComponent('G'),
    Text: createMockComponent('Text'),
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');

  const MD3LightTheme = {
    colors: {
      primary: '#6750A4',
      onPrimary: '#FFFFFF',
      primaryContainer: '#EADDFF',
      onPrimaryContainer: '#21005D',
      secondary: '#625B71',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#E8DEF8',
      onSecondaryContainer: '#1D192B',
      tertiary: '#7D5260',
      onTertiary: '#FFFFFF',
      tertiaryContainer: '#FFD8E4',
      onTertiaryContainer: '#31111D',
      error: '#B3261E',
      onError: '#FFFFFF',
      errorContainer: '#F9DEDC',
      onErrorContainer: '#410E0B',
      background: '#FFFBFE',
      onBackground: '#1C1B1F',
      surface: '#FFFBFE',
      onSurface: '#1C1B1F',
      surfaceVariant: '#E7E0EC',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
      shadow: '#000000',
      scrim: '#000000',
      inverseSurface: '#313033',
      inverseOnSurface: '#F4EFF4',
      inversePrimary: '#D0BCFF',
      elevation: {
        level0: 'transparent',
        level1: '#FFFBFE',
        level2: '#FFFBFE',
        level3: '#FFFBFE',
        level4: '#FFFBFE',
        level5: '#FFFBFE',
      },
    },
  };

  return {
    MD3LightTheme,
    TextInput: Object.assign(
      ({ value, onChangeText, placeholder, label, error, secureTextEntry, keyboardType, style, ...props }) => {
        const RNTextInput = require('react-native').TextInput;
        return (
          <View testID="paper-text-input">
            {label && <Text testID="input-label">{label}</Text>}
            <RNTextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              style={style}
              testID="text-input"
              {...props}
            />
            {error && <Text testID="input-error">{error}</Text>}
          </View>
        );
      },
      {
        Icon: ({ icon, onPress }) => {
          const React = require('react');
          const { TouchableOpacity, Text } = require('react-native');
          return (
            <TouchableOpacity onPress={onPress} testID="text-input-icon">
              <Text>{icon}</Text>
            </TouchableOpacity>
          );
        },
      }
    ),
    Button: ({ onPress, children, disabled, style, ...props }) => (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled}
        style={style}
        testID="paper-button"
        {...props}
      >
        {children !== undefined && children !== '' ? <Text>{children}</Text> : null}
      </TouchableOpacity>
    ),
    Surface: ({ children, style, ...props }) => (
      <View style={style} testID="paper-surface" {...props}>
        {children}
      </View>
    ),
    Card: Object.assign(
      ({ children, style, ...props }) => {
        const React = require('react');
        const { View } = require('react-native');
        return (
          <View style={style} testID="paper-card" {...props}>
            {children}
          </View>
        );
      },
      {
        Content: ({ children, style, ...props }) => {
          const React = require('react');
          const { View } = require('react-native');
          return (
            <View style={style} testID="paper-card-content" {...props}>
              {children}
            </View>
          );
        },
      }
    ),
    Modal: ({ visible, children, ...props }) =>
      visible ? (
        <View testID="paper-modal" {...props}>{children}</View>
      ) : null,
    ActivityIndicator: ({ size, color, ...props }) => (
      <View testID="activity-indicator" {...props}>
        <Text>Loading...</Text>
      </View>
    ),
    RadioButton: {
      Group: ({ children, onValueChange, value, ...props }) => {
        const React = require('react');
        const { View } = require('react-native');
        
        // Create a context or use a different approach to pass onValueChange to children
        const childrenWithProps = React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // Pass onValueChange as a prop to each child
            return React.cloneElement(child, {
              onValueChange: onValueChange,
              groupValue: value,
            });
          }
          return child;
        });
        
        return (
          <View testID="radio-button-group" {...props}>
            {childrenWithProps}
          </View>
        );
      },
      Item: ({ label, value, position, labelStyle, style, disabled, theme, onPress, groupValue, onValueChange, ...props }) => {
        const React = require('react');
        const { TouchableOpacity, Text } = require('react-native');
        const handlePress = () => {
          if (!disabled && onValueChange) {
            onValueChange(value);
          }
        };
        return (
          <TouchableOpacity 
            testID="radio-button-item" 
            disabled={disabled}
            style={style}
            onPress={handlePress}
            accessibilityLabel={label}
            {...props}
          >
            <Text style={labelStyle}>{label}</Text>
          </TouchableOpacity>
        );
      },
    },
    Text: ({ children, style, variant, ...props }) => (
      <Text style={style} testID="paper-text" {...props}>
        {children}
      </Text>
    ),
    SegmentedButtons: ({ value, onValueChange, buttons, ...props }) => {
      const React = require('react');
      const { View, TouchableOpacity, Text } = require('react-native');
      return (
        <View testID="segmented-buttons" {...props}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              testID={`segmented-button-${index}`}
              onPress={() => onValueChange(button.value)}
              style={{ padding: 8 }}
            >
              <Text>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    },
    Portal: ({ children }) => {
      const React = require('react');
      const { View } = require('react-native');
      return <View testID="portal">{children}</View>;
    },
    Switch: ({ value, onValueChange, color, testID }) => {
      const React = require('react');
      const { TouchableOpacity, View } = require('react-native');
      return (
        <TouchableOpacity
          onPress={() => onValueChange(!value)}
          testID={testID || 'switch'}
          style={{ backgroundColor: value ? color : '#ccc', padding: 8 }}
        >
          <View />
        </TouchableOpacity>
      );
    },
  };
});

// Mock setImmediate for React Native Paper
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native Settings
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
  watchKeys: jest.fn(),
  clearWatch: jest.fn(),
})); 
