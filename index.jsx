var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;

var TabContainer = React.createClass({
  getInitialState() {
    return {
      key: 1
    };
  },

  handleSelect(key) {
    this.setState({key});
  },

  render() {
    return (
        <div>
            <Nav bsStyle="tabs" activeKey={this.state.key} onSelect={this.handleSelect}>
                <NavItem eventKey={1}>+</NavItem>
                <NavItem eventKey={2}>Golden Delicious</NavItem>
                <NavItem eventKey={3}>Ida Red</NavItem>
                <NavItem eventKey={4}>Empire</NavItem>
            </Nav>
            <div className="tab-content">
                <TabPane tabKeys={[1]} activeKey={this.state.key}><h1>Home, Sweet home.</h1></TabPane>
                <TabPane tabKeys={[2]} activeKey={this.state.key}><h2>A Yellow Apple</h2></TabPane>
                <TabPane tabKeys={[3,4]} activeKey={this.state.key}><h3>Red Apples</h3></TabPane>
            </div>
        </div>
    );
  }
});

var TabPane = React.createClass({
    getClasses(keys, activeKey) {
        var classes = ['tab-pane'];
        var isActive = keys.find(function(key){
            return key===activeKey;
        });
        if (isActive) {
            classes.push('active');
        }
        return classes.join(' ');
    },
    render() {
        var classes = this.getClasses(this.props.tabKeys, this.props.activeKey);
        return (
            <div className={classes}>{this.props.children} key: [{this.props.activeKey}]</div>
        );
    }
});

React.render(
    <TabContainer/>,
    document.getElementById('tabs-container'));
