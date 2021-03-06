import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PostsOverview from './containers/PostsOverview'
import PostPage from './containers/PostPage'
import ProfilePage from './containers/users/ProfilePage'

export default class Routes extends Component {
  render() {
    return (
      <main className="mainContainer">
        <Route exact path="/" component={PostsOverview} />
        <Route exact path="/posts" component={PostsOverview} />
        <Route exact path="/posts/:postId" component={PostPage} />
        <Route exact path="/users/:userId" component={ProfilePage} />
      </main>
    )
  }
}
