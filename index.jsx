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


// react-tab-panel
var ReactTabPanel = require('react-tab-panel');
var ReactTabPanelApp = React.createClass({
  getInitialState: function() {
    return {
      activeIndex: 1
    };
  },

  handleChange: function(index) {
    this.setState({
      activeIndex: index
    });
  },

  render: function() {
    return (
      <ReactTabPanel activeIndex={this.state.activeIndex}
        onChange={this.handleChange}
        titleStyle={{padding: 10}}>
        <div title="Pros">first</div>
        <div title="Cons">second</div>
      </ReactTabPanel>
    );
  }
});

React.render(<ReactTabPanelApp />, document.getElementById('react-tab-panel-content'));


// rc-tabs
var RcTabs = require('rc-tabs');
var RcTabPane = RcTabs.TabPane;

var RcTabsApp = React.createClass({
  handleChange: function() {
    console.log('handleChange', arguments);
  },

  render: function() {
    return (
      <RcTabs activeKey="1"
        onChange={this.handleChange}>
        <RcTabPane tab='Pros' key="1">Pros content</RcTabPane>
        <RcTabPane tab='Cons' key="2">Cons content</RcTabPane>
      </RcTabs>
    );
  }
});

React.render(<RcTabsApp />, document.getElementById('rc-tabs-content'));
