from flask import Flask
from config import Config
from database import db
from routes import api  # Import Blueprint AFTER db is initialized

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)  # Initialize database with Flask app
    app.register_blueprint(api, url_prefix='/api')

    return app

def init_db(app):
    """ Initialize the database within the app context. """
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    app = create_app()
    print("Database trying")
    init_db(app)  # Create tables only when running directly
    print("✅ Database initialized successfully!")
    app.run(debug=True)
