import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Collapse, Alert } from "@mui/material";
import { Link, Navigate } from "react-router-dom";

export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    //roomCode: '9F8BH7',
    // hard code check was not updating room code
    updateCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      errorMsg: "",
      successMsg: "",
      roomCode: null,
      //roomCode: this.props.roomCode || null, // Set roomCode from props if updating
      redirect: null, // Add a state variable for redirection
    };
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
  }

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }

  handleRoomButtonPressed(e) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ 
        roomCode: data.code,
        redirect: "/room/" + data.code });
      });
    // Set the redirect state
  }

  async handleUpdateButtonPressed() {
    try {
      // Fetch the room code first
      const response = await fetch("/api/user-in-room");
      const data = await response.json();
      this.setState({
        roomCode: data.code,
      });
  
      // Wait for the state to update
      await new Promise(resolve => this.setState({ roomCode: data.code }, resolve));
  
      // Now, use the updated room code for the update request
      const requestOptions = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          votes_to_skip: this.state.votesToSkip,
          guest_can_pause: this.state.guestCanPause,
          code: this.state.roomCode,
        }),
      };
  
      console.log("Room code before update:", this.state.roomCode);
  
      const updateResponse = await fetch("/api/update-room", requestOptions);
      if (updateResponse.ok) {
        this.setState({
          successMsg: "Room updated successfully!",
        });
      } else {
        this.setState({
          errorMsg: "Error updating room...",
        });
      }
      this.props.updateCallback();
    } catch (error) {
      console.error("Error updating room:", error);
      this.setState({
        errorMsg: "An unexpected error occurred.",
      });
    }
  }
  
  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />; // Use Navigate for redirection
    }

    const title = this.props.update ? "Update Room" : "Create a Room";

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handleVotesChange}
              defaultValue={this.state.votesToSkip}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()}
      </Grid>
    );
  }
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import FormHelperText from "@mui/material/FormHelperText";
// import FormControl from "@mui/material/FormControl";
// import Radio from "@mui/material/Radio";
// import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import { Link } from "react-router-dom";

// const CreateRoomPage = () => {
//   const defaultVotes = 2;
//   const [guestCanPause, setGuestCanPause] = useState(true);
//   const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
//   const navigate = useNavigate();

//   const handleVotesChange = (e) => {
//     setVotesToSkip(e.target.value);
//   };

//   const handleGuestCanPauseChange = (e) => {
//     setGuestCanPause(e.target.value === "true");
//   };

//   const handleRoomButtonPressed = () => {
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         votes_to_skip: votesToSkip,
//         guest_can_pause: guestCanPause,
//       }),
//     };
//     fetch("/api/create-room", requestOptions)
//       .then((response) => response.json())
//       .then((data) => navigate("/room/" + data.code));
//   };

//   return (
//     <Grid container spacing={1}>
//       <Grid item xs={12} align="center">
//         <Typography component="h4" variant="h4">
//           Create A Room
//         </Typography>
//       </Grid>
//       <Grid item xs={12} align="center">
//         <FormControl component="fieldset">
//           <FormHelperText>
//             <div align="center">Guest Control of Playback State</div>
//           </FormHelperText>
//           <RadioGroup
//             row
//             defaultValue="true"
//             onChange={handleGuestCanPauseChange}
//           >
//             <FormControlLabel
//               value="true"
//               control={<Radio color="primary" />}
//               label="Play/Pause"
//               labelPlacement="bottom"
//             />
//             <FormControlLabel
//               value="false"
//               control={<Radio color="secondary" />}
//               label="No Control"
//               labelPlacement="bottom"
//             />
//           </RadioGroup>
//         </FormControl>
//       </Grid>
//       <Grid item xs={12} align="center">
//         <FormControl>
//           <TextField
//             required={true}
//             type="number"
//             onChange={handleVotesChange}
//             defaultValue={defaultVotes}
//             inputProps={{
//               min: 1,
//               style: { textAlign: "center" },
//             }}
//           />
//           <FormHelperText>
//             <div align="center">Votes Required To Skip Song</div>
//           </FormHelperText>
//         </FormControl>
//       </Grid>
//       <Grid item xs={12} align="center">
//         <Button
//           color="primary"
//           variant="contained"
//           onClick={handleRoomButtonPressed}
//         >
//           Create A Room
//         </Button>
//       </Grid>
//       <Grid item xs={12} align="center">
//         <Button color="secondary" variant="contained" to="/" component={Link}>
//           Back
//         </Button>
//       </Grid>
//     </Grid>
//   );
// };

// export default CreateRoomPage;
