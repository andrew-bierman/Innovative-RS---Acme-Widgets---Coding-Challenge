from app.models import db, environment, SCHEMA, JHA, Step, Hazard, Control, Training, PPE
from sqlalchemy.sql import text

def create_jha(title, author):
    jha = JHA(title=title, author=author)
    db.session.add(jha)
    db.session.commit()

    # Create sample Steps
    steps = [
        Step(description=f"Step 1 - {title}", jha_id=jha.id),
        Step(description=f"Step 2 - {title}", jha_id=jha.id),
        Step(description=f"Step 3 - {title}", jha_id=jha.id),
    ]
    db.session.add_all(steps)
    db.session.commit()

    # Create sample Hazards
    hazards = [
        Hazard(description="Fall from height", step_id=steps[0].id, consequence="Severe"),
        Hazard(description="Exposure to chemicals", step_id=steps[1].id, consequence="Serious"),
        Hazard(description="Electric shock", step_id=steps[2].id, consequence="Critical"),
    ]
    db.session.add_all(hazards)
    db.session.commit()

    # Create sample Controls
    controls = [
        Control(description="Use a harness and lanyard", step_id=steps[0].id),
        Control(description="Wear appropriate PPE", step_id=steps[1].id),
        Control(description="Use insulated tools", step_id=steps[2].id),
    ]
    db.session.add_all(controls)
    db.session.commit()

    # Create Sample PPE
    ppe = [
        PPE(description="Hard hat", jha_id=jha.id),
        PPE(description="Safety glasses", jha_id=jha.id),
        PPE(description="Rubber gloves", jha_id=jha.id),
    ]
    db.session.add_all(ppe)
    db.session.commit()

    # Create Sample Training
    training = [
        Training(description="Fall protection training", jha_id=jha.id),
        Training(description="Hazard communication training", jha_id=jha.id),
        Training(description="Electrical safety training", jha_id=jha.id),
    ]
    db.session.add_all(training)
    db.session.commit()


def seed_jhas():
    jha_data = [
        {"title": "Construction of a Wooden Deck", "author": "John Doe"},
        {"title": "Handling of Hazardous Chemicals", "author": "Jane Smith"},
        {"title": "Preparation and Serving of Food", "author": "Jim Brown"},
        {"title": "Maintenance of Industrial Equipment", "author": "Jack Wilson"},
    ]

    for jha_item in jha_data:
        create_jha(jha_item["title"], jha_item["author"])

    print("Seed data created.")

# Uses a raw SQL query to TRUNCATE or DELETE the table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_jhas():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.jhas RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM jhas"))
        
    db.session.commit()