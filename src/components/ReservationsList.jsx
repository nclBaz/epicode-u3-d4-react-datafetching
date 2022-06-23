/*
We are still going to use a Class for this component because we need to access to the state, but also because today we will fetch some data:
fetching data for feeding a component MUST BE DONE in a specific moment of the life of the component --> LIFECYCLE
*/

import { Component } from "react"
import { ListGroup, Alert } from "react-bootstrap"
import { SpinnerDiamond } from "spinners-react"
import { parseISO, format } from "date-fns"

class ReservationsList extends Component {
  state = {
    reservations: [], // reservations will ALWAYS be an ARRAY --> The perfect initial state for that is EMPTY ARRAY
    isLoading: true,
    errMessage: "",
  }

  componentDidMount = () => {
    // <-- the name of this function is a reserved keyword
    console.log("I AM THE COMPONENT DID MOUNT EVENT!")
    this.fetchReservations()
  }

  fetchReservations = async () => {
    try {
      const url = "https://striveschool-api.herokuapp.com/api/reservation"

      const response = await fetch(url)

      if (response.ok) {
        // Server answered with a 200 :)
        const data = await response.json()
        this.setState({
          reservations: data,
          isLoading: false,
        })
      } else {
        const message = await response.text()
        this.setState({ ...this.state, isLoading: false, errMessage: message })
      }
    } catch (error) {
      console.log(error)
      this.setState({ ...this.state, isLoading: false, errMessage: "GENERIC ERROR HAPPENED!" })
    }
  }

  render() {
    console.log("I AM THE RENDER!")
    // Is a good idea to fetch reservations from here??
    // NO it's a terrible idea. Why?
    // Well, because this would cause an infinite loop of rerendering
    // render is happening as the first thing, render calls fetchReservations
    // Then fetchReservations causes a rerendering because it sets the state
    // render will be called again then, and also fetchReservations will be called again
    // and so on so far.......
    // this.fetchReservations()
    return (
      <div>
        <h2>Booked tables!</h2>
        <ListGroup>
          {/* let's create a connection between the state and the spinner */}
          {this.state.errMessage && <Alert variant="danger">{this.state.errMessage}</Alert>}
          {this.state.isLoading && (
            <SpinnerDiamond size={90} thickness={180} speed={88} color="rgba(57, 90, 172, 1)" secondaryColor="rgba(165, 57, 172, 0.44)" />
          )}
          {this.state.reservations.map((bookedTable, index) => (
            <ListGroup.Item key={index}>
              {bookedTable.name} for {bookedTable.numberOfPeople} at {format(parseISO(bookedTable.dateTime), "do MMMM yyyy | HH:mm")}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    )
  }
}

export default ReservationsList
