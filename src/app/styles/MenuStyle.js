import {StyleSheet} from 'react-native';

const MenuStyle = StyleSheet.create({
  // Header
  leftAction: {
    fontWeight: 'bold',
    color: '#FFF',
    paddingRight: 16,
    fontSize: 16,
  },
  box_center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  box_center_full: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box_center_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  box_center_row_c: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Thông báo
  txtHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  txtNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'red',
  },
  // Messages
  message: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  // Content Page
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },

  container_tablet: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingRight: 10,
    paddingLeft: 10,
  },

  container_col: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    flexDirection: 'row',
  },

  box_content_none: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  box_content_none_full: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
  },
  box_content: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
  box_tabcol: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  box_feature: {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  box_feature_none: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  box_feature_left_muti: {
    flex: 1,
    height: 80,

    marginRight: 5,
  },
  box_feature_left: {
    flex: 1,
    height: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 5,
  },
  box_feature_left_one: {
    flex: 1,
    height: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  box_feature_right: {
    flex: 1,
    height: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
    marginBottom: 10,
    marginLeft: 5,
  },

  touchableOpacity: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOpacityRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuText: {
    paddingTop: 8, 
    textAlign: 'center',
    paddingRight: 8,
    paddingLeft: 8
  },
  // Model Center Position
  model_center: {
    alignSelf: 'center',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    top: 0,
    bottom: 0,
    paddingBottom: 0,
    marginBottom: 10,
    paddingTop: 0,
    marginTop: 10,
  },
  model_tsheet: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    //bottom: 0,
    paddingBottom: 0,
    marginBottom: 0,
    width: 500,
  },
  model_psheet: {
    alignSelf: 'center',
    position: 'absolute',
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    top: 0,
    left: 0,
    right: 0,
    //bottom: 0,
  },
  btnText: {
    color: 'white',
    paddingRight: 5,
    paddingLeft: 5,
  },
});

export default MenuStyle;
