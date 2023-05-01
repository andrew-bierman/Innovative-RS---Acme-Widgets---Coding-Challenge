# Innovative-RS - Acme-Widgets - Coding-Challenge

This is a full-stack web application for creating and managing Job Hazard Analysis (JHA) documents. It enables users to create, read, update, and delete JHAs and their associated steps. It also allows users to create, read, update, and delete hazards and controls.

## Technologies Used
Backend:
- Python
- Flask
- SQLAlchemy 
- Alembic
- Postgres

Frontend:
- React
- Redux
- Bulma CSS Framework

## Dependencies for Local Development
- Python3
- Pipenv
- Node.js
- NPM

## Getting started
1. Clone this repository

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

## Deployed Site
For your convenience, the site is deployed on Render at [Acme-Widgets](https://acmewidgets.onrender.com/)