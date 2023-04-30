import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJHAs } from "../../store/thunks";
import { JHACard } from "../card";
import { CreateJHAButton } from "../create/button";
import { selectAllJHAs } from "../../store/jhaSlice";
import { Loading } from "../loading";

const JHAList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchJHAs());
    }, [dispatch]);

    const jhas = useSelector(selectAllJHAs);
    const status = useSelector((state) => state.jhas.status);

    // if (status === "loading") {
    //     return (
    //         <div style={{height: "100vh", width: "100vw", position: "absolute"}}>
    //         <div className="columns is-centered">
    //             <div
    //                 className="column is-flex is-justify-content-center is-align-items-center is-vcentered"
    //             >
    //                 <Loading />
    //             </div>
    //         </div>
    //         </div>
    //     );
    // }

    return (
        <div className="section is-flex-grow-1">
            <div className="level">
                <div className="level-left">
                    <h1 className="title">Job Hazard Analysis (JHA) List</h1>
                </div>
                <CreateJHAButton />
            </div>
            <div className="columns is-multiline">
                {/* Iterate over the jhas array and render the JHACard component */}
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
