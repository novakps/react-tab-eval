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

  render: function () {
    return (
      <Tabs onSelect={this.handleSelect} selectedIndex={0}>
        <TabList>
          <Tab>Pros</Tab>
          <Tab>Cons</Tab>
        </TabList>
        <TabPanel>
          <ul>
            <li>Styled</li>
            <li>Simple</li>
            <li>Clean</li>
          </ul>
        </TabPanel>
        <TabPanel>
          <ul>
            <li>None</li>
          </ul>
        </TabPanel>
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
