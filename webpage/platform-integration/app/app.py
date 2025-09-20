
from fastapi import FastAPI

from app.api import authorizations, credits, licenses, reviews, sessions, tasks

app = FastAPI()
app.include_router(credits.router)
app.include_router(authorizations.router)
app.include_router(licenses.router)
app.include_router(tasks.router)
app.include_router(reviews.router)
app.include_router(sessions.router)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
