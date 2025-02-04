import { Component } from "react";
import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 24,
      guestCanPause: true,
      isHost: false,
      redirect: null,
      roomCode: this.props.roomCode, // Use this.props.roomCode here
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
    };

    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
  }

  componentDidMount() {
    if (this.state.roomCode) {
      this.getRoomDetails();
    }
    this.interval = setInterval(this.getCurrentSong, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  getRoomDetails() {
    if (!this.state.roomCode) return;
    fetch("/api/get-room" + "?code=" + this.state.roomCode)
      .then((response) => {
        if (!response.ok) {
          // If the room is not found, redirect to the home page
          throw new Error("Room not found");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (this.state.isHost) {
          this.authenticateSpotify();
        }
      })
      .catch(() => {
        this.setState({ redirect: "../", roomCode: null });
      });
  }

  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json()) //We'll never have an invalid respnse here since all we are doing is return T/F
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url); //Redirect to the Spotify auth page->redirect to spotfy_Callback->redirect to frontend -> reidrect to this room page
            });
        }
      });
  }

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        // console.log(response); // ✅ This will run
        return response.ok ? response.json() : {}; // ✅ Explicit return
      })
      .then((data) => {
        this.setState({ song: data });
        // console.log(data);
      });
  }
  toggleSettings(value) {
    this.setState({ showSettings: value });
  }
  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.toggleSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }
  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.toggleSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((response) => {
      this.setState({ redirect: "../", roomCode: null });
    });
  }

  render() {
    if (this.state.redirect || !this.state.roomCode) {
      return <Navigate to={this.state.redirect} />;
    }
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.state.roomCode}
          </Typography>
        </Grid>
        {/* {this.state.song} */}
        {/* <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid> */}
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}
