import { Component } from "react";
import React from "react";
import { Grid, Button, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";


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
    };

    this.getRoomDetails();
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.toggleSettings=this.toggleSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
  
  }
  getRoomDetails() {
    fetch("/api/get-room" + "?code=" + this.state.roomCode)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
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
    this.state.roomCode = null;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((response) =>
      this.setState({ redirect: "../" })
    );
  }

  render() {
    if (this.state.redirect) {
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
        <Grid item xs={12} align="center">
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
        </Grid>
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
// import { Component } from "react";
// import React from "react";
// import { Grid, Button, Typography } from "@mui/material";
// import { Navigate } from "react-router-dom";
// import CreateRoomPage from "./CreateRoomPage";

// export default class Room extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       votesToSkip: 2,
//       guestCanPause: true,
//       isHost: false,
//       redirect: null,
//       roomCode: this.props.roomCode, // Use this.props.roomCode here
//       showSettings: false,
//     };

//     this.getRoomDetails = this.getRoomDetails.bind(this);
//     this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
//     this.toggleSettings = this.toggleSettings.bind(this);
//   }

//   componentDidMount() {
//     console.log("Component mounted, calling getRoomDetails");
//     this.getRoomDetails();
//   }

//   getRoomDetails() {
//     console.log("Entering getRoomDetails function");
//     console.log("Fetching details for room code:", this.state.roomCode);
    
//     return fetch("/api/get-room?code=" + this.state.roomCode)
//       .then((response) => {
//         console.log("Response received:", response);
//         if (response.ok) {
//           return response.json();
//         } else {
//           console.error("Failed to fetch room details, status:", response.status);
//           this.setState({ redirect: "../" });
//           return null; // Ensure the chain continues even if the response is not ok
//         }
//       })
//       .then((data) => {
//         if (data) {
//           console.log("Parsed JSON data:", data);
//           if (data.votes_to_skip !== undefined) {
//             this.setState({
//               votesToSkip: data.votes_to_skip,
//               guestCanPause: data.guest_can_pause,
//               isHost: data.is_host,
//             });
//           } else {
//             console.error("Data Error: votes_to_skip is undefined");
//           }
//         } else {
//           console.error("Data is null or undefined");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching room details:", error);
//       });
//   }

//   toggleSettings(value) {
//     this.setState({ showSettings: value });
//   }

//   renderSettingsButton() {
//     return (
//       <Grid item xs={12} align="center">
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => this.toggleSettings(true)}
//         >
//           Settings
//         </Button>
//       </Grid>
//     );
//   }

//   leaveButtonPressed() {
//     this.state.roomCode = null;
//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     };
//     fetch("/api/leave-room", requestOptions).then((response) =>
//       this.setState({ redirect: "../" })
//     );
//   }

//   render() {
//     if (this.state.redirect) {
//       return <Navigate to={this.state.redirect} />;
//     }
//     if (this.state.showSettings) {
//       return this.renderSettings();
//     }
//     return (
//       <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//           <Typography variant="h4" component="h4">
//             Code: {this.state.roomCode}
//             console.log("Error tf");
//           </Typography>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Typography variant="h6" component="h6">
//             Votes: {this.state.votesToSkip}
//           </Typography>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Typography variant="h6" component="h6">
//             Guest Can Pause: {this.state.guestCanPause.toString()}
//           </Typography>
//         </Grid>
//         <Grid item xs={12} align="center">
//           <Typography variant="h6" component="h6">
//             Host: {this.state.isHost.toString()}
//           </Typography>
//         </Grid>
//         {this.state.isHost ? this.renderSettingsButton() : null}
//         <Grid item xs={12} align="center">
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={this.leaveButtonPressed}
//           >
//             Leave Room
//           </Button>
//         </Grid>
//       </Grid>
//     );
//   }
// }
// getRoomDetails() {
  //   console.log("Getting room details");
  //   return fetch("/api/get-room?code=" + this.state.roomCode)
  //     .then((response) => {
  //       console.log("Response received:", response);
  //       if (response.ok) {
  //         return response.json();
  //       } else {
  //         console.error("Failed to fetch room details, status:", response.status);
  //         this.setState({ redirect: "../" });
  //         return null; // Ensure the chain continues even if the response is not ok
  //       }
  //     })
  //     .then((data) => {
  //       console.log("Parsed JSON data:", data);
  //       if (data && data.votes_to_skip !== undefined) {
  //         this.setState({
  //           votesToSkip: data.votes_to_skip,
  //           guestCanPause: data.guest_can_pause,
  //           isHost: data.is_host,
  //         });
  //       } else {
  //         console.error("Data Error: votes_to_skip is undefined");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching room details:", error);
  //       // Handle errors if needed
  //     });
  // }
  
  //COmments part 2
  //  getRoomDetails() {
  //   console.log("Getting room details");
  //   return fetch("/api/get-room" + "?code=" + this.state.roomCode)
  //     //Important to check if the response is okay otherwise dont render
  //     .then((response) => {
  //       if (response.ok) console.log(this.state.roomCode) ;return response.json();
  //        if(data.votes_to_skip === undefined) {console.log("Data Error");return}
  //       else {
  //         this.setState({ redirect: "../" });
  //       }
  //     })
  //     .then((data) => {
  //       this.setState({
  //         votesToSkip: data.votes_to_skip,
  //         guestCanPause: data.guest_can_pause,
  //         isHost: data.is_host,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching room details:", error);
  //       // Handle errors if needed
  //     });
  // }