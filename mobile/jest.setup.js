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

// Mock React Native Paper components that cause issues in tests
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  const MD3LightTheme = {
    colors: {
      primary: '#6200ee',
      secondary: '#03dac6',
      error: '#b00020',
      background: '#f6f6f6',
      surface: '#ffffff',
      text: '#000000',
      onPrimary: '#ffffff',
      onSecondary: '#000000',
      onError: '#ffffff',
      onBackground: '#000000',
      onSurface: '#000000',
    },
  };
  
  return {
    MD3LightTheme,
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
    TextInput: ({ value, onChangeText, placeholder, label, error, secureTextEntry, keyboardType, style, ...props }) => {
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
    Surface: ({ children, style, ...props }) => (
      <View style={style} testID="paper-surface" {...props}>
        {children}
      </View>
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
