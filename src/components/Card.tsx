import React from "react";
import { StyleSheet, View } from "react-native";

const Card = (props: any) => {
  return (<View style={{...styles.card, ...props.style}}>{props.children}</View>);
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    elevation: 10,
    borderRadius: 10,
  },
});
