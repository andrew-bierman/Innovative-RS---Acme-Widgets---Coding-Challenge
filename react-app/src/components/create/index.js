import React from 'react';

export const CreateJHAForm = ({ title, setTitle, author, setAuthor, errors }) => {
  return (
    <div className='form'>
      <div className={`field ${errors.title ? 'has-error' : ''}`}>
        <label className="label" htmlFor="title">
          Title
        </label>
        <div className="control has-icons-left">
          <input
            className="input"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
          <span className="icon is-small is-left">
            <i className="fas fa-heading"></i>
          </span>
        </div>
        {errors.title && <p className="help is-danger">{errors.title}</p>}
      </div>

      <div className={`field ${errors.author ? 'has-error' : ''}`}>
        <label className="label" htmlFor="author">
          Author
        </label>
        <div className="control has-icons-left">
          <input
            className="input"
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author"
            required
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>
        </div>
        {errors.author && <p className="help is-danger">{errors.author}</p>}
      </div>
    </div>
  );
};
