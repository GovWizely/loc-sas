from flask_cors import CORS

from app import app as application

# enable CORS
CORS(application, resources={r'/*': {'origins': '*'}})

if __name__ == "__main__":
    application.run(debug=True)
