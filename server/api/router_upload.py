import shutil
from typing import Annotated, List, Optional
import duckdb
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Query
from pathlib import Path


router = APIRouter()
images_file_path = "static/images.json"


def init_db(conn: duckdb.DuckDBPyConnection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS images (
            filename TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            message TEXT
        )
        """
    )


@router.post("/uploadfile/")
async def create_upload_file(
    files: Optional[List[UploadFile]] = File(None), message: Optional[str] = Form(None)
):
    upload_dir = Path("static/images")
    upload_dir.mkdir(parents=True, exist_ok=True)
    Path("data").mkdir(parents=True, exist_ok=True)
    conn = duckdb.connect("data/database.db")
    init_db(conn)

    if files:
        for file in files:
            try:
                file_path = upload_dir / file.filename

                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)

                conn.execute("INSERT INTO images (filename) VALUES (?)", [file.filename])
                conn.commit()

            except Exception as e:
                print(e)
                raise HTTPException(
                    status_code=500,
                    detail=f"There was an error uploading the file: {e}",
                )
            finally:
                await file.close()

    if message:
        try:
            conn.execute("INSERT INTO messages (message) VALUES (?)", [message])
            conn.commit()
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=500,
                detail=f"There was an error messageing the file: {e}",
            )
    conn.close()

    if files:
        return {"filenames": [f.filename for f in files], "count": len(files)}
    if message:
        return {"message": message}
    return {"message": "No files or message provided"}


@router.get("/images/")
async def get_images(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=5, le=100)] = 5,
):
    conn = duckdb.connect("data/database.db")
    init_db(conn)
    total_images = conn.execute("SELECT COUNT(*) FROM images").fetchone()[0]
    images = conn.execute(
        "SELECT filename FROM images LIMIT ? OFFSET ?", [limit, (page - 1) * limit]
    ).fetchall()
    conn.close()

    return {"images": images, "total_images": total_images}


@router.get("/blog/")
async def get_images(
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=5, le=100)] = 5,
):
    conn = duckdb.connect("data/database.db")
    init_db(conn)
    total_messages = conn.execute("SELECT COUNT(*) FROM messages").fetchone()[0]
    messages = conn.execute(
        "SELECT message FROM messages LIMIT ? OFFSET ?",
        [limit, (page - 1) * limit],
    ).fetchall()
    conn.close()
    message_strings = [row[0] for row in messages]
    return {"messages": message_strings, "total_messages": total_messages}
