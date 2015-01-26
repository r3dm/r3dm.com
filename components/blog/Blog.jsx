var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link,
    StateStreamMixin = require('rx-react').StateStreamMixin,
    BlogStore = require('./blog.store.js'),
    debug = require('debug')('r3dm:components:blog');

var Blog = React.createClass({
  mixins: [StateStreamMixin,
           Router.State],

  getStateStream: function () {
    return BlogStore;
  },

  componentWillMount: function () {
    debug('comp will mount');
    if (this.props.context) {
      debug('found context');
      this.setState(this.props.context);
    }
  },

  render: function () {
    var posts = this.state.posts;
    if (!Array.isArray(posts)) {
      posts = [posts];
    }

    /* Iterates over the posts returned from Mongodb.
     * If there is only one render the single-blog-post-view.
     * Else, render a list of blog briefs that link to the whole versions.
    */
    var val = posts.map(function (post) {
      var html, readMore;

      if (post.content) {
        if (posts.length === 1) {
          html = post.content.extended;
        } else {
          html = post.content.brief;
          readMore = (<div className='read-full-story-container'>
              <Link to='blog' params={{ title: post.title }}
                    className='read-full-story'>
                READ THE FULL POST
              </Link>
            </div>);
        }
      } else {
        html = '<p>This post has no content</p>';
      }

      if (post.publishedDate) {
        post.publishedDate = new Date(post.publishedDate)
        .toLocaleString('en-US',
                        {month: 'long', day: 'numeric', year: 'numeric' });
      } else {
        post.publishedDate = 'not published';
        return null;
      }

      if (!post.author) {
        post.author = {};
        post.author.name = 'no author';
      }

      return (
        <div className='post'>
          <Link to='blog' params={{ title: post.title }}
                key={ post.title } className='post-title'>
            <h1>{ post.title }</h1>
          </Link>
          <div className='date-and-author'>
            { post.publishedDate } | By: { post.author.name }
          </div>
          <span dangerouslySetInnerHTML={{ __html: html }} />
          { readMore }
        </div>
      );
    });

    debug('will render');

    return (
      <div className='pure-g'>
        <div className='pure-u-1-6'></div>
        <div className='posts-wrapper pure-u-2-3'>{ val }</div>
        <div className='pure-u-1-6'></div>
      </div>
    );
  }
});

module.exports = Blog;
