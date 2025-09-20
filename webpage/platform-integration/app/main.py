
from fastapi import FastAPI

from .api import authorizations, credits, licenses, reviews, sessions, tasks
from .api import task_stream_ws

app = FastAPI()
app.include_router(credits.router)
app.include_router(authorizations.router)
app.include_router(licenses.router)
app.include_router(tasks.router)
app.include_router(task_stream_ws.router)
app.include_router(reviews.router)
app.include_router(sessions.router)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
