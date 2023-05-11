import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJHAs } from "../../store/thunks";
import { JHACard } from "../card";
import { CreateJHAButton } from "../create/button";
import { selectAllJHAs } from "../../store/jhaSlice";

// This component displays the list of all Job Hazard Analysis records
const JHAList = () => {
    const dispatch = useDispatch();

    // Fetch all JHAs from the API when the component mounts
    useEffect(() => {
        dispatch(fetchJHAs());
    }, [dispatch]);

    // Get all JHAs from the Redux store
    const jhas = useSelector(selectAllJHAs);

    // Get the status of the JHAs slice from the Redux store
    const status = useSelector((state) => state.jhas.status);

    // Render the JHAList component
    return (
        <div className="section is-flex-grow-1">
            {/* Render the JHAList header and the CreateJHAButton */}
            <div className="level">
                <div className="level-left">
                    <h1 className="title">Job Hazard Analysis (JHA) List</h1>
                </div>
                <CreateJHAButton />
            </div>
            {/* Render the JHACard component for each JHA */}
            <div className="columns is-multiline">
                {jhas.map((jha) => (
                    <div key={jha.id} className="column is-one-third">
                        <JHACard jha={jha} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export { JHAList };
