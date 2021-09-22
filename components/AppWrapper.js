import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Icon } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

class AppWrapper extends Component {

  render() {
    const isDark = this.props.isDark;
    const screenWidth = Dimensions.get("window").width;

    const ModeIcon = (props) => (
      <Icon {...props} style={styles.icon} name={isDark ? 'sun-outline' : 'moon-outline'} fill='#8F9BB3'/>
    );

    const StreamIcon = (props) => (
      <Icon {...props} style={styles.icon} name='trending-up-outline' fill='#8F9BB3'/>
    );

    const BatchIcon = (props) => (
      <Icon {...props} style={styles.icon} name='arrow-circle-down-outline' fill='#8F9BB3'/>
    );

    const chartConfig = {
      backgroundGradientFrom: "#0057C2",
      backgroundGradientFromOpacity: 1,
      backgroundGradientTo: "#0057C2",
      backgroundGradientToOpacity: 1,
      fillShadowGradient: "#C7E2FF",
      color: (opacity = 1) => `rgba(242, 248, 255, ${opacity})`,
      strokeWidth: 3, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };

    let dataTemperature = {
      labels: [],
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(242, 248, 255, ${opacity})`, // optional
          strokeWidth: 2 // optional
        }
      ],
      legend: ["Temperature"] // optional
    };

    let dataHumitity = {
      labels: [],
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(242, 248, 255, ${opacity})`, // optional
          strokeWidth: 2 // optional
        }
      ],
      legend: ["Humidity"] // optional
    };


    if (this.props.data.data && this.props.data.data.length > 0) {
      dataTemperature.labels = this.props.data.data.map(a => {
        const date = new Date(a.timestamp);
        const dateString = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
        return dateString;
      });
      dataTemperature.datasets[0].data = this.props.data.data.map(a => a.temperature);

      dataHumitity.labels = dataTemperature.labels;
      dataHumitity.datasets[0].data = this.props.data.data.map(a => a.humidity);
    }

    return (
        <ApplicationProvider {...eva} theme={isDark ? eva.dark : eva.light}>
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button
                style={styles.button}
                appearance='ghost'
                accessoryLeft={ModeIcon}
                onPress={() => this.props.dispatch(toggleDarkMode(!isDark))}
            />
            <Button
                style={styles.button}
                appearance='ghost'
                accessoryLeft={StreamIcon}
                onPress={() => this.startDataStream()}
            />
            <Button
                style={styles.button}
                appearance='ghost'
                accessoryLeft={BatchIcon}
                onPress={() => this.batchData()}
            />
            <LineChart
              style={styles.lineChart}
              data={dataTemperature}
              width={screenWidth}
              height={300}
              chartConfig={chartConfig}
            />
            <LineChart
              style={styles.lineChart}
              data={dataHumitity}
              width={screenWidth}
              height={300}
              chartConfig={chartConfig}
            />
            </Layout>
        </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 100,
    width: 128,
    height: 128,
    borderRadius: 33
  },
  icon: {
    width: 32,
    height: 32
  },
  lineChart: {
    padding: 20
  }
});

function mapStateToProps ({settings, data}) {
    return {
        isDark: settings.isDark,
        data: data
    }
}

export default connect(mapStateToProps)(AppWrapper);