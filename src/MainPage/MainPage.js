import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "./MainPage.css";
import "../Event/EventForm"
import EventForm from "../Event/EventForm";
import EventEdit from "../Event/EventEdit";

const Event = ({event, onDelete, onEdit, onFetchEvents}) => {
    const [showDetails, setShowDetails] = useState(false);
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [isJoined, setIsJoined] = useState(null);
    const token = localStorage.getItem('token');
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [creatorUsername, setCreatorUsername] = useState('');

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    useEffect(() => {
        const fetchCreatorUsername = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/user/${event.creator_id}`);
                setCreatorUsername(response.data.username);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCreatorUsername();
    }, [event.creator_id]);

    useEffect(() => {
        const fetchAttendeeCount = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/event/events/${event.id}/attendees`);
                if (response.status === 200) {
                    setAttendeeCount(response.data);
                }
            } catch (error) {
                console.error(error);
                alert('Failed to fetch attendee count');
            }
        };
        fetchAttendeeCount();
    }, [event.id]);

    useEffect(() => {
        const fetchJoinedEvents = async (props) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/event/user/joined-events`, {headers});
                if (response.status === 200) {
                    const joinedEvents = response.data;
                    setIsJoined(joinedEvents.includes(event.id));
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    props.onLogout();
                    window.location.href = '/login';
                } else {
                    alert('Failed to fetch joined events');
                }
            }
        };
        fetchJoinedEvents();
    }, [event.id]);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await axios.get('http://127.0.0.1:8000/user/me', {headers});
            if (response.status === 200) {
                setCurrentUser(response.data);
            }
        };
        fetchCurrentUser();
    }, []);


    const handleJoinUnjoin = async () => {
        const token = localStorage.getItem('token');

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const fetchAttendeeCount = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/event/events/${event.id}/attendees`, {headers});
                if (response.status === 200) {
                    setAttendeeCount(response.data);
                }
            } catch (error) {
                console.error(error);
                alert('Failed to fetch attendee count');

            }
        };

        if (isJoined) {
            try {
                const response = await axios.delete(`http://127.0.0.1:8000/event/leave-event/${event.id}`, {headers});
                if (response.status === 200 && response.data.detail === 'Successfully left the event') {
                    setIsJoined(false);
                    fetchAttendeeCount();
                }
            } catch (error) {
                console.error(error);
                alert('Failed to leave the event');
            }
        } else {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/event/join-event/${event.id}`, {}, {headers});
                if (response.status === 200 && response.data.detail === 'Successfully joined the event') {
                    setIsJoined(true);
                    fetchAttendeeCount();
                }
            } catch (error) {
                console.error(error);
                alert('Failed to join the event');
            }
        }
    };

    const handleDeleteClick = () => {
        onDelete(event.id);
    };


    return (
        <div className="event-card" key={event.id}>
            <img src={`../images/event.png`} alt={event.title} className="event-image"/>
            <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-time">{event.time}</p>
                <p className="event-location">{event.location}</p>
                {showDetails && (
                    <>
                        <p className="event-description">{event.description}</p>
                        <p className="event-participants">
                            {attendeeCount} people are going
                        </p>
                        <p className="event-creator">Created by {creatorUsername}</p>
                        {isJoined !== null && (
                            <button onClick={handleJoinUnjoin}>
                                {isJoined ? 'Leave' : 'Join'}
                            </button>
                        )}
                        {currentUser && currentUser.User.id === event.creator_id && (
                            showEditForm ? (
                                <EventEdit
                                    eventDetails={event}
                                    onSubmit={(eventDetails) => {
                                        onEdit(event.id, eventDetails).then(() => {
                                            onFetchEvents();  // Fetch events after the event is edited
                                            setShowEditForm(false);  // Hide the form after successful edit
                                        });
                                    }}
                                    onCancel={() => setShowEditForm(false)}
                                />
                            ) : (
                                <>
                                    <button onClick={() => setShowEditForm(true)}>
                                        Edit
                                    </button>
                                    <button onClick={handleDeleteClick}>Delete</button>
                                </>
                            )
                        )}
                    </>
                )}
                <button onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? 'Show Less' : 'More Details'}
                </button>
            </div>
        </div>
    );

}


const MainPage = (props) => {
    const [eventList, setEventList] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const fetchEvents = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/event/?skip=0&limit=100');
        if (response.status === 200) {
            const events = response.data;
            events.sort((a, b) => a.id - b.id);  // Sort events by id
            setEventList(events);
        }
    } catch (error) {
        console.error(error);
        alert('Failed to fetch events');
    }
};


    useEffect(() => {
        const fetchEvents = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/event/?skip=0&limit=100');
        if (response.status === 200) {
            const events = response.data;
            events.sort((a, b) => a.id - b.id);  // Sort events by id
            setEventList(events);
        }
    } catch (error) {
        console.error(error);
        alert('Failed to fetch events');
    }
};

        fetchEvents();
    }, []);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            const response = await axios.get('http://127.0.0.1:8000/user/me', {headers});
            if (response.status === 200) {
                setCurrentUser(response.data);
            }
        };
        fetchCurrentUser();
    }, []);

    const handleCreate = async (eventDetails) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/event/create', eventDetails, {headers});
            if (response.status === 201) {
                alert('Event created successfully');
                setShowCreateForm(false);
                fetchEvents();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create event');
        }
    };

    const handleEdit = async (id, eventDetails) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/event/${id}`, eventDetails, {headers});
            if (response.status === 200) {
                alert('Event updated successfully');
                fetchEvents();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update event');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/event/${id}`, {headers});
            if (response.status === 200 && response.data.detail === 'Event deleted') {
                alert('Event deleted successfully');
                fetchEvents();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete event');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        props.onLogout();
    };

    const renderEvents = () => {
        return eventList.map((event) => (
            <Event
                event={event}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onFetchEvents={fetchEvents}
            />
        ));
    };


    return (
        <div className="mainpage">
            <h1 className="mainpage-title">Welcome to Eventify</h1>
            <p className="mainpage-subtitle">
                The best place to find and manage your events
            </p>
            <button onClick={handleLogout} className={'event-button'}>Logout</button>
            {currentUser && currentUser.User.role === 'creator' && (
                <button onClick={() => setShowCreateForm(true)} className={'event-button'}>
                    Create a new Event
                </button>
            )}
            {showCreateForm && (
                <EventForm onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)}/>
            )}
            <div className="mainpage-events">{renderEvents()}</div>
        </div>
    );
};

export default MainPage;


