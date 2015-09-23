var React = require('react');

// react-tabs
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var ReactTabsApp = React.createClass({
  handleSelect: function (index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
  },

  getInitialState: function() {
    return {
      tabs: [{
        icon: 'http://placehold.it/15x15',
        title: 'Tab 1',
        content: 'Tab content 1'
      }, {
        icon: 'http://placehold.it/15x15',
        title: 'Tab 2',
        content: 'Tab content 2'
      }, {
        icon: 'http://placehold.it/15x15',
        title: 'Tab 3',
        content: 'Tab content 3'
      }, {
        icon: 'http://placehold.it/15x15',
        title: 'Tab 4',
        content: 'Tab content 4'
      }, {
        icon: 'http://placehold.it/15x15',
        title: 'Tab 5',
        content: 'Tab content 5'
      }]
    };
  },

  render: function () {
    var tabs = this.state.tabs.map(function(tab) {
      return (<Tab><img src={tab.icon} /> {tab.title}</Tab>);
    });

    var tabPanels = this.state.tabs.map(function(tab) {
      return (<TabPanel>{tab.content}</TabPanel>);
    });

    return (
      <Tabs onSelect={this.handleSelect} selectedIndex={0}>
        <TabList>{tabs}</TabList>{tabPanels}
      </Tabs>
    );
  }
});

React.render(<ReactTabsApp />, document.getElementById('react-tabs-content'));
