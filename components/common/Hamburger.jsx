var React = require('react/addons'),
    PureRenderMixin = React.addons.PureRenderMixin;

var Hamburger = React.createClass({

  mixins: [PureRenderMixin],

  render: function() {
    return (
      <svg
        { ...this.props }
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48">
        <path d="M0 0h48v48h-48z" fill="none"/>
        <path d="M6 36h36v-4h-36v4zm0-10h36v-4h-36v4zm0-14v4h36v-4h-36z"/>
      </svg>
    );
  }
});
module.exports = Hamburger;
