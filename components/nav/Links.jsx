var React = require('react'),
    Router = require('react-router'),
    classNames = require('classnames'),
    Link = Router.Link;

var Links = React.createClass({
  displayName: 'Links',

  propTypes: {
    className: React.PropTypes.string,
    hash: React.PropTypes.string,
    links: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        name: React.PropTypes.string,
        path: React.PropTypes.string
      })
    )
  },

  getInitialState: function() {
    return {
      hash: ''
    };
  },

  render: function() {
    var hash = this.props.hash;
    var val = this.props.links.map(function(link) {
      if (link.path.indexOf('#') !== -1) {
        var underLineClass = classNames({
          'nav_underline': true,
          'active': hash && link.path.indexOf(hash) !== -1
        });
        return (
          <li key={ link.path }>
            <a href={ link.path } target='_self'>
              { link.name }
            </a>
            <div className={ underLineClass }></div>
          </li>
        );
      } else {
        return (
          <li key={ link.path }>
            <Link to={ link.path }>{ link.name }</Link>
          </li>
        );
      }
    });

    return (
      <ul className={ this.props.className }>
        { val }
      </ul>
    );
  }
});
module.exports = Links;
