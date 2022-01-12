import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Image } from "react-native";

import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import db from "../config";

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domState: "normal",
      hasCameraPermissions: null,
      scanned: false,
      scannedData: "",
      bookId: "", studentId: ""
    }
  }
  // empty string = ""
  getCameraPermissions = async domState => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      /*status === "granted" is true when user has granted permission
      status === "granted" is false when user has not granted the permission
      */
      hasCameraPermissions: status === "granted",
      domState: domState,
      scanned: false
    });
  };

  handleBarCodeScanned = async ({ type, data }) => {
    const { domState } = this.state;
    if (domState === "bookId") {
      this.setState({
        bookId: data,
        domState: "normal",
        scanned: true
      });
    }
    else if (domState === "studentId") {
      this.setState({
        studentId: data,
        domState: "normal",
        scanned: true
      })

    }


    // this.setState({
    //   scannedData: data,
    //   domState: "normal",
    //   scanned: true
    // });
  };
  handleTransaction = () => {
    //db.collection(<collectionName>).doc(<docId>).get()
    var { bookId } = this.state;
    db.collection("books").doc(bookId).get()
      .then(doc => {
        //doc.data() is used to get all the information stored in the document
        var book = doc.data();
        console.log(doc.data());
        if (book.is_book_available) {
          this.initiateBookIssue();
        }
        else {
          this.initiateBookReturn();
        }
      })
  }

  initiateBookIssue = () => {
    console.log("Book issued to the student!");
    alert("Book issued to the student!")
  };
  initiateBookReturn = () => {
    console.log("Book has been returned to library");
    alert("Book has been returned to library");
  }


  render() {
    const { domState, hasCameraPermissions, scannedData, bookId, studentId, scanned } = this.state;
    if (domState !== "normal") {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.bgImage} source={bgImage} >
          <View style={styles.upperContainer}>
            <Image source={appIcon} style={styles.appIcon} />
            <Image source={appName} style={styles.appName} />
          </View>


          <View style={styles.lowerContainer}>
            <View style={styles.textinputContainer}>
              <TextInput
                style={styles.textinput}
                placeholder={"Book ID"}
                placeholderTextColor={"#FFFFFF"}
                value={bookId}
                onChangeText={text => this.setState({ bookId: text })}
              />
              <TouchableOpacity style={styles.scanbutton}
                onPress={() => this.getCameraPermissions("bookId")} >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.textinputContainer, { marginTop: 25 }]}>
              <TextInput
                style={styles.textinput}
                placeholder={"Student Id"}
                placeholderTextColor={"#FFFFFF"}
                value={studentId}
                onChangeText={text => this.setState({ studentId: text })}
              />
              <TouchableOpacity
                onPress={() => this.getCameraPermissions("studentId")}
                style={styles.scanbutton}
              >
                <Text style={styles.scanbuttonText}>Scan</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { marginTop: 25 }]}
              onPress={() => this.handleTransaction()}  >
              <Text style={styles.buttonText}> Submit </Text>
            </TouchableOpacity>



          </View>

          {/* <Text style={styles.text}>
          {hasCameraPermissions ? scannedData : "Request for Camera Permission"}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.getCameraPermissions("scanner")}>
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity> */}
        </ImageBackground>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80
  },
  appName: {
    width: 80,
    height: 80,
    resizeMode: "contain"
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold"
  },
  button: {
    width: "43%",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15
  },
  buttonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "Rajdhani_600SemiBold"
  }
});
