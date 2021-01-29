import { useState } from 'react'
import './App.css'

let idx = 1;
function App() {
  const slot = [
    "10:00AM", "10:30AM", "11:00AM", "11:30AM", "12:00PM", "12:30PM", "01:00PM", "01:30PM", "02:00PM", "02:30PM", "03:00PM", "03:30PM",
    "04:00PM", "04:30PM", "05:00PM", "05:30PM", "06:00PM", "06:30PM", "07:00PM"
  ];

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [optionValue, setOptionValue] = useState("")

  const handleOptionValue = e => {
    setOptionValue(e.target.value)
  }

  const handleNameChange = e => {
    setSummary(e.target.value);
  }

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  }

  const handleTimeChange = time => {
    setSlotTime(time)
  }

  const handleDateChange = e => {
    setSlotDate(e.target.value)
  }



  var gapi = window.gapi
  var CLIENT_ID = "242607976060-mubk17b6d1l4jl0lb8d565o4nd30cck4.apps.googleusercontent.com"
  var API_KEY = "AIzaSyB-1XnkZK7Mf_LgxvC9019eFrYskbJV4fI"
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!optionValue || !summary || !description) {
      alert("Please fill all filelds")
      return
    } 
    if(!slotDate || !slotTime) {
      alert("Please select Date/Time slot")
      return
    }

    const s = `${slotDate} ${slotTime.slice(0,5)}`
    const utc = new Date(s).toUTCString()
    const newDateString = new Date(utc).toISOString();
    console.log(newDateString)
    console.log(s)
    console.log(optionValue, summary, description, slotTime, slotDate)
    gapi.load('client:auth2', () => {
      console.log('loaded client')
      
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        var event = {
          'summary': `${summary} , ${optionValue}`,
          'location': 'google meet',
          'description': `${description}`,
          'start': {
            'dateTime': `${newDateString}`,
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': `${newDateString}`,
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'attendees': [
            {'email': 'googleuser1@example.com'},
            {'email': 'googleuser2@example.com'}
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        };
        
        

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          //window.open(event.htmlLink)
        })
        alert("Meeting Room Booking Successful");
        window.location.reload();
      })
    })
  }


  return (
    <div className="App">
      <div className="nav">
        <button>Signout</button>
        <h1>Meeting Room Booking</h1>
        <div className="meet-container">
          <div className="meet-form">
            <form onSubmit={handleSubmit}>
              <select id="opt" onChange={handleOptionValue}>
                <option value=""></option>
                <option value="Training-Room">Training Room</option>
              </select>
               <br />
              <input type="text" placeholder="Enter Your Name" value={summary} onChange={handleNameChange}/><br />
              <input type="text" placeholder="Enter meeting description" value={description} onChange={handleDescriptionChange}/><br />
              <input type="date" onChange={handleDateChange}/><br />
              <h1 id="slot">Please select your preffered solt</h1>
              {
                slot.map((time) => (
                  <div key={idx++} className="slots">
                    <button className="slot-button" onClick={() => handleTimeChange(time)}>{time}</button>
                  </div>
                ))
              }            
              <button type="submit" className="app-btn" onClick={handleSubmit}>BOOK APPOINTMENT</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;