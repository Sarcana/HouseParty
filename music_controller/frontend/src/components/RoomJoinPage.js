import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Link, Navigate } from "react-router-dom";

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      error: "",
      redirect: null,
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  handleTextFieldChange(e){
    this.setState({
      roomCode: e.target.value
    });
  }
  roomButtonPressed(){
    //console.log(this.state.roomCode);
    //Sending a post request
    const requestOptions={
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        code: this.state.roomCode
      }),
    };
    // fetch("/api/join-room",requestOptions)
    // .then((response) => {
    //   if(response.ok){
    //     this.setState({redirect:"/room/"+data.code})
    //   }
    //   else {
    //     this.setState({ error: "Room not found." })
    // }});
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Room not found");
        }
      })
      .then((data) => {
        this.setState({ redirect: "/room/" + this.state.roomCode });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  

  }
  render() {
    // Add alignItems center to avoid writing align= center for every tag inside the parent tage
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />; // Use Navigate for redirection
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Join a Room
          </Typography>
          </Grid>
          <Grid item xs={12} align ="center">
            <TextField
              error={this.state.error}
              label="Code"
              placeholder="Enter Room Code"
              value={this.state.roomCode}
              helperText={this.state.error}
              variant="outlined"
              onChange={this.handleTextFieldChange}
            />
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={this.roomButtonPressed}
            >
              Enter Room
            </Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              to="/"
              component={Link}
            >
              Back
            </Button>
          </Grid>
        </Grid>
    );
  }
}
