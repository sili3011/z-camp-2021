import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { StyleSheet, ScrollView } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Icon } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

class AppWrapper extends Component {

  render() {
    const isDark = this.props.isDark;
    const screenWidth = Dimensions.get("window").width;
    let dataAvailable = false;

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
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };

    let dataTemperature = {
      labels: [],
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(242, 248, 255, ${opacity})`, // optional
          strokeWidth: 3 // optional
        },
        {
          data: [],
          color: (opacity = 1) => `rgba(100, 84, 85, ${opacity})`, // optional
          strokeWidth: 3
        }
      ],
      legend: ["Temperature", "Humidity"]
    };


    if (this.props.data.data && this.props.data.data.length > 0) {
      dataAvailable = true;
      const labels = this.props.data.data.map(a => {
        const date = new Date(a.timestamp);
        const dateString = /*date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " +*/ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return dateString;
      });
      dataTemperature.labels = labels.slice(labels.length - 15);
      const tempData = this.props.data.data.map(a => a.temperature);
      dataTemperature.datasets[0].data = tempData.slice(tempData.length - 15);

      const dataHum = this.props.data.data.map(a => a.humidity);
      dataTemperature.datasets[1].data = dataHum.slice(dataHum.length - 15);
    }

    return (
        <ApplicationProvider {...eva} theme={isDark ? eva.dark : eva.light}>
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ScrollView>
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
              { dataAvailable && 
                <LineChart
                  verticalLabelRotation={70}
                  style={styles.lineChart}
                  data={dataTemperature}
                  width={screenWidth}
                  height={400}
                  chartConfig={chartConfig}
                />
              }
            </ScrollView>
            </Layout>
        </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 100,
    width: 28,
    height: 28,
    borderRadius: 33
  },
  icon: {
    width: 32,
    height: 32
  },
  lineChart: {
    paddingTop: 20,
    paddingBottom: 20
  }
});

function mapStateToProps ({settings, data}) {
    return {
        isDark: settings.isDark,
        data: data
    }
}

export default connect(mapStateToProps)(AppWrapper);