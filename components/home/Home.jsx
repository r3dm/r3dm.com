var React = require('react'),
    // debug = require('debug')('r3dm:comp:home'),

    // # Components
    Team = require('../team'),
    Banner = require('../banner'),
    Logo = require('../logo'),
    Services = require('../services'),
    Work = require('../work'),
    Connect = require('../connect'),
    Email = require('../email');

var Home = React.createClass({
  displayName: 'Home',

  render: function() {

    return (
      <main className='main-app'>
        <div className='logo-container'>
          <div className='v-center'>
            <div>
              <Logo logoClass='logo'/>
            </div>
          </div>
        </div>
        <section className='first-con'>
          <Banner />
          <div className='first-con_bot'>
            <header>
              <p>
                We deliver Web and Mobile
                experiences to our Customers.
              </p>
            </header>
          </div>
        </section>
        <Services />
        <Work />
        <Team />
        <Connect />
        <Email />
      </main>
    );
  }
});

module.exports = Home;
