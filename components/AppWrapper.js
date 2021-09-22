import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Icon, Popover } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { addDataPoint } from '../actions/data'
import { StatusBar } from 'react-native';

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
    console.log(StatusBar.currentHeight)
    const isDark = this.props.isDark;
    const screenWidth = Dimensions.get("window").width;

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
        <StatusBar></StatusBar>
        <Layout style={{marginTop: StatusBar.currentHeight}}>
          <Popover
            visible={this.state.visible}
            anchor={SettingsButton}
            onBackdropPress={() => this.changeVisibility(false)}
          >
          <Layout style={styles.content}>
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
          </Layout>
        </Popover>
        </Layout>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category='h1'>Z-CAMP</Text>
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  button: {
    borderRadius: 33
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