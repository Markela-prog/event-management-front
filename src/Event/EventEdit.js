
import React, {useState} from "react";

const EventEdit = ({ onSubmit, onCancel, eventDetails }) => {
    const [title, setTitle] = useState(eventDetails ? eventDetails.title : '');
    const [description, setDescription] = useState(eventDetails ? eventDetails.description : '');
    const [date, setDate] = useState(eventDetails ? eventDetails.date : '');
    const [location, setLocation] = useState(eventDetails ? eventDetails.location : '');


    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ title, description, date, location });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </label>
            <label>
                Date:
                <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label>
                Location:
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};
export default EventEdit;

