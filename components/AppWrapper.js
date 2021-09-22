import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { StyleSheet, ScrollView, View, Platform } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Icon, Popover } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { addDataPoint } from '../actions/data'
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

class AppWrapper extends Component {

  state = {
    visible: false,
  }

  changeVisibility = (visible) => {
    this.setState(() => ({
        visible: visible
    }));
  }

  startDataStream() {
    //mocking data stream
    setInterval(() => this.props.dispatch(
      addDataPoint({
        timestamp: new Date().getTime(),
        temperature: Math.random(),
        humidity: Math.random()
      })
    ), 10000);
  }

  batchData() {
    //mocking batch data
    for(let i = 1; i < 11; ++i) {
      this.props.dispatch(
        addDataPoint({
          timestamp: new Date().getTime() - 60000 * i,
          temperature: Math.random(),
          humidity: Math.random()
        })
      );
    }
  }

  render() {
    const isDark = this.props.isDark;
    const screenWidth = Dimensions.get("window").width;
    let dataAvailable = false;

    const ModeIcon = (props) => (
      <Icon {...props} name={isDark ? 'sun-outline' : 'moon-outline'} fill='#8F9BB3'/>
    );

    const StreamIcon = (props) => (
      <Icon {...props} name='trending-up-outline' fill='#8F9BB3'/>
    );

    const BatchIcon = (props) => (
      <Icon {...props} name='arrow-circle-down-outline' fill='#8F9BB3'/>
    );

    const SettingsIcon = (props) => (
      <Icon {...props} name='settings-outline' fill='#8F9BB3'/>
    );

    const SettingsButton = (props) => (
      <Button
        style={{marginLeft: 'auto'}}
        appearance='ghost'
        accessoryLeft={SettingsIcon}
        onPress={() => this.changeVisibility(true)}
      />  
    );

    const chartConfig = {
      backgroundGradientFrom: isDark ? "#222B45": "#FFFFFF", // ui kitten color dark: 'background-basic-color-1' (light: #FFFFFF)
      backgroundGradientFromOpacity: 1,
      backgroundGradientTo: isDark ? "#222B45": "#FFFFFF", // ui kitten color dark: 'background-basic-color-1' (light: #FFFFFF)
      backgroundGradientToOpacity: 1,
      fillShadowGradient: isDark ? "#F7F9FC": "#2E3A59", // ui kitten color dark: 'color-basic-200' - light: 'color-basic-700' (#2E3A59)
      // ui kitten color dark: 'color-info-100' (#F2F8FF) - light: 'color-info-900' (#002885)
      color: (opacity = 1) => isDark ? `rgba(242, 248, 255, ${opacity})` : `rgba(0, 40, 133, ${opacity})`,
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };

    let dataTemperature = {
      labels: [],
      datasets: [
        {
          data: [],
          //  ui kitten color dark: 'color-success-200' (#B3FFD6) - light: 'color-success-800' (#007566)
          color: (opacity = 1) => isDark ? `rgba(179, 255, 214, ${opacity})` : `rgba(0, 117, 102, ${opacity})`,
          strokeWidth: 3 // optional
        },
        {
          data: [],
          // ui kitten color dark & light: 'color-danger-200' (#FFD6D9) - light: 'color-danger-800' (#94124E)
          color: (opacity = 1) => isDark ? `rgba(255, 214, 217, ${opacity})` : `rgba(148, 18, 78, ${opacity})`, 
          strokeWidth: 3
        }
      ],
      legend: ["Temperature", "Humidity"]
    };


    if (this.props.data.data && this.props.data.data.length > 0) {
      dataAvailable = true;
      const labels = this.props.data.data.map(a => {
        const date = new Date(a.timestamp);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        const dateString = `${hours}:${minutes}:${seconds}`;
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
        <View style={{height: Constants.statusBarHeight}} backgroundColor={isDark ? '#222b45' : 'white'}>
          <StatusBar style={!isDark ? 'dark' : 'light' } translucent={true} backgroundColor={isDark ? '#222b45' : 'white'}></StatusBar>
        </View>
        <Layout>
          <Popover
            visible={this.state.visible}
            anchor={SettingsButton}
            onBackdropPress={() => this.changeVisibility(false)}
          >
          <Layout style={styles.content}>
            <Button
              appearance='ghost'
              accessoryLeft={ModeIcon}
              onPress={() => this.props.dispatch(toggleDarkMode(!isDark))}
            />
            <Button
              appearance='ghost'
              accessoryLeft={StreamIcon}
              onPress={() => this.startDataStream()}
            />
            <Button
              appearance='ghost'
              accessoryLeft={BatchIcon}
              onPress={() => this.batchData()}
            />
          </Layout>
        </Popover>
        </Layout>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category='h1'>TemHu</Text>
          <ScrollView>
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
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