var React = require('react');
var ReactTabs = require('react-tabs');

// Models
var ContentType = {
  HOME: 'content-type-home',
  TYPE_1: 'content-type-1',
  TYPE_2: 'content-type-2',
  TYPE_3: 'content-type-3'
};

ContentType.getTitle = function(contentType) {
  switch(contentType) {
    case ContentType.HOME:
      return '+';
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
  if (ContentType.HOME === contentType) {
    return null;
  }
  return 'http://placehold.it/15x15';
};

ContentType.getContent = function(contentType) {
  return ContentType.getTitle(contentType) + ' Content';
};

var TabModel = function(id, name, contentType) {
  this.id = id;
  this.name = name;
  this.contentType = contentType;
};

$.extend(TabModel.prototype, {
  getId: function() {
    return this.id;
  },

  getIcon: function() {
    return ContentType.getIcon(this.contentType);
  },

  getTitle: function() {
    return ContentType.getTitle(this.contentType);
  },

  getContentType: function() {
    return this.contentType;
  }
});

var TabsModel = function() {
  this.activeTabIndex = 0;
  this.contentTypes = [ContentType.TYPE_1, ContentType.TYPE_2, ContentType.TYPE_3];

  this.tabs = [];
  this.initializeTabs();

  this.tabId = 0;

  this.data = this.getNewData();
};

$.extend(TabsModel.prototype, {
  getNewData: function() {
    return {
      activeTabIndex: this.activeTabIndex,
      contentTypes: this.contentTypes,
      tabs: this.tabs
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
  },

  openTab: function(contentType) {
    var name = ContentType.getTitle(contentType);
    this.tabs.push(new TabModel(++this.tabId, name, contentType));
    this.activeTabIndex = this.tabs.length - 1;
    this.updateData();
  },

  initializeTabs: function() {
    this.tabs = [this.getHomeTab()];
  },

  getHomeTab: function() {
    // Special case
    return new TabModel(0, null, ContentType.HOME);
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
  this.model = TabsModel.getInstance();

  this.eventBus = EventBus.getInstance();

  this.eventMap = {};
  this.eventMap[Actions.EventType.ACTIVATE_TAB] = this.activateTab.bind(this);
  this.eventMap[Actions.EventType.OPEN_TAB] = this.openTab.bind(this);

  this.setupListeners();
};

$.extend(Actions.prototype, {
  setupListeners: function() {
    Object.keys(this.eventMap).forEach(function(eventType) {
      $(this.eventBus).on(eventType, this.eventMap[eventType]);
    }, this);
  },

  activateTab: function(event, properties) {
    this.model.setActiveTab(properties.index);
  },

  openTab: function(event, properties) {
    this.model.openTab(properties.contentType);
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
      var content = tab.icon ?
        (<span><img src={tab.icon} /> {tab.title}</span>) :
        (<span>{tab.title}</span>);

      return (
        <ReactTabs.Tab key={i}>
          {content}
        </ReactTabs.Tab>
      );
    });

    // Dummy panels, we're actually using our own (TabContent defined below)
    var tabPanels = data.tabs.map(function(tab, i) {
      return (<ReactTabs.TabPanel key={i}></ReactTabs.TabPanel>);
    });

    return (
      <ReactTabs.Tabs onSelect={this.handleSelect} selectedIndex={data.activeTabIndex}>
        <ReactTabs.TabList>{tabs}</ReactTabs.TabList>{tabPanels}
      </ReactTabs.Tabs>
    );
  },

  handleSelect: function (index, last) {
    this.eventBus.dispatchEvent(Actions.EventType.ACTIVATE_TAB, { index: index });
  }
});

var HomeTab = React.createClass({
  componentWillMount: function() {
    this.eventBus = EventBus.getInstance();
    this.actions = Actions.getInstance();
  },

  render: function() {
    return (
      <ul>
        <li>
          <a onClick={this.handleOpen.bind(this, ContentType.TYPE_1)} href="javascript:void(0)">
            Open Type 1
          </a>
        </li>
        <li>
          <a onClick={this.handleOpen.bind(this, ContentType.TYPE_2)} href="javascript:void(0)">
            Open Type 2
          </a>
        </li>
        <li>
          <a onClick={this.handleOpen.bind(this, ContentType.TYPE_3)} href="javascript:void(0)">
            Open Type 3
          </a>
        </li>
      </ul>
    );
  },

  handleOpen: function(contentType) {
    this.eventBus.dispatchEvent(Actions.EventType.OPEN_TAB, { contentType: contentType });
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

      if (ContentType.HOME === tabData.contentType) {
        return (
          <div key={tabData.id} className={classNames}>
            <HomeTab />
          </div>
        );
      }

      return (
        <div key={tabData.id} className={classNames}>
          <div>ContentType: {tabData.text}</div>
          <div>ID: {tabData.id}</div>
        </div>
      );
    }, this);

    return (<div className="tab-content-container">{tabContents}</div>);
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
    this.setState(this.getModel().data);
  },

  getTabListData: function() {
    var modelData = this.getModel().data;
    return {
      activeTabIndex: modelData.activeTabIndex,
      tabs: modelData.tabs.map(function(tab) {
        return {
          icon: tab.getIcon(),
          title: tab.getTitle()
        }
      })
    };
  },

  getTabContentData: function() {
    var modelData = this.getModel().data;
    return modelData.tabs.map(function(tab, i) {
      return {
        id: tab.getId(),
        active: modelData.activeTabIndex === i,
        contentType: tab.getContentType(),
        text: tab.getTitle()
      };
    });
  }
});

React.render(<TabContainer />, document.getElementById('tabs-container'));