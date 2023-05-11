import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateJHA } from "../../store/thunks";


const TitleAndAuthor = ({ title, author, jhaId, activeAccordion, onAccordionChange }) => {
    const dispatch = useDispatch();

    // Creating state variables for the new title and author values
    const [newTitle, setNewTitle] = useState(title || "");
    const [newAuthor, setNewAuthor] = useState(author || "");

    // Handling changes to the title and author input fields
    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };
    const handleAuthorChange = (e) => {
        setNewAuthor(e.target.value);
    };

    // Toggling the accordion when the header is clicked
    const handleAccordionToggle = (e) => {
        e.preventDefault();
        onAccordionChange(activeAccordion === "title-and-author" ? "" : "title-and-author");
    };

    // Dispatching the updateJHA action when the Save button is clicked
    const handleSave = (e) => {
        e.preventDefault();
        dispatch(updateJHA({ id: jhaId, title: newTitle, author: newAuthor }));
    };

    return (
        <div className={`card ${activeAccordion === "title-and-author" ? "is-active" : ""}`}>
            <header className="card-header">
                <p className="card-header-title">Title and Author</p>
                <button className="card-header-icon" onClick={handleAccordionToggle}>
                    <span className="icon">
                        <i className={`fas fa-chevron-down ${activeAccordion === "title-and-author" ? "is-active" : ""}`}></i>
                    </span>
                </button>
            </header>
            {activeAccordion === "title-and-author" && (
                <div className="card-content">
                    <>
                        <div className="field">
                            <label className="label">Title</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="title"
                                    value={newTitle}
                                    onChange={handleTitleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Author</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="author"
                                    value={newAuthor}
                                    onChange={handleAuthorChange}
                                />
                            </div>
                        </div>
                        <button type='button' className="button is-primary" onClick={handleSave}>
                            Save
                        </button>
                    </>
                </div>
            )}
        </div>
    );
};

export default TitleAndAuthor;

