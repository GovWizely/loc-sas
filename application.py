from app import app as application
from flask_cors import CORS

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

if __name__ == "__main__":
    application.run(debug=True)
