import React, {useState} from "react";

const EventForm = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

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
            <button type="submit">Create</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};
export default EventForm;