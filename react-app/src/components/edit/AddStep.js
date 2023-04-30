import React, { useState } from "react";

export const AddStep = ({ jhaId, onAddStep }) => {
    const [description, setDescription] = useState("");

    const handleClick = (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (!description) return;

        onAddStep(description);
    };

    return (
        <div className="form">
            <h4 className="title is-4 has-text-centered" style={{marginTop: '2rem'}}>
                Add Step
            </h4>
            <div className="field is-horizontal">
                <div className="field-label is-normal">
                    <label className="field-label">Description</label>
                </div>
                <input
                    className="input"
                    type="text"
                    placeholder="Enter step description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="field is-grouped is-grouped-centered">
                <div className="control">
                    <button className="button is-primary" onClick={handleClick}>
                        Add Step
                    </button>
                </div>
            </div>
        </div>
    );

}