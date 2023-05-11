from .db import db, environment, SCHEMA, add_prefix_for_prod

# Define a model for the steps table
class Step(db.Model):

    # Tell SQLAlchemy what the table name is and if there's any table-specific arguments it should know about
    __tablename__ = 'steps'

    # Tell SQLAlchemy what the table schema is (if we aren't using the default 'public' schema)
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    # Create the columns for the steps table
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)

    # Create a foreign key to the jhas table
    jha_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("jhas.id"), ondelete="CASCADE"), nullable=False)

    # Create a relationship with the hazards table
    hazards = db.relationship("Hazard", backref="hazards_step", lazy=True, cascade="all, delete-orphan")

    # Create a relationship with the controls table
    controls = db.relationship("Control", backref="controls_step", lazy=True, cascade="all, delete-orphan")

    # Define how data will be displayed when it is converted to a dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "jha_id": self.jha_id,
            "hazards": [hazard.to_dict() for hazard in self.hazards],
            "controls": [control.to_dict() for control in self.controls]
        }
