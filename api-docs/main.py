"""
FastAPI application for Bible API documentation.
Serves interactive API documentation at the root path.
"""
from fastapi import FastAPI, Request, Path
from fastapi.responses import HTMLResponse, JSONResponse
from typing import Any, Dict, List, Optional
import json
import os
from pathlib import Path as FilePath

# When this app is mounted behind a reverse proxy under a sub-path (e.g. /bible-api),
# set ROOT_PATH so Swagger/ReDoc/OpenAPI links are generated correctly.
ROOT_PATH = os.environ.get("ROOT_PATH", "").strip()
if ROOT_PATH and not ROOT_PATH.startswith("/"):
    ROOT_PATH = f"/{ROOT_PATH}"
if ROOT_PATH == "/":
    ROOT_PATH = ""

app = FastAPI(
    title="Bible API",
    description="Free Use Bible API - Access Bible translations, commentaries, and datasets via JSON endpoints. All endpoints return JSON data served as static files.",
    version="1.8.0",
    docs_url="/docs",
    redoc_url="/redoc",
    root_path=ROOT_PATH,
    servers=[
        {"url": ROOT_PATH or "/", "description": "Current server"},
    ],
    swagger_ui_parameters={
        "persistAuthorization": True,
    },
)

# Get the API directory path (mounted from docker-compose)
API_DIR = FilePath("/app/api")
CONFIG_PATH = API_DIR / "api" / "config.json"

def load_config():
    """Load API configuration from config.json"""
    try:
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH, 'r') as f:
                return json.load(f)
    except Exception:
        pass
    return {
        "version": "1.0.0",
        "apiBase": "/api",
        "endpoints": {
            "translations": "/api/available-translations.json",
            "commentaries": "/api/available-commentaries.json",
            "datasets": "/api/available-datasets.json"
        }
    }

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Serve the main API documentation page"""
    config = load_config()
    
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bible API Documentation</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }}
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }}
        .header p {{
            font-size: 1.2em;
            opacity: 0.9;
        }}
        .content {{
            padding: 40px;
        }}
        .section {{
            margin-bottom: 40px;
        }}
        .section h2 {{
            color: #667eea;
            font-size: 1.8em;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }}
        .section h3 {{
            color: #555;
            font-size: 1.3em;
            margin-top: 25px;
            margin-bottom: 15px;
        }}
        .endpoint {{
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 15px 0;
            border-radius: 4px;
        }}
        .endpoint code {{
            background: #e9ecef;
            padding: 2px 8px;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            color: #d63384;
            font-size: 0.95em;
        }}
        .method {{
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.85em;
            margin-right: 10px;
        }}
        .links {{
            display: flex;
            gap: 15px;
            margin-top: 30px;
            flex-wrap: wrap;
        }}
        .link-button {{
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }}
        .link-button:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }}
        .link-button.secondary {{
            background: #6c757d;
        }}
        .link-button.secondary:hover {{
            box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
        }}
        .example {{
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 20px;
            margin: 15px 0;
            overflow-x: auto;
        }}
        .example pre {{
            margin: 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
        }}
        .badge {{
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            margin-left: 10px;
        }}
        ul {{
            margin-left: 20px;
            margin-top: 10px;
        }}
        li {{
            margin: 8px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📖 Bible API</h1>
            <p>Free Use Bible API Documentation</p>
            <span class="badge">v{config.get('version', '1.8.0')}</span>
        </div>
        <div class="content">
            <div class="section">
                <h2>Welcome</h2>
                <p>The Bible API provides access to Bible translations, commentaries, and datasets via simple JSON endpoints. All data is served as static JSON files, making it fast and easy to integrate into any application.</p>
            </div>

            <div class="section">
                <h2>Quick Start</h2>
                <p>All API endpoints are available under the <code>/api</code> path. Here are some examples:</p>
                
                <div class="endpoint">
                    <span class="method">GET</span>
                    <code>{config['endpoints']['translations']}</code>
                    <p style="margin-top: 10px; color: #666;">Get a list of all available Bible translations</p>
                </div>

                <div class="endpoint">
                    <span class="method">GET</span>
                    <code>/api/{{translation}}/books.json</code>
                    <p style="margin-top: 10px; color: #666;">Get a list of books for a specific translation (e.g., <code>/api/BSB/books.json</code>)</p>
                </div>

                <div class="endpoint">
                    <span class="method">GET</span>
                    <code>/api/{{translation}}/{{book}}/{{chapter}}.json</code>
                    <p style="margin-top: 10px; color: #666;">Get a specific chapter (e.g., <code>/api/BSB/GEN/1.json</code>)</p>
                </div>
            </div>

            <div class="section">
                <h2>API Endpoints</h2>
                
                <h3>Translations</h3>
                <ul>
                    <li><code>{config['endpoints']['translations']}</code> - List all available translations</li>
                    <li><code>/api/{{translation}}/books.json</code> - List books in a translation</li>
                    <li><code>/api/{{translation}}/{{book}}/{{chapter}}.json</code> - Get a chapter</li>
                </ul>

                <h3>Commentaries</h3>
                <ul>
                    <li><code>{config['endpoints']['commentaries']}</code> - List all available commentaries</li>
                    <li><code>/api/c/{{commentary}}/books.json</code> - List books in a commentary</li>
                    <li><code>/api/c/{{commentary}}/{{book}}/{{chapter}}.json</code> - Get a commentary chapter</li>
                </ul>

                <h3>Datasets</h3>
                <ul>
                    <li><code>{config['endpoints']['datasets']}</code> - List all available datasets</li>
                    <li><code>/api/d/{{dataset}}/books.json</code> - List books in a dataset</li>
                    <li><code>/api/d/{{dataset}}/{{book}}/{{chapter}}.json</code> - Get a dataset chapter</li>
                </ul>
            </div>

            <div class="section">
                <h2>Example Usage</h2>
                <div class="example">
                    <pre><code>// Get available translations
fetch('/api/available-translations.json')
    .then(response => response.json())
    .then(data => console.log(data));

// Get Genesis 1 from BSB translation
fetch('/api/BSB/GEN/1.json')
    .then(response => response.json())
    .then(chapter => console.log(chapter));</code></pre>
                </div>
            </div>

            <div class="section">
                <h2>Interactive Documentation</h2>
                <p>Explore the API interactively using our OpenAPI documentation:</p>
                <div class="links">
                    <a href="{ROOT_PATH}/docs" class="link-button">Swagger UI</a>
                    <a href="{ROOT_PATH}/redoc" class="link-button secondary">ReDoc</a>
                </div>
            </div>

            <div class="section">
                <h2>Features</h2>
                <ul>
                    <li>✅ Multiple Bible translations in various languages</li>
                    <li>✅ Bible commentaries and study resources</li>
                    <li>✅ Cross-reference datasets</li>
                    <li>✅ CORS enabled for easy integration</li>
                    <li>✅ Fast static file serving</li>
                    <li>✅ JSON format for easy parsing</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>
    """
    return HTMLResponse(content=html_content)

# API Endpoint Documentation
# These endpoints document the static JSON API endpoints served by nginx

@app.get(
    "/api/available-translations.json",
    response_model=List[Dict[str, Any]],
    summary="Get Available Translations",
    description="Returns a list of all available Bible translations with their metadata.",
    tags=["Translations"],
)
async def get_available_translations():
    """
    Get a list of all available Bible translations.
    
    Returns an array of translation objects, each containing:
    - id: Translation identifier (e.g., "BSB")
    - name: Full name of the translation
    - language: Language code
    - and other metadata
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/{translation}/books.json",
    response_model=Dict[str, Any],
    summary="Get Books in Translation",
    description="Returns a list of books available in the specified translation.",
    tags=["Translations"],
)
async def get_translation_books(
    translation: str = Path(..., description="Translation ID (e.g., 'BSB', 'KJV')", example="BSB")
):
    """
    Get a list of books for a specific translation.
    
    - **translation**: The translation identifier (e.g., "BSB" for Berean Standard Bible)
    
    Returns an object containing:
    - translation: Translation metadata
    - books: Array of book objects with metadata
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/{translation}/{book}/{chapter}.json",
    response_model=Dict[str, Any],
    summary="Get Chapter",
    description="Returns the content of a specific chapter from a translation.",
    tags=["Translations"],
)
async def get_chapter(
    translation: str = Path(..., description="Translation ID", example="BSB"),
    book: str = Path(..., description="Book ID (e.g., 'GEN', 'MAT')", example="GEN"),
    chapter: int = Path(..., description="Chapter number", example=1, ge=1)
):
    """
    Get a specific chapter from a translation.
    
    - **translation**: The translation identifier
    - **book**: The book identifier (3-letter code, e.g., "GEN" for Genesis)
    - **chapter**: The chapter number (1-indexed)
    
    Returns a chapter object containing:
    - book: Book metadata
    - chapter: Chapter number
    - verses: Array of verse objects
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/available-commentaries.json",
    response_model=List[Dict[str, Any]],
    summary="Get Available Commentaries",
    description="Returns a list of all available Bible commentaries.",
    tags=["Commentaries"],
)
async def get_available_commentaries():
    """
    Get a list of all available Bible commentaries.
    
    Returns an array of commentary objects with metadata.
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/c/{commentary}/books.json",
    response_model=Dict[str, Any],
    summary="Get Books in Commentary",
    description="Returns a list of books available in the specified commentary.",
    tags=["Commentaries"],
)
async def get_commentary_books(
    commentary: str = Path(..., description="Commentary ID", example="tyndale")
):
    """
    Get a list of books for a specific commentary.
    
    - **commentary**: The commentary identifier
    
    Returns an object containing commentary and book metadata.
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/c/{commentary}/{book}/{chapter}.json",
    response_model=Dict[str, Any],
    summary="Get Commentary Chapter",
    description="Returns the commentary content for a specific chapter.",
    tags=["Commentaries"],
)
async def get_commentary_chapter(
    commentary: str = Path(..., description="Commentary ID", example="tyndale"),
    book: str = Path(..., description="Book ID", example="GEN"),
    chapter: int = Path(..., description="Chapter number", example=1, ge=1)
):
    """
    Get commentary content for a specific chapter.
    
    - **commentary**: The commentary identifier
    - **book**: The book identifier
    - **chapter**: The chapter number
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/available-datasets.json",
    response_model=List[Dict[str, Any]],
    summary="Get Available Datasets",
    description="Returns a list of all available datasets.",
    tags=["Datasets"],
)
async def get_available_datasets():
    """
    Get a list of all available datasets (e.g., cross-references).
    
    Returns an array of dataset objects with metadata.
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/d/{dataset}/books.json",
    response_model=Dict[str, Any],
    summary="Get Books in Dataset",
    description="Returns a list of books available in the specified dataset.",
    tags=["Datasets"],
)
async def get_dataset_books(
    dataset: str = Path(..., description="Dataset ID", example="crossref")
):
    """
    Get a list of books for a specific dataset.
    
    - **dataset**: The dataset identifier
    
    Returns an object containing dataset and book metadata.
    """
    pass  # This endpoint is served by nginx as a static file

@app.get(
    "/api/d/{dataset}/{book}/{chapter}.json",
    response_model=Dict[str, Any],
    summary="Get Dataset Chapter",
    description="Returns the dataset content for a specific chapter.",
    tags=["Datasets"],
)
async def get_dataset_chapter(
    dataset: str = Path(..., description="Dataset ID", example="crossref"),
    book: str = Path(..., description="Book ID", example="GEN"),
    chapter: int = Path(..., description="Chapter number", example=1, ge=1)
):
    """
    Get dataset content for a specific chapter.
    
    - **dataset**: The dataset identifier
    - **book**: The book identifier
    - **chapter**: The chapter number
    """
    pass  # This endpoint is served by nginx as a static file

@app.get("/api/config", tags=["Configuration"])
async def get_config():
    """Get API configuration"""
    config = load_config()
    return JSONResponse(content=config)

@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
