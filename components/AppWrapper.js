import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Icon } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';
import { addDataPoint } from '../actions/data';

class AppWrapper extends Component {

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

    const ModeIcon = (props) => (
      <Icon {...props} style={styles.icon} name={isDark ? 'sun-outline' : 'moon-outline'} fill='#8F9BB3'/>
    );

    const StreamIcon = (props) => (
      <Icon {...props} style={styles.icon} name='trending-up-outline' fill='#8F9BB3'/>
    );

    const BatchIcon = (props) => (
      <Icon {...props} style={styles.icon} name='arrow-circle-down-outline' fill='#8F9BB3'/>
    );

    return (
        <ApplicationProvider {...eva} theme={isDark ? eva.dark : eva.light}>
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text category='h1'>Z-CAMP</Text>
                <Layout style={{marginTop: 100, flexDirection: 'row'}}>
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
            </Layout>
        </ApplicationProvider>
    );
  }
}


const styles = StyleSheet.create({
  button: {
    width: 128,
    height: 128,
    borderRadius: 33
  },
  icon: {
    width: 32,
    height: 32
  },
});

function mapStateToProps ({settings}) {
    return {
        isDark: settings.isDark
    }
}

export default connect(mapStateToProps)(AppWrapper);