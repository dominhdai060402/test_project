import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#1E1E1E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDE2E8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9FAFC',
  },
  loginBtn: {
    backgroundColor: '#2A5EE0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: '#E5E8EF',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#A9AEB8',
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 15,
    fontWeight: '600',
  },
  faceIdBtn: {
    borderWidth: 1,
    borderColor: '#2A5EE0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  faceIdText: {
    color: '#2A5EE0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotText: {
    textAlign: 'center',
    color: '#2A5EE0',
    marginTop: 20,
    fontStyle: 'italic',
  },
  versionText: {
    marginTop: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default styles;
