import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { 
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform } from 'react-native';
import { 
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Icon,
  Popover,
  Autocomplete,
  AutocompleteItem,
  RangeDatepicker,
  Select,
  SelectItem,
  Modal,
  Card } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { addDataPoint } from '../actions/data'
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import ScannerWrapper from './ScannerWrapper';

class AppWrapper extends Component {

  colorConstant = '#222b45';

  state = {
    menuVisible: false,
    settingsVisible: true,
    scannerModalVisible: false,
    autocompleteInput: '',
    selectedDevice: '',
    dateRange: '',
    selectedFunction: 0
  }

  changeMenuVisibility = (visible) => {
    this.setState(() => ({
      menuVisible: visible
    }));
  }

  changeSettingsVisibility = (visible) => {
    this.setState(() => ({
      settingsVisible: visible
    }));
  }

  changeAutocompleteInput = (value) => {
    this.setState(() => ({
      autocompleteInput: value
    }));
  }

  changeSelectedDevice = (deviceIndex) => {
    this.setState(() => ({
      selectedDevice: this.props.devices[deviceIndex],
      autocompleteInput: this.props.devices[deviceIndex]
    }));
  }

  changeDateRange = (dateRange) => {
    this.setState(() => ({
      dateRange: dateRange
    }));
  }

  changeSelectedFunction = (selectedFunction) => {
    this.setState(() => ({
      selectedFunction: selectedFunction
    }));
  }

  changeScannerModalVisibility = (visible) => {
    this.setState(() => ({
      scannerModalVisible: visible
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

    const IconBuilder = (props, icon) => (
      <Icon {...props} name={icon} fill='#8F9BB3'/>
    );

    const SettingsButton = (props) => (
      <Button
        style={{marginLeft: 'auto'}}
        appearance='ghost'
        accessoryLeft={IconBuilder(props, 'settings-outline')}
        onPress={() => this.changeMenuVisibility(true)}
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

    const renderAutocompleteItem = (item, index) => (
      <AutocompleteItem
        key={index}
        title={item}
      />
    );

    return (
      <ApplicationProvider {...eva} theme={isDark ? eva.dark : eva.light}>
        <View style={{height: Constants.statusBarHeight}} backgroundColor={isDark ? this.colorConstant : 'white'}>
          <StatusBar style={!isDark ? 'dark' : 'light' } translucent={true} backgroundColor={isDark ? this.colorConstant : 'white'}></StatusBar>
        </View>
        <Layout style={{flexDirection: 'row'}}>
          <Text style={{marginLeft: 20}} category='h1'>TemHu</Text>
          <Popover
            visible={this.state.menuVisible}
            anchor={SettingsButton}
            onBackdropPress={() => this.changeMenuVisibility(false)}
          >
            <Layout style={styles.content}>
              <Button
                appearance='ghost'
                accessoryLeft={IconBuilder(this.props, isDark ? 'sun-outline' : 'moon-outline')}
                onPress={() => this.props.dispatch(toggleDarkMode(!isDark))}
              />
              <Button
                appearance='ghost'
                accessoryLeft={IconBuilder(this.props, 'trending-up-outline')}
                onPress={() => this.startDataStream()}
              />
              <Button
                appearance='ghost'
                accessoryLeft={IconBuilder(this.props, 'arrow-circle-down-outline')}
                onPress={() => this.batchData()}
              />
            </Layout>
          </Popover>
        </Layout>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
        <TouchableOpacity onPress={() => this.changeSettingsVisibility(!this.state.settingsVisible)}
          style={{
              backgroundColor: '#222b45',
              height: this.state.settingsVisible ? 200 : 40,
              borderTopWidth: 2,
              borderTopColor: '#222735',
              boxShadow: '0px -20px 20px 0px #0000003d'
            }}>
            <Icon style={styles.autocomplete} name={this.state.settingsVisible ? 'arrow-circle-down-outline' : 'arrow-circle-up-outline'} fill='#8F9BB3'/>
            {this.state.settingsVisible ?
            <Layout style={{margin: 20}}>
              <ScrollView>
              <Autocomplete
                placeholder='Enter device ID (no ID will aggregate all devices)'
                value={this.state.autocompleteInput}
                accessoryRight={IconBuilder(this.props, 'close')}
                onChangeText={this.changeAutocompleteInput}
                onSelect={this.changeSelectedDevice}>
                {this.props.devices && this.state.autocompleteInput ? this.props.devices.filter(device => device.includes(this.state.autocompleteInput)).map(renderAutocompleteItem) : []}
              </Autocomplete>
              <Text appearance='hint' style={styles.hintText}>
                {`Number of available devices: ${this.props.devices?.length}`}
              </Text>
              <RangeDatepicker
                range={this.state.dateRange}
                onSelect={nextRange => this.changeDateRange(nextRange)}
                placeholder='Time range'
              />
              <Select
                selectedIndex={this.state.selectedFunction}
                onSelect={index => this.changeSelectedFunction(index)}
                style={{marginTop: 10}}>
                <SelectItem title='Option 1'/>
                <SelectItem title='Option 2'/>
                <SelectItem title='Option 3'/>
              </Select>
              <Button 
                onPress={() => this.changeScannerModalVisibility(true)}
                appearance='outline'
                style={{alignSelf: 'center', width: 150, marginTop: 10}}>
                Scan QR Code
              </Button>
              <Modal
                visible={this.state.scannerModalVisible}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => this.changeScannerModalVisibility(!this.state.scannerModalVisible)}>
                  <Card style={styles.scannerCard}>
                    <ScannerWrapper />
                    <Button onPress={() => this.changeScannerModalVisibility(false)}>Cancel</Button>
                  </Card>
              </Modal>
              <Button 
                appearance='outline' 
                style={{alignSelf: 'center', width: 150, marginTop: 10}} 
                onPress={() => this.batchData()} 
                disabled={this.state.selectedDevice === '' || this.state.dateRange === ''}>
                EXECUTE
              </Button>
              </ScrollView>
            </Layout> : undefined}
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20
  },
  autocomplete: {
    height: 32,
    width: 32,
    alignSelf:'center'
  },
  hintText: {
    marginLeft: 10,
    marginTop: 3,
    marginBottom: 10,
    fontSize: 10
  }
});

function mapStateToProps ({settings, data}) {
  return {
    isDark: settings.isDark,
    data: data,
    devices: data.devices
  }
}

export default connect(mapStateToProps)(AppWrapper);