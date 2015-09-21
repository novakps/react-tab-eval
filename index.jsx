var React = require('react');
var ReactTabPanel = require('react-tab-panel');

// react-tab-panel
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
