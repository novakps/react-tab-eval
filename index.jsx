var React = require('react');
var ReactTabs = require('react-tabs');

// Models
var ContentType = {
  TYPE_1: 'content-type-1',
  TYPE_2: 'content-type-2',
  TYPE_3: 'content-type-3'
};

ContentType.getTitle = function(contentType) {
  switch(contentType) {
    case ContentType.TYPE_1:
      return 'Type 1';
    case ContentType.TYPE_2:
      return 'Type 2';
    case ContentType.TYPE_3:
      return 'Type 3';
    default:
      throw new Error('ContentType not recognized.');
  }
};

ContentType.getIcon = function(contentType) {
  return 'http://placehold.it/15x15';
};

ContentType.getContent = function(contentType) {
  return ContentType.getTitle(contentType) + ' Content';
};

var TabsModel = function() {
  this.activeTabIndex = 0;
  this.contentTypes = [ContentType.TYPE_1, ContentType.TYPE_2, ContentType.TYPE_3];

  this.data = this.getNewData();
};

$.extend(TabsModel.prototype, {
  getNewData: function() {
    return {
      activeTabIndex: this.activeTabIndex,
      contentTypes: this.contentTypes
    };
  },

  updateData: function() {
    var newData = this.getNewData();
    if (JSON.stringify(newData) !== JSON.stringify(this.data)) {
      $.extend(this.data, newData);
    }
  },

  setActiveTab: function(index) {
    this.activeTabIndex = index;
    this.updateData();
  }
});

TabsModel.instance = undefined;
TabsModel.getInstance = function() {
  if (!TabsModel.instance) {
    TabsModel.instance = new TabsModel();
  }
  return TabsModel.instance;
}

// Actions and events
var EventBus = function() {};

$.extend(EventBus.prototype, {
  dispatchEvent: function(eventType, properties) {
    $(this).trigger(eventType, properties);
  }
});

EventBus.instance = undefined;
EventBus.getInstance = function() {
  if (!EventBus.instance) {
    EventBus.instance = new EventBus();
  }
  return EventBus.instance;
};

var Actions = function() {
  this.eventBus = EventBus.getInstance();

  this.eventMap = {};
  this.eventMap[Actions.EventType.ACTIVATE_TAB] = this.activateTab;

  this.setupListeners();
};

$.extend(Actions.prototype, {
  setupListeners: function() {
    Object.keys(this.eventMap).forEach(function(eventType) {
      $(this.eventBus).on(eventType, this.eventMap[eventType]);
    }, this);
  },

  activateTab: function(event, properties) {
    var model = TabsModel.getInstance();
    model.setActiveTab(properties.index);
    return true;
  }
});

Actions.EventType = {
  ACTIVATE_TAB: 'activate_tab',
  CLOSE_TAB: 'close_tab',
  OPEN_TAB: 'open_tab'
};

Actions.instance = undefined;
Actions.getInstance = function() {
  if (!Actions.instance) {
    Actions.instance = new Actions();
  }
  return Actions.instance;
};

// Child views
var TabList = React.createClass({
  componentWillMount: function() {
    this.eventBus = EventBus.getInstance();
    this.actions = Actions.getInstance();
  },

  render: function () {
    var data = this.props.data;

    var tabs = data.tabs.map(function(tab, i) {
      return (
        <ReactTabs.Tab key={i}>
          <img src={tab.icon} /> {tab.title}
        </ReactTabs.Tab>
      );
    });

    // Dummy panels, we're actually using our own (TabContent defined below)
    var tabPanels = data.tabs.map(function(tab, i) {
      return (<ReactTabs.TabPanel key={i}></ReactTabs.TabPanel>);
    });

    console.log('TabList#render', this.props);

    return (
      <ReactTabs.Tabs onSelect={this.handleSelect} selectedIndex={data.activeTabIndex}>
        <ReactTabs.TabList>{tabs}</ReactTabs.TabList>{tabPanels}
      </ReactTabs.Tabs>
    );
  },

  /**
   * @param {number} index
   * @param {number} last
   * @private
   */
  handleSelect: function (index, last) {
    this.eventBus.dispatchEvent(Actions.EventType.ACTIVATE_TAB, { index: index });
  }
});

var TabContent = React.createClass({
  render: function() {
    // One content div per content type
    var tabContents = this.props.data.map(function(tabData) {
      var classNames = 'react-tab-content';
      if (tabData.active) {
        classNames += ' active';
      }
      return (
        <div key={tabData.id} className={classNames}>
          {tabData.content}
        </div>
      );
    });

    return (<div>{tabContents}</div>);
  }
});

// Parent view
var TabContainer = React.createClass({
  componentWillMount: function() {
    this.setupListeners();
  },

  getInitialState: function() {
    return this.getModel().data;
  },

  render: function() {
    var tabListData = this.getTabListData();
    var tabContentData = this.getTabContentData();

    return (
      <div className="tab-container">
        <TabList data={tabListData} />
        <TabContent data={tabContentData} />
      </div>
    );
  },

  getModel: function() {
    return TabsModel.getInstance();
  },

  setupListeners: function() {
    Object.observe(this.getModel().data, this.update);
  },

  update: function() {
    console.log('TabContainer#update', this.getModel().data);
    this.setState(this.getModel().data);
  },

  /**
   * @private
   */
  getTabListData: function() {
    var modelData = this.getModel().data;
    return {
      activeTabIndex: modelData.activeTabIndex,
      tabs: modelData.contentTypes.map(function(contentType) {
        return {
          icon: ContentType.getIcon(contentType),
          title: ContentType.getTitle(contentType)
        }
      })
    };
  },

  /**
   * @private
   */
  getTabContentData: function() {
    var modelData = this.getModel().data;
    return modelData.contentTypes.map(function(contentType, i) {
      return {
        id: i,
        active: modelData.activeTabIndex === i,
        content: ContentType.getContent(contentType)
      };
    });
  }
});

React.render(<TabContainer />, document.getElementById('tabs-container'));