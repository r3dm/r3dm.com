/** @jsx React.DOM */
'use strict';
var React = require('react');

var Banner = React.createClass({
  render: function() {
    var banners = [
      'images/banner-xl.jpg 1256w',
      'images/banner-l.jpg 1000w',
      'images/banner-m.jpg 700w',
      'images/banner-s.jpg 500w'
    ].join(', ');

    return (
      <div className="first-con_top">
        <img srcSet= { banners } />
      </div>
    );
  }
});
module.exports = Banner;