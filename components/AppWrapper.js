import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as eva from '@eva-design/eva';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Button, Icon } from '@ui-kitten/components';
import { toggleDarkMode } from '../actions/settings';

class AppWrapper extends Component {

  render() {
    const isDark = this.props.isDark;

    const ModeIcon = (props) => (
      <Icon {...props} style={styles.icon} name={isDark ? 'sun-outline' : 'moon-outline'} fill='#8F9BB3'/>
    );

    return (
        <ApplicationProvider {...eva} theme={isDark ? eva.dark : eva.light}>
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text category='h1'>Z-CAMP</Text>
            <Button
                style={styles.button}
                appearance='ghost'
                accessoryLeft={ModeIcon}
                onPress={() => this.props.dispatch(toggleDarkMode(!isDark))}
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
});

function mapStateToProps ({settings}) {
    return {
        isDark: settings.isDark
    }
}

export default connect(mapStateToProps)(AppWrapper);