import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  scannerBoxContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanScreenMessage: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700'
  },
  upperPart: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middlePart: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceDetails: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 23,
    color: 'black'
  },
  detailsItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  detailsTextLabel: {
    flex: 1,
    fontWeight: '700',
    color: 'black',
    fontSize: 15
  },
  detailsTextValue: {
    flex: 2,
    fontSize: 14,
    // borderWidth: 1,
    textAlign: 'right',
    color: 'black'
  },
  testingChecklist: {
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 23,
    color: 'black',
  },
  startButton: {
    backgroundColor: '#4908b0',
    // backgroundColor: '#9B59B6',
    // backgroundColor: '#ab91eb',
    // backgroundColor: '#574b90',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,

  },
  startButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  checklistItems: {
    flex: 1,
    fontWeight: '600',
    fontSize: 15,
    marginVertical: 5

  },
  checkListScroll: {
    flex: 1,
    width: 300
  },
  scannerBox: {
    borderWidth: 6,
    borderColor: 'black',
    width: 350,
    aspectRatio: 1,
    backgroundColor: '#ffffff54',
    borderRadius: 50
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: 'white',
    // opacity: 0.8,
    flex: 1,
    height: 50,
    maxHeight: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    // padding: 30
  },
  scanText: {
    width: '100%',
    width: 250,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    backgroundColor: 'black',
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  logo: {
    width: 240,
    resizeMode: 'stretch',

  }
});