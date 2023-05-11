from .db import db, environment, SCHEMA, add_prefix_for_prod

# Define a model for the jhas table
class JHA(db.Model):

    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = 'jhas'

    # Tell SQLAlchemy what the table schema is (if we aren't using the default 'public' schema)
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Create the columns for the jhas table
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)

    # Create a relationship with the steps table
    steps = db.relationship("Step", backref="jha", lazy=True, cascade="all, delete-orphan")

    # Create a relationship with the trainings table
    trainings = db.relationship("Training", back_populates="jha", lazy=True, cascade="all, delete-orphan")

    # Create a relationship with the ppes table
    ppes = db.relationship("PPE", back_populates="jha", lazy=True, cascade="all, delete-orphan")

    # Define how data will be displayed when it is converted to a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "steps": [step.to_dict() for step in self.steps],
            "trainings": [training.to_dict() for training in self.trainings],
            "ppes": [ppe.to_dict() for ppe in self.ppes]
        }
