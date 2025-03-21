import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { COLOR } from '../../env/config';

export const Appstyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  container: {
    flex: 1,
    //borderTopLeftRadius: 12,
    //borderTopRightRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 0,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header
  leftAction: {
    fontWeight: 'bold',
    color: '#FFF',
    paddingRight: 16,
    fontSize: 16,
  },
  b_center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  b_center_full: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const ttdStyle = StyleSheet.create({
  box_feature_left: {
    flex: 1,
    marginBottom: 10,
    marginRight: 4,
    marginLeft: 4,
    backgroundColor: '#f2f1f6',
    borderRadius: 8,
    padding: 8,
  },
  box_feature_left_one: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#f2f1f6',
    borderRadius: 8,
    padding: 8,
  },
  box_feature_right: {
    flex: 1,
    marginBottom: 10,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#f2f1f6',
    borderRadius: 8,
    padding: 8,
  },
});
