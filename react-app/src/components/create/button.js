import React, { useState } from 'react';
import BulmaModal from '../bulmaModal';
import { useDispatch } from 'react-redux';
import { createJHA } from '../../store/thunks';
import { CreateJHAForm } from '.';

export const CreateJHAButton = () => {
  // Set up state for form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [formErrors, setFormErrors] = useState({ title: '', author: '' });
  const [modalIsActive, setModalIsActive] = useState(false);

  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form
    let errors = { title: '', author: '' };
    if (title.trim() === '') {
      errors.title = 'Title is required';
    }
    if (author.trim() === '') {
      errors.author = 'Author is required';
    }
    if (errors.title || errors.author) {
      setFormErrors(errors);
      return;
    }

    const newJHA = {
      title,
      author,
    };

    dispatch(createJHA(newJHA));

    // reset form state
    setTitle('');
    setAuthor('');
    setFormErrors({});

    // close modal
    setModalIsActive(false);
  };

  return (
    <div className="level-right">
      <BulmaModal
        id="create-jha-modal"
        isActive={modalIsActive}
        trigger={'Create JHA'}
        onTrigger={setModalIsActive}
        title={'Create JHA'}
        buttonColor="is-primary"
        type={'create'}
        footerButtons={[
          {
            label: 'Create JHA',
            color: 'is-success',
            onClick: handleSubmit,
          },
        ]}
      >
        <CreateJHAForm
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          errors={formErrors}
        />
      </BulmaModal>
    </div>
  );
};
