import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { JHADetailsHeader } from './header';
import { StepDetails } from './stepDetails';
import { AdditionalDetails } from './additionalDetails';
import { EditForm } from '../edit/EditForm';
import { selectJHAById } from '../../store/jhaSlice';

const JHADetails = ({ jhaId }) => {
    const dispatch = useDispatch();

    const jha = useSelector((state) => selectJHAById(state, jhaId));

    return (
        <>
            <div className="box">
                <div className="content">
                    {(jha) && (
                        <>
                            <div className="">
                                <JHADetailsHeader jha={jha} style={{ marginBottom: "2rem" }} />
                                <p></p>
                            </div>
                            <div>
                                {jha.steps.length > 0 ? (
                                    jha.steps.map((step, index) => (
                                        <div key={step.id} className={`step-details mb-4 mt-4 ${index < jha.steps.length - 1 ? 'pb-4' : ''} ${index < jha.steps.length - 1 ? 'border-bottom' : ''}`}>
                                            <StepDetails step={step} index={index + 1} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="notification is-warning">
                                        <p className="has-text-centered">No steps have been added to this JHA.</p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <p></p>
                                <AdditionalDetails jha={jha} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default JHADetails;
