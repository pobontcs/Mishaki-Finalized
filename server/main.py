from fastapi import FastAPI

app = FastAPI(title="Mishaki E-Commerce API")

@app.get("/")
def read_root():
    return {"message": "Server is running!"}