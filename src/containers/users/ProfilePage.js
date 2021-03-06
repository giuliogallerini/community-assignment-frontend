import React, { PureComponent, Fragment} from 'react'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import PostPage from '../PostPage'
import PostItem from '../../components/PostItem'
import Avatar from 'material-ui/Avatar'
import Typography from 'material-ui/Typography'
import Chip from 'material-ui/Chip';
import VerifiedUserIcon from 'material-ui-icons/VerifiedUser';
import ReportIcon from 'material-ui-icons/Report'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import SpeakerNotesOff from 'material-ui-icons/SpeakerNotesOff';
import Edit from 'material-ui-icons/Edit';
import Tooltip from 'material-ui/Tooltip'
import IconButton from 'material-ui/IconButton';

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';

import uuid4 from 'uuid4'
import { fetchUserPosts } from '../../actions/posts/fetch'
import { fetchUser } from '../../actions/user/fetch'
import '../styles/ProfilePage.css'


import EditProfile from '../../components/forms/EditProfile'

class ProfilePage extends PureComponent {
  state = {
    open: false,
    selectedTagId: null,
    postId: null,
    showEditProfile: false,
    showProfile: true
  }

  componentWillMount() {
    let userId = this.props.match.params.userId

    this.props.fetchUser(userId)
    this.props.fetchUserPosts(userId)
  }

  handleDialogOpen = (postId) => (event) => {
    this.setState({
      open: true,
      postId: postId
    })
  }

  handleDialogClose = () => {
    this.setState({
      open: false,
      postId: null
    })
  }

  renderNickname = () => {
    return this.props.user.profile === undefined
      ? "-"
      : this.props.user.profile.nickname
  }

  renderPicture = () => {
    return this.props.user.profile === undefined || this.props.user.profile.picture === null
      ? "https://weareworldchallenge.com/wp-content/themes/world-challenge/img/avatar-placeholder.png"
      : this.props.user.profile.picture
  }


  renderFullname = () => {
    return this.props.user.profile === undefined
      ? null
      : !!this.props.user.profile.first_name && !!this.props.user.profile.last_name
          ? <Typography type='subheading' className='fullname MuiTypography-colorTextSecondary-59'>
              {this.props.user.profile.first_name} {this.props.user.profile.last_name}
            </Typography>
          : null
  }

  renderBio = () => {
    return this.props.user.profile === undefined
      ? null
      : this.props.user.profile.bio
  }

  renderTrustiness = () => {
    return this.props.user.trustiness >= 0
      ? <VerifiedUserIcon className="trustiness-icon"/>
      : <ReportIcon className="report-icon"/>
  }

  renderSilenced = () => {
    return this.props.user.silenced
      ? <Tooltip id="tooltip-top" title="This user is silenced" placement="right" className="tooltip">
          <SpeakerNotesOff className="silenced-icon"/>
        </Tooltip>
      : null
  }

  renderFirstname = () => {
    return this.props.user.profile === undefined
      ? ""
      : this.props.user.profile.first_name
  }

  renderLastname = () => {
    return this.props.user.profile === undefined
      ? ""
      : this.props.user.profile.last_name
  }

  renderBio = () => {
    return this.props.user.profile === undefined
      ? ""
      : this.props.user.profile.bio
  }

  setEditProfileState = () => {
    this.setState({
      showEditProfile: !this.state.showEditProfile,
      showProfile: !this.state.showProfile
    })
  }
  //
  // setShowProfileState = () => {
  //   this.setState({
  //     showProfile: !this.state.showProfile,
  //     })
  // }

  render() {
    const { currentUser, user, userPosts } = this.props
    const userId = this.props.match.params.userId

    return (
      <Fragment>
        <Paper className='profile-info'>
              {this.state.showEditProfile ? <EditProfile
                                              setEditProfileState={this.setEditProfileState}
                                              first_name={this.renderFirstname()}
                                              last_name={this.renderLastname()}
                                              bio={this.renderBio()}
                                            /> : null }

             {this.state.showProfile ? <Fragment> <div className="profile-content">
                                          <Avatar
                                              alt={this.renderNickname()}
                                              src={this.renderPicture()}
                                              className="profile-avatar"
                                            />
            <div className='profile-details'>
              <Typography type='display1' style={{fontWeight: 700, color: "black"}}className='nickname'>
                {this.renderNickname()}
                <Chip
                  label={user.trustiness}
                  className="trustiness-profile"
                  avatar={this.renderTrustiness()}
                />
              </Typography>
              <div className="wrapper">
                {this.renderFullname()}
                {this.renderSilenced()}
              </div>
            </div>
          </div>

          {currentUser && (currentUser.id.toString() === userId.toString()) ? <Tooltip id="tooltip-edit" title="Edit your profile" placement="top" className="tooltip">
            <IconButton className="profile-edit" onClick={this.setEditProfileState}>
              <Edit className="profile-edit"/>
            </IconButton>
          </Tooltip> : null }

          <ExpansionPanel style={{width: '100%'}} disabled={!!user.profile && user.profile.bio === null}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>View bio</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails fullWidth={true}>
              <Typography type='body1' className='bio'>
                {this.renderBio()}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel></Fragment>
          : null }
        </Paper>

        <div className="posts-container">
          {!!userPosts && userPosts.map(post =>
            <PostItem
              id={post.id}
              key={uuid4()}
              content={post.content}
              summary={post.summary}
              images={post.images}
              trusts={post.trusts}
              reports={post.reports}
              comments={post.comments}
              createdAt={post.created_at}
              trustiness={post.user.trustiness}
              picture={post.user.profile.picture}
              nickname={post.user.profile.nickname}
              onClick={this.handleDialogOpen(post.id)}
              />)}
        </div>

        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title"
          style={{ overflowY: "scroll" }}
        >
          <PostPage postId={this.state.postId}/>
        </Dialog>

      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  user: state.user,
  userPosts: state.posts.userPosts
})

export default connect(mapStateToProps, { fetchUser, fetchUserPosts })(ProfilePage)
