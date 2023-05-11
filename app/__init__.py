import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf

# Import the database and models
from .models import db, JHA, Step, Hazard

# Import the routes for each model
from .api.jha_routes import jha_routes
from .api.step_routes import step_routes
from .api.hazard_routes import hazard_routes
from .api.control_routes import control_routes

# Import the seed commands
from .seeds import seed_commands

# Import the configuration settings
from .config import Config

# Create a Flask app instance and set up static directory and URL path
app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')

# Add the seed commands to the app
app.cli.add_command(seed_commands)

# Load the configuration settings
app.config.from_object(Config)

# Register the routes for each model
app.register_blueprint(jha_routes, url_prefix="/api")
app.register_blueprint(step_routes, url_prefix="/api")
app.register_blueprint(hazard_routes, url_prefix="/api")
app.register_blueprint(control_routes, url_prefix="/api")

# Initialize the database and set up migrations
db.init_app(app)
Migrate(app, db)

# Set up CORS for the app
CORS(app)

# Redirect http requests to https in production environment
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)

# Add CSRF token to every response
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True)
    return response

# Route for returning all API routes and their doc strings
@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list

# Route for serving the index.html file in the React build
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

# Error handling for 404 page not found errors
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
