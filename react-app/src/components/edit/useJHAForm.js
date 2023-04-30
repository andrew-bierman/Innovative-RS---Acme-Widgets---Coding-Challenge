// hooks/useJHAForm.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateJHA, updateStep, updateHazard } from '../../store/thunks';
import { selectJHAById } from '../../store/jhaSlice';

export const useJHAForm = (jha) => {
    const dispatch = useDispatch();

    const jhaData = useSelector((state) => selectJHAById(state, jha.id));
    const { title, author, steps } = jhaData;

    const [dirtyFields, setDirtyFields] = useState(new Set());

    const updateTitle = (value) => {
        dispatch(updateJHA({ id: jha.id, title: value, author }));
        setDirtyFields((prev) => new Set([...prev, 'title']));
    };

    const updateAuthor = (value) => {
        dispatch(updateJHA({ id: jha.id, title, author: value }));
        setDirtyFields((prev) => new Set([...prev, 'author']));
    };

    const updateStep = (stepIndex, updatedStep) => {
        if (!updatedStep) {
          console.error('Cannot update step, invalid step data');
          return;
        }
        dispatch(updateStep({ jhaId: jha.id, stepId: updatedStep.id, ...updatedStep }));
        setDirtyFields((prev) => new Set(prev).add(`steps.${stepIndex}`));
      };
      

    const updateHazard = (stepIndex, hazardIndex, updatedHazard) => {
        const updatedStep = steps[stepIndex];
        const updatedHazards = updatedStep.hazards.map((hazard, index) =>
            index === hazardIndex ? { ...hazard, ...updatedHazard, dirty: true } : hazard
        );
        dispatch(updateStep({ jhaId: jha.id, stepId: updatedStep.id, hazards: updatedHazards }));
        setDirtyFields((prev) => new Set(prev).add(`steps.${stepIndex}.hazards.${hazardIndex}`));
    };

    return {
        title,
        author,
        steps,
        dirtyFields,
        updateTitle,
        updateAuthor,
        updateStep,
        updateHazard,
    };
};
